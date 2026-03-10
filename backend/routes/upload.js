const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const { contract } = require("../utils/blockchain");
const { uploadToIPFS } = require("../utils/ipfs");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { description } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Generate SHA-256 hash
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    console.log("File Hash:", fileHash);

    // Upload to IPFS
    const ipfsCID = await uploadToIPFS(fileBuffer, fileName);
    console.log("IPFS CID:", ipfsCID);

    // Store on blockchain
    const tx = await contract.storeEvidence(
      fileName,
      fileHash,
      ipfsCID,
      description || "No description provided"
    );

    await tx.wait();

    res.json({
      success: true,
      message: "Evidence stored successfully!",
      data: {
        fileName,
        fileHash,
        ipfsCID,
        transactionHash: tx.hash,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;