const axios = require("axios");
const FormData = require("form-data");

const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const jwt = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMjQxOGVlNS00MDAzLTRhMTItYmYzYS04NWU1Y2Q5MjQ5YzYiLCJlbWFpbCI6ImFyZ2FtZ2FuZGhpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNDFmZjEzNWQ0YWU4MzdmNzdmZSIsInNjb3BlZEtleVNlY3JldCI6ImQxYmFmZThjNzk1ZmJjMTdmNDUyZjVmZDQ3ZDU1NjE5MzhmNGE4NTY1NWE1OGJhNWM1OGZmMWRkYzMzOWY5ODEiLCJleHAiOjE4MDYyNTQ5MDJ9.ix1zuigKmaUA2-PqIJ5ZqA_AMw5dklokTvWAZGvdB-w";
    
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