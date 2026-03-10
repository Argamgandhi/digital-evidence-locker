// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EvidenceLocker {

    struct Evidence {
        string fileName;
        string fileHash;
        string ipfsCID;
        address uploadedBy;
        uint256 timestamp;
        string description;
        bool exists;
    }

    mapping(string => Evidence) private evidenceStore;
    string[] private allHashes;

    event EvidenceStored(
        string fileHash,
        string ipfsCID,
        address indexed uploadedBy,
        uint256 timestamp
    );

    event EvidenceVerified(
        string fileHash,
        bool isValid,
        address indexed verifiedBy,
        uint256 timestamp
    );

    function storeEvidence(
        string memory _fileName,
        string memory _fileHash,
        string memory _ipfsCID,
        string memory _description
    ) public {
        require(!evidenceStore[_fileHash].exists, "Evidence already exists!");

        evidenceStore[_fileHash] = Evidence({
            fileName: _fileName,
            fileHash: _fileHash,
            ipfsCID: _ipfsCID,
            uploadedBy: msg.sender,
            timestamp: block.timestamp,
            description: _description,
            exists: true
        });

        allHashes.push(_fileHash);
        emit EvidenceStored(_fileHash, _ipfsCID, msg.sender, block.timestamp);
    }

    function verifyEvidence(string memory _fileHash) public returns (bool) {
        bool isValid = evidenceStore[_fileHash].exists;
        emit EvidenceVerified(_fileHash, isValid, msg.sender, block.timestamp);
        return isValid;
    }

    function getEvidence(string memory _fileHash)
        public
        view
        returns (
            string memory fileName,
            string memory ipfsCID,
            address uploadedBy,
            uint256 timestamp,
            string memory description
        )
    {
        require(evidenceStore[_fileHash].exists, "Evidence not found!");
        Evidence memory e = evidenceStore[_fileHash];
        return (e.fileName, e.ipfsCID, e.uploadedBy, e.timestamp, e.description);
    }

    function getEvidenceCount() public view returns (uint256) {
        return allHashes.length;
    }

    function getAllHashes() public view returns (string[] memory) {
        return allHashes;
    }
}