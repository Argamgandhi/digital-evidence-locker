const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const contractABI = require("../EvidenceLocker.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI.abi,
  wallet
);

module.exports = { contract, provider, wallet };