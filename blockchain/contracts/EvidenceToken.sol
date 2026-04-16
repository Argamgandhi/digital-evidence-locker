// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Note: If you don't have openzeppelin contracts installed, run `npm install @openzeppelin/contracts`
// in the blockchain folder before compiling.

contract EvidenceToken is ERC20, Ownable {
    address public evidenceLockerAddress;

    event TokensRewarded(address indexed authority, uint256 amount);
    event TokensBurned(address indexed uploader, uint256 amount);
    
    error NotAuthorized(address caller);
    error InvalidLockerAddress();

    /// @dev Mint 1,000,000 EVT to deployer
    constructor() ERC20("Evidence Token", "EVT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @dev Called by Owner to set locker address
    function setEvidenceLockerContract(address lockerAddress) external onlyOwner {
        if (lockerAddress == address(0)) revert InvalidLockerAddress();
        evidenceLockerAddress = lockerAddress;
    }

    /// @dev Called only by EvidenceLocker to burn EVT from uploader
    function burnForUpload(address uploader, uint256 amount) external {
        if (msg.sender != evidenceLockerAddress) {
            revert NotAuthorized(msg.sender);
        }
        _burn(uploader, amount);
        emit TokensBurned(uploader, amount);
    }

    /// @dev Mint tokens as a reward to authority
    function rewardAuthority(address authority, uint256 amount) external onlyOwner {
        _mint(authority, amount);
        emit TokensRewarded(authority, amount);
    }
}
