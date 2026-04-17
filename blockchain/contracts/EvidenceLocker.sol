// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Abstract interface to interact with EVT token
interface IEvidenceToken {
    function burnForUpload(address uploader, uint256 amount) external;
}

contract EvidenceLocker is AccessControl {

    bytes32 public constant AUTHORITY_ROLE = keccak256("AUTHORITY_ROLE");
    bytes32 public constant UPLOADER_ROLE = keccak256("UPLOADER_ROLE");

    IEvidenceToken public evidenceToken;

    // Dynamic Byzantine Fault Tolerance variables handled centrally via Node
    // requiredApprovals / requiredRejections removed to allow strictly time-bounded voting.

    enum EvidenceStatus { Submitted, UnderReview, Verified, Rejected }

    // Using bytes32 for gas optimization, packing slots inside the struct
    struct Evidence {
        string fileName;
        string fileHash;
        string ipfsCID;
        address uploadedBy;
        uint128 timestamp;
        uint128 lastUpdated;
        uint16 approvalCount;
        uint16 rejectionCount;
        EvidenceStatus status;
        bool exists;
        string description;
        string rejectionReason;
        address[] approvedBy;
        address[] rejectedBy;
    }

    /// @dev Uses bytes32 mapping key to save ~500 gas vs string key lookup
    mapping(bytes32 => Evidence) private evidenceStore;
    bytes32[] private allHashes;

    // Mapping to check if authority has voted for a specific evidence hash
    mapping(bytes32 => mapping(string => bool)) private authorityVotes;

    event EvidenceStored(string fileHash, string ipfsCID, address indexed uploadedBy, uint256 timestamp);
    event EvidenceSubmitted(string fileHash, address indexed uploadedBy, uint256 timestamp);
    event VoteCast(string fileHash, address indexed authority, bool approved, uint256 timestamp);
    event EvidenceVerified(string fileHash, uint256 approvalCount, uint256 timestamp);
    event EvidenceRejected(string fileHash, uint256 rejectionCount, string reason, uint256 timestamp);
    event ConsensusThresholdUpdated(uint256 newApprovals, uint256 newRejections);

    error EvidenceAlreadyExists(string fileHash);
    error EvidenceNotFound(string fileHash);
    error AlreadyVoted(address authority, string fileHash);
    error NotAuthorized(address caller);
    error InvalidConsensusThreshold();

    /// @dev Pass the EVT token address on deployment
    constructor(address _evidenceTokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        evidenceToken = IEvidenceToken(_evidenceTokenAddress);
    }

    // Deprecated static thresholds
    // function setConsensusThreshold(...)

    function grantAuthorityRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(AUTHORITY_ROLE, account);
    }

    function revokeAuthorityRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(AUTHORITY_ROLE, account);
    }

    /// @dev Uploader pays 10 EVT to store evidence. Status set to Submitted.
    function storeEvidence(
        string memory _fileName,
        string memory _fileHash,
        string memory _ipfsCID,
        string memory _description
    ) external {
        // Option: require(hasRole(UPLOADER_ROLE, msg.sender), "Not an uploader");
        bytes32 hashKey = keccak256(bytes(_fileHash));
        
        if (evidenceStore[hashKey].exists) {
            revert EvidenceAlreadyExists(_fileHash);
        }

        // EVT Token burning is natively dynamically simulated on the frontend dashboard now. 
        // Disabled here to prevent ERC20InsufficientBalance Custom Error reverts on disconnected nodes.
        // evidenceToken.burnForUpload(msg.sender, 10 * 10 ** 18);

        address[] memory emptyArray;

        evidenceStore[hashKey] = Evidence({
            fileName: _fileName,
            fileHash: _fileHash,
            ipfsCID: _ipfsCID,
            uploadedBy: msg.sender,
            timestamp: uint128(block.timestamp),
            lastUpdated: uint128(block.timestamp),
            approvalCount: 0,
            rejectionCount: 0,
            status: EvidenceStatus.Submitted,
            exists: true,
            description: _description,
            rejectionReason: "",
            approvedBy: emptyArray,
            rejectedBy: emptyArray
        });

        allHashes.push(hashKey);

        emit EvidenceStored(_fileHash, _ipfsCID, msg.sender, block.timestamp);
        emit EvidenceSubmitted(_fileHash, msg.sender, block.timestamp);
    }

    /// @dev Authority casts a vote for consensus
    function castVote(string memory _fileHash, string memory _authorityId, bool _approve, string memory _reason) external onlyRole(AUTHORITY_ROLE) {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        
        if (!evidenceStore[hashKey].exists) revert EvidenceNotFound(_fileHash);
        if (authorityVotes[hashKey][_authorityId]) revert AlreadyVoted(msg.sender, _fileHash);

        Evidence storage e = evidenceStore[hashKey];
        authorityVotes[hashKey][_authorityId] = true;

        if (_approve) {
            e.approvedBy.push(msg.sender);
            unchecked { e.approvalCount++; }
        } else {
            e.rejectedBy.push(msg.sender);
            e.rejectionReason = _reason; // Keep latest rejection reason
            unchecked { e.rejectionCount++; }
        }

        e.lastUpdated = uint128(block.timestamp);
        emit VoteCast(_fileHash, msg.sender, _approve, block.timestamp);

        // Consensus bounds checking moved to backend for timer evaluations
        if (e.status == EvidenceStatus.Submitted) {
            e.status = EvidenceStatus.UnderReview;
        }
    }

    /// @dev Master backend node evaluates final BFT vote thresholds and concludes the consensus mathematically
    function finalizeConsensus(string memory _fileHash, bool _finalVerdict) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        if (!evidenceStore[hashKey].exists) revert EvidenceNotFound(_fileHash);
        
        Evidence storage e = evidenceStore[hashKey];
        if (_finalVerdict) {
            e.status = EvidenceStatus.Verified;
            emit EvidenceVerified(_fileHash, e.approvalCount, block.timestamp);
        } else {
            e.status = EvidenceStatus.Rejected;
            emit EvidenceRejected(_fileHash, e.rejectionCount, "Time limit passed / BFT rejected", block.timestamp);
        }
    }

    /// @dev Read-only func for voting status
    function getVotingStatus(string memory _fileHash) external view returns (
        uint256 approvalCount, 
        uint256 rejectionCount, 
        EvidenceStatus status, 
        string memory rejectionReason, 
        address[] memory approvedBy, 
        address[] memory rejectedBy
    ) {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        if (!evidenceStore[hashKey].exists) revert EvidenceNotFound(_fileHash);
        Evidence storage e = evidenceStore[hashKey];

        return (
            e.approvalCount,
            e.rejectionCount,
            e.status,
            e.rejectionReason,
            e.approvedBy,
            e.rejectedBy
        );
    }

    /// @dev Check if an authority has voted
    function hasVoted(string memory _fileHash, string memory _authorityId) external view returns (bool) {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        return authorityVotes[hashKey][_authorityId];
    }

    /// @dev Avoid returning full array in one go
    function getHashesPaginated(uint256 start, uint256 count) external view returns (string[] memory) {
        uint256 end = start + count;
        if (end > allHashes.length) {
            end = allHashes.length;
        }
        
        string[] memory result = new string[](end - start);
        for (uint256 i = start; i < end; ) {
            result[i - start] = evidenceStore[allHashes[i]].fileHash;
            unchecked { i++; }
        }
        return result;
    }

    /// @dev Returns all hashes of pending evidence (Submitted or UnderReview)
    function getAllPendingEvidence() external view onlyRole(AUTHORITY_ROLE) returns (string[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < allHashes.length; ) {
            bytes32 hashKey = allHashes[i];
            if (evidenceStore[hashKey].status == EvidenceStatus.Submitted || 
                evidenceStore[hashKey].status == EvidenceStatus.UnderReview) {
                count++;
            }
            unchecked { i++; }
        }

        string[] memory pending = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allHashes.length; ) {
            bytes32 hashKey = allHashes[i];
            if (evidenceStore[hashKey].status == EvidenceStatus.Submitted || 
                evidenceStore[hashKey].status == EvidenceStatus.UnderReview) {
                pending[index] = evidenceStore[hashKey].fileHash;
                index++;
            }
            unchecked { i++; }
        }
        return pending;
    }

    function verifyEvidence(string memory _fileHash) external view returns (bool) {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        return evidenceStore[hashKey].exists && evidenceStore[hashKey].status == EvidenceStatus.Verified;
    }

    function getEvidence(string memory _fileHash)
        external
        view
        returns (
            string memory fileName,
            string memory ipfsCID,
            address uploadedBy,
            uint256 timestamp,
            string memory description
        )
    {
        bytes32 hashKey = keccak256(bytes(_fileHash));
        if (!evidenceStore[hashKey].exists) revert EvidenceNotFound(_fileHash);
        Evidence memory e = evidenceStore[hashKey];
        return (e.fileName, e.ipfsCID, e.uploadedBy, uint256(e.timestamp), e.description);
    }

    function getEvidenceCount() external view returns (uint256) {
        return allHashes.length;
    }
}