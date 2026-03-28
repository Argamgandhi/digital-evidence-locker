const axios = require("axios");
const FormData = require("form-data");

const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const jwt = process.env.PINATA_JWT;
    
    if (!jwt) {
      console.error("PINATA_JWT environment variable is not set!");
      throw new Error("PINATA_JWT not configured");
    }

    console.log("Uploading to IPFS, file:", fileName, "JWT starts with:", jwt.substring(0, 10));

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
        maxContentLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const cid = response.data.IpfsHash;
    console.log("IPFS upload success, CID:", cid);
    return cid;
  } catch (error) {
    console.error("IPFS upload error:", error.response?.data || error.message);
    throw new Error("IPFS upload failed: " + (error.response?.data?.error?.details || error.message));
  }
};

module.exports = { uploadToIPFS };