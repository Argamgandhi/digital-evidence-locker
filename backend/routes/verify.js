const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const { contract } = require("../utils/blockchain");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Verify by uploading file
router.post("/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    const exists = await contract.verifyEvidence(fileHash);

    if (exists) {
      const details = await contract.getEvidence(fileHash);
      res.json({
        success: true,
        isValid: true,
        message: "✅ Evidence is authentic and untampered!",
        data: {
          fileHash,
          fileName: details[0],
          ipfsCID: details[1],
          uploadedBy: details[2],
          timestamp: new Date(Number(details[3]) * 1000).toLocaleString(),
          description: details[4],
        },
      });
    } else {
      res.json({
        success: true,
        isValid: false,
        message: "❌ Evidence not found or has been tampered!",
        data: { fileHash },
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify by hash string
router.post("/hash", async (req, res) => {
  try {
    const { fileHash } = req.body;

    if (!fileHash) {
      return res.status(400).json({ error: "No hash provided" });
    }

    const exists = await contract.verifyEvidence(fileHash);

    if (exists) {
      const details = await contract.getEvidence(fileHash);
      res.json({
        success: true,
        isValid: true,
        message: "✅ Evidence is authentic!",
        data: {
          fileHash,
          fileName: details[0],
          ipfsCID: details[1],
          uploadedBy: details[2],
          timestamp: new Date(Number(details[3]) * 1000).toLocaleString(),
          description: details[4],
        },
      });
    } else {
      res.json({
        success: true,
        isValid: false,
        message: "❌ Evidence not found or tampered!",
        data: { fileHash },
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;