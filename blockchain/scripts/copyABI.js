const fs = require("fs");
const path = require("path");

const abiSource = path.join(
  __dirname,
  "../artifacts/contracts/EvidenceLocker.sol/EvidenceLocker.json"
);

const abiDest = path.join(__dirname, "../../backend/EvidenceLocker.json");

fs.copyFileSync(abiSource, abiDest);
console.log("✅ ABI copied to backend folder!");