const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Upload, User } = require('../models');
const { castVote, getVotingStatus, getAllPendingEvidence, getEvidence, finalizeConsensus } = require('../utils/blockchain');

const authAuthority = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Not authenticated' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || user.userType !== 'verification_authority') {
      return res.status(403).json({ error: 'Access denied. Authority only.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/consensus/vote
router.post('/vote', authAuthority, async (req, res) => {
  try {
    console.log("okie");
    const { fileHash, approve, reason } = req.body;
    if (!fileHash || approve === undefined) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    const txHash = await castVote(fileHash, req.user.id.toString(), approve, reason);
    const statusData = await getVotingStatus(fileHash);

    // BFT 2/3 Evaluation Logic
    const totalVerifiers = await User.count({
      where: { userType: 'verification_authority', organisation: req.user.organisation }
    });

    // Byzantine minimum consensus boundary
    const threshold = Math.ceil((totalVerifiers * 2) / 3);

    // Dynamic resolution intercept
    let finalStatus = statusData.status;

    if (statusData.approvalCount >= threshold) {
      await finalizeConsensus(fileHash, true);
      finalStatus = 'Verified';
    } else if (statusData.rejectionCount > (totalVerifiers - threshold)) {
      await finalizeConsensus(fileHash, false);
      finalStatus = 'Rejected';
    } else if ((statusData.approvalCount + statusData.rejectionCount) >= totalVerifiers) {
      // All voted but threshold not reached => Reject
      await finalizeConsensus(fileHash, false);
      finalStatus = 'Rejected';
    }

    // Update the database
    await Upload.update({
      status: finalStatus,
      approvalCount: statusData.approvalCount,
      rejectionCount: statusData.rejectionCount,
      rejectionReason: statusData.rejectionReason !== "" ? statusData.rejectionReason : null
    }, { where: { fileHash } });

    res.json({
      success: true,
      message: 'Vote recorded on blockchain',
      newStatus: statusData.status,
      approvalCount: statusData.approvalCount,
      rejectionCount: statusData.rejectionCount,
      txHash
    });
  } catch (error) {
    console.error('Consensus vote error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/consensus/pending
router.get('/pending', authAuthority, async (req, res) => {
  try {
    const pendingHashes = await getAllPendingEvidence();

    if (!pendingHashes || pendingHashes.length === 0) {
      return res.json({ success: true, pending: [] });
    }

    // Fetch details for all from local DB mapping, isolating by same organisation
    let pendingDb = await Upload.findAll({
      where: { fileHash: pendingHashes },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email', 'userType', 'organisation'],
        where: { organisation: req.user.organisation }
      }]
    });

    const TIME_LIMIT_MS = 5 * 60 * 1000; // 5 minutes deadnode timeout
    const currentMs = Date.now();
    const finalDb = [];

    // Evaluate Deadnodes manually if time passed
    for (const record of pendingDb) {
      const ageMs = currentMs - new Date(record.uploadedAt).getTime();

      if (ageMs > TIME_LIMIT_MS) {
        const statusData = await getVotingStatus(record.fileHash);
        const totalVerifiers = await User.count({ where: { userType: 'verification_authority', organisation: record.User.organisation } });
        const threshold = Math.ceil((totalVerifiers * 2) / 3);

        const isVerified = statusData.approvalCount >= threshold;
        await finalizeConsensus(record.fileHash, isVerified);

        await Upload.update({ status: isVerified ? 'Verified' : 'Rejected' }, { where: { fileHash: record.fileHash } });
      } else {
        finalDb.push(record);
      }
    }

    res.json({ success: true, pending: finalDb });
  } catch (error) {
    console.error('Get pending consensus error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/consensus/status/:fileHash
router.get('/status/:fileHash', async (req, res) => {
  try {
    const { fileHash } = req.params;
    const statusData = await getVotingStatus(fileHash);

    res.json({
      success: true,
      data: statusData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
