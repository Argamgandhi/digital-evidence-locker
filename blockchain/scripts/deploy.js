const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying EvidenceLocker contract...");

  const EvidenceLocker = await hre.ethers.getContractFactory("EvidenceLocker");
  const evidenceLocker = await EvidenceLocker.deploy();

  await evidenceLocker.waitForDeployment();

  const address = await evidenceLocker.getAddress();
  console.log("✅ EvidenceLocker deployed to:", address);

  const contractData = {
    address: address,
    network: hre.network.name,
  };

  fs.writeFileSync(
    "../backend/contractAddress.json",
    JSON.stringify(contractData, null, 2)
  );

  console.log("✅ Contract address saved to backend/contractAddress.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });