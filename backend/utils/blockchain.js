const { ethers } = require('ethers');
const contractABI = require('../abi/EvidenceLocker.json');
const contractAddress = require('../../blockchain/deployments.json'); // Updated path since deployments are stored differently now depending on execution context. It's safe to assume `deployments.json` if we read the earlier script

const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    contractAddress.EvidenceLocker,
    contractABI.abi,
    wallet
  );
  return contract;
};

const registerEvidence = async (fileHash, ipfsCID, fileName, description) => {
  try {
    const contract = getContract();
    const tx = await contract.storeEvidence(
      fileName,
      fileHash,
      ipfsCID,
      description
    );
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('storeEvidence error:', error);
    throw error;
  }
};

const castVote = async (fileHash, authorityId, approve, reason) => {
  try {
    const contract = getContract();
    const tx = await contract.castVote(fileHash, authorityId, approve, reason || "");
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('castVote error:', error);
    throw error;
  }
}

const getVotingStatus = async (fileHash) => {
  try {
    const contract = getContract();
    const result = await contract.getVotingStatus(fileHash);
    
    // Convert Enum to string
    const statusMap = ["Submitted", "UnderReview", "Verified", "Rejected"];
    const statusIdx = Number(result.status);
    
    return {
      approvalCount: Number(result.approvalCount),
      rejectionCount: Number(result.rejectionCount),
      status: statusMap[statusIdx],
      rejectionReason: result.rejectionReason,
      approvedBy: [...result.approvedBy],
      rejectedBy: [...result.rejectedBy]
    };
  } catch (error) {
    console.error('getVotingStatus error:', error);
    throw error;
  }
}

const getAllPendingEvidence = async () => {
  try {
    const contract = getContract();
    const result = await contract.getAllPendingEvidence();
    return [...result]; // array of string hashes
  } catch (error) {
    console.error('getAllPendingEvidence error:', error);
    throw error;
  }
}

const verifyEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    await contract.getEvidence(fileHash);
    return true; // Exists on blockchain
  } catch (error) {
    return false;
  }
};

const getEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    const result = await contract.getEvidence(fileHash);
    return {
      fileName:    result[0],
      ipfsCID:     result[1],
      uploadedBy:  result[2],
      timestamp:   result[3],  
      description: result[4],
    };
  } catch (error) {
    console.error('getEvidence error:', error);
    throw error;
  }
};

const finalizeConsensus = async (fileHash, finalVerdict) => {
  try {
    const contract = getContract();
    const tx = await contract.finalizeConsensus(fileHash, finalVerdict);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('finalizeConsensus error:', error);
    throw error;
  }
};

module.exports = { registerEvidence, verifyEvidence, getEvidence, castVote, getVotingStatus, getAllPendingEvidence, finalizeConsensus };