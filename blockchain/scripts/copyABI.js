const fs = require("fs");
const path = require("path");

function copyABI() {
  const contracts = ["EvidenceLocker", "EvidenceToken"];
  
  const backendDest = path.join(__dirname, "../../backend/abi");
  const frontendDest = path.join(__dirname, "../../frontend/src/abi");
  
  if (!fs.existsSync(backendDest)) fs.mkdirSync(backendDest, { recursive: true });
  if (!fs.existsSync(frontendDest)) fs.mkdirSync(frontendDest, { recursive: true });

  contracts.forEach(contractName => {
    const sourceFilePath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    
    if (fs.existsSync(sourceFilePath)) {
      const backendFilePath = path.join(backendDest, `${contractName}.json`);
      const frontendFilePath = path.join(frontendDest, `${contractName}.json`);
      
      fs.copyFileSync(sourceFilePath, backendFilePath);
      fs.copyFileSync(sourceFilePath, frontendFilePath);
      
      console.log(`✅ Copied ${contractName} ABI to backend and frontend!`);
    } else {
      console.log(`❌ ABI for ${contractName} not found. Did you run 'npx hardhat compile'?`);
    }
  });
}

copyABI();