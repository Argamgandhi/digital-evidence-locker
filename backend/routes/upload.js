const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const { uploadToIPFS } = require('../utils/ipfs');
const { registerEvidence } = require('../utils/blockchain');
const { Upload, User } = require('../models');
const jwt = require('jsonwebtoken');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const getUser = (req) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return null;
    const token = auth.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { description } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const fileSize = `${(req.file.size / 1024).toFixed(2)} KB`;

    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const ipfsCID = await uploadToIPFS(fileBuffer, fileName);
    const txHash = await registerEvidence(fileHash, ipfsCID, fileName, description || '');

    const user = getUser(req);
    if (user) {
      await Upload.create({
        userId: user.id,
        fileName,
        fileHash,
        ipfsCID,
        description: description || '',
        txHash,
        fileSize,
      });
    }

    res.json({
      success: true,
      fileHash,
      ipfsCID,
      txHash,
      fileName,
      message: 'Evidence registered on blockchain successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// GET /api/upload/my-uploads
router.get('/my-uploads', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Not authenticated' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const uploads = await Upload.findAll({
      where: { userId: decoded.id },
      order: [['uploadedAt', 'DESC']],
    });

    res.json({ success: true, uploads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/upload/all — verification authority only
router.get('/all', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Not authenticated' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || user.userType !== 'verification_authority') {
      return res.status(403).json({ error: 'Access denied. Verification Authority only.' });
    }

    const uploads = await Upload.findAll({
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'userType'] }],
      order: [['uploadedAt', 'DESC']],
    });

    res.json({ success: true, uploads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/upload/stats — public stats for home page
router.get('/stats', async (req, res) => {
  try {
    const totalUploads = await Upload.count();
    const totalUsers = await User.count();
    const recentUploads = await Upload.findAll({
      limit: 5,
      order: [['uploadedAt', 'DESC']],
      attributes: ['fileName', 'fileHash', 'uploadedAt', 'txHash'],
    });

    res.json({ success: true, totalUploads, totalUsers, recentUploads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;