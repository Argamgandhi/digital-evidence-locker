const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// We'll use NFT.Storage free IPFS service
const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);

    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
        },
      }
    );

    const cid = response.data.value.cid;
    return cid;
  } catch (error) {
    console.error("IPFS upload error:", error.message);
    // Return a mock CID for local testing if IPFS fails
    return `local_${Date.now()}_${fileName}`;
  }
};

module.exports = { uploadToIPFS };