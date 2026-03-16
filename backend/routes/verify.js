const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const axios = require('axios');
const { verifyEvidence, getEvidence } = require('../utils/blockchain');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/verify/file  — verify by uploading the file
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const exists = await verifyEvidence(fileHash);

    if (!exists) {
      return res.json({
        isValid: false,
        message: '❌ File not found or has been tampered with',
        data: { fileHash },
      });
    }

    const evidence = await getEvidence(fileHash);
    res.json({
      isValid: true,
      message: '✅ File is authentic and verified on blockchain',
      data: {
        fileHash,
        fileName:    evidence.fileName,
        description: evidence.description,
        uploadedBy:  evidence.uploadedBy,
        timestamp:   new Date(Number(evidence.timestamp) * 1000).toLocaleString(),
        ipfsCID:     evidence.ipfsCID,
        ipfsURL:     `https://gateway.pinata.cloud/ipfs/${evidence.ipfsCID}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/verify/hash  — verify by hash string
router.post('/hash', async (req, res) => {
  try {
    const { fileHash } = req.body;
    if (!fileHash) return res.status(400).json({ error: 'No hash provided' });

    const exists = await verifyEvidence(fileHash);

    if (!exists) {
      return res.json({
        isValid: false,
        message: '❌ Hash not found on blockchain',
        data: { fileHash },
      });
    }

    const evidence = await getEvidence(fileHash);
    res.json({
      isValid: true,
      message: '✅ Evidence verified on blockchain',
      data: {
        fileHash,
        fileName:    evidence.fileName,
        description: evidence.description,
        uploadedBy:  evidence.uploadedBy,
        timestamp:   new Date(Number(evidence.timestamp) * 1000).toLocaleString(),
        ipfsCID:     evidence.ipfsCID,
        ipfsURL:     `https://gateway.pinata.cloud/ipfs/${evidence.ipfsCID}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/verify/download/:fileHash  — download file from IPFS by hash
router.get('/download/:fileHash', async (req, res) => {
  try {
    const { fileHash } = req.params;

    const exists = await verifyEvidence(fileHash);
    if (!exists) return res.status(404).json({ error: 'Evidence not found on blockchain' });

    const evidence = await getEvidence(fileHash);
    const ipfsURL = `https://gateway.pinata.cloud/ipfs/${evidence.ipfsCID}`;

    // Stream file from IPFS to user
    const response = await axios.get(ipfsURL, { responseType: 'stream' });

    res.setHeader('Content-Disposition', `attachment; filename="${evidence.fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;