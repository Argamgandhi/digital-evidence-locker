const axios = require("axios");
const FormData = require("form-data");

const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: fileName,
      contentType: "application/octet-stream",
    });

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    const cid = response.data.IpfsHash;
    console.log("IPFS upload success, CID:", cid);
    return cid;
  } catch (error) {
    console.error("IPFS upload error:", error.message);
    throw new Error("IPFS upload failed: " + error.message);
  }
};

module.exports = { uploadToIPFS };