const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load ABI and contract address
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

const registerEvidence = async (fileHash, ipfsCID, fileName, description) => {
  try {
    const contract = getContract();
    const tx = await contract.registerEvidence(fileHash, ipfsCID, fileName, description);
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('registerEvidence error:', error);
    throw error;
  }
};

const verifyEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    const exists = await contract.verifyEvidence(fileHash);
    return exists;
  } catch (error) {
    console.error('verifyEvidence error:', error);
    return false;
  }
};

const getEvidence = async (fileHash) => {
  try {
    const contract = getContract();
    const evidence = await contract.getEvidence(fileHash);
    return {
      ipfsCID:     evidence[0],
      fileName:    evidence[1],
      description: evidence[2],
      uploadedBy:  evidence[3],
      timestamp:   evidence[4],
    };
  } catch (error) {
    console.error('getEvidence error:', error);
    throw error;
  }
};

module.exports = { registerEvidence, verifyEvidence, getEvidence };