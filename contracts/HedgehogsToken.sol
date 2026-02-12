// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Hedgehogs Token (HOGS)
 * @dev ERC20 Token for the Hedgehogs Rescue Project
 * 
 * Features:
 * - Fixed supply of 1 billion tokens
 * - Burnable (holders can burn their tokens)
 * - Pausable (owner can pause transfers in emergency)
 * - 100% of trading fees will fund animal shelters (implemented in DEX integration)
 */
contract HedgehogsToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // Maximum supply: 1 billion tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Rescue fund wallet address
    address public rescueFundWallet;
    
    // Staking contract address (will be set after staking contract deployment)
    address public stakingContract;
    
    // Events
    event RescueFundWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event StakingContractUpdated(address indexed oldContract, address indexed newContract);
    
    /**
     * @dev Constructor that mints the total supply to the deployer
     * @param _rescueFundWallet Address of the rescue fund wallet
     */
    constructor(address _rescueFundWallet) ERC20("Hedgehogs", "HOGS") Ownable(msg.sender) {
        require(_rescueFundWallet != address(0), "Invalid rescue fund wallet");
        
        rescueFundWallet = _rescueFundWallet;
        
        // Mint total supply to deployer
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    /**
     * @dev Update the rescue fund wallet address
     * @param _newWallet New rescue fund wallet address
     */
    function setRescueFundWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        address oldWallet = rescueFundWallet;
        rescueFundWallet = _newWallet;
        emit RescueFundWalletUpdated(oldWallet, _newWallet);
    }
    
    /**
     * @dev Set the staking contract address
     * @param _stakingContract Address of the staking contract
     */
    function setStakingContract(address _stakingContract) external onlyOwner {
        require(_stakingContract != address(0), "Invalid staking contract");
        address oldContract = stakingContract;
        stakingContract = _stakingContract;
        emit StakingContractUpdated(oldContract, _stakingContract);
    }
    
    /**
     * @dev Pause token transfers (emergency use only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer function to add pause functionality
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }
    
    /**
     * @dev Allows owner to withdraw any accidentally sent ERC20 tokens
     * @param token Address of the token to withdraw
     * @param amount Amount to withdraw
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "Cannot rescue HOGS tokens");
        IERC20(token).transfer(owner(), amount);
    }
}
