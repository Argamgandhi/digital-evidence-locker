const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying EvidenceToken and EvidenceLocker contracts...");

  const [deployer, authority1, authority2] = await hre.ethers.getSigners();

  // 1. Deploy Token
  const EvidenceToken = await hre.ethers.getContractFactory("EvidenceToken");
  const evidenceToken = await EvidenceToken.deploy();
  await evidenceToken.waitForDeployment();
  const tokenAddress = await evidenceToken.getAddress();
  console.log("✅ EvidenceToken deployed to:", tokenAddress);

  // 2. Deploy Locker with Token Address
  const EvidenceLocker = await hre.ethers.getContractFactory("EvidenceLocker");
  const evidenceLocker = await EvidenceLocker.deploy(tokenAddress);
  await evidenceLocker.waitForDeployment();
  const lockerAddress = await evidenceLocker.getAddress();
  console.log("✅ EvidenceLocker deployed to:", lockerAddress);

  // 3. Link locker to token
  await evidenceToken.setEvidenceLockerContract(lockerAddress);
  console.log("✅ Linked EvidenceLocker to EvidenceToken");

  // 4. Grant AUTHORITY_ROLE
  console.log("Granting AUTHORITY_ROLE to initial authorities...");
  const AUTHORITY_ROLE = await evidenceLocker.AUTHORITY_ROLE();
  await evidenceLocker.grantRole(AUTHORITY_ROLE, deployer.address); 
  if (authority1) await evidenceLocker.grantRole(AUTHORITY_ROLE, authority1.address);
  if (authority2) await evidenceLocker.grantRole(AUTHORITY_ROLE, authority2.address);

  const contractData = {
    network: hre.network.name,
    EvidenceToken: tokenAddress,
    EvidenceLocker: lockerAddress
  };

  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(contractData, null, 2)
  );
  console.log("✅ Saved deployments to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });