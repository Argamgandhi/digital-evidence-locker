const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Upload, User } = require('../models');
const { castVote, getVotingStatus, getAllPendingEvidence, getEvidence } = require('../utils/blockchain');

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

    // Update the database
    await Upload.update({
      status: statusData.status,
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
    const pendingDb = await Upload.findAll({
      where: { fileHash: pendingHashes },
      include: [{ 
        model: User, 
        attributes: ['firstName', 'lastName', 'email', 'userType', 'organisation'],
        where: { organisation: req.user.organisation }
      }]
    });

    res.json({ success: true, pending: pendingDb });
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
