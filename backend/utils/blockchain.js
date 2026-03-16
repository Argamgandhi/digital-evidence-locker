const { ethers } = require('ethers');
const contractABI = require('../EvidenceLocker.json');
const contractAddress = require('../contractAddress.json');

const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    contractAddress.address,
    contractABI.abi,
    wallet
  );
  return contract;
};

// Matches ABI: storeEvidence(fileName, fileHash, ipfsCID, description)
const registerEvidence = async (fileHash, ipfsCID, fileName, description) => {
  try {
    const contract = getContract();
    const tx = await contract.storeEvidence(
      fileName,    // _fileName  (first param in ABI)
      fileHash,    // _fileHash  (second param in ABI)
      ipfsCID,     // _ipfsCID   (third param in ABI)
      description  // _description (fourth param in ABI)
    );
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('storeEvidence error:', error);
    throw error;
  }
};

// Matches ABI: verifyEvidence(_fileHash) returns bool
const verifyEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    // verifyEvidence is nonpayable (not view) in the ABI - need to call statically
    const exists = await contract.verifyEvidence.staticCall(fileHash);
    return exists;
  } catch (error) {
    console.error('verifyEvidence error:', error);
    return false;
  }
};

// Matches ABI: getEvidence(_fileHash) returns (fileName, ipfsCID, uploadedBy, timestamp, description)
const getEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    const result = await contract.getEvidence(fileHash);
    return {
      fileName:    result[0],  // index 0 = fileName
      ipfsCID:     result[1],  // index 1 = ipfsCID
      uploadedBy:  result[2],  // index 2 = uploadedBy (address)
      timestamp:   result[3],  // index 3 = timestamp
      description: result[4],  // index 4 = description
    };
  } catch (error) {
    console.error('getEvidence error:', error);
    throw error;
  }
};

module.exports = { registerEvidence, verifyEvidence, getEvidence };