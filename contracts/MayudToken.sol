//SPDX-License-Identifier:MIT 

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

//Deployed at GOERLI : 0x6e54368F215c1964D73dBFD921506A1483b146BF
contract MayudToken is ERC20, ERC20Burnable, Ownable{

    address public marketingWallet;
    address public developmentWallet;
    uint8 public marketingFeePercentage;
    uint8 public developmentFeePercentage;


    constructor() ERC20("Mayud", "MYD") {
        _mint(msg.sender, 100000000000 * 10 ** decimals());

        //Default values
        marketingFeePercentage = 2;
        developmentFeePercentage = 2;

        marketingWallet=0xBc0250F969Ba915b5E1b31054aC6527101b02301;
        developmentWallet=0x8169c77F3Ee87365C8E908fCF39740083FC80289;

    }

    /**
     * @dev This function will mint new tokens
     * @param to the address where the newly minted tokens will be sent.
     * @param amount the amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        amount = amount * 10 ** decimals();
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        
        if(_msgSender() != owner()){
            uint256 marketingFee = (marketingFeePercentage * amount) / 100;
            uint256 developmentFee = (developmentFeePercentage * amount) / 100;

            amount = amount - (marketingFee + developmentFee);

            super.transfer(marketingWallet, marketingFee);
            super.transfer(developmentWallet, developmentFee);
        
        }

        super.transfer(to, amount);

        return true;
    }


    function setMarketingWallet(address walletAddress) public onlyOwner{

        require(walletAddress != address(0), "Wallet address cant be 0 address");
        marketingWallet = walletAddress;
    }
    
    function setDevelopmentWallet(address walletAddress) public onlyOwner{

        require(walletAddress != address(0), "Wallet address cant be 0 address");
        developmentWallet = walletAddress;
    }

    function setMarketingFeePercentage(uint8 value) public onlyOwner{
        require(value >0 && value <100, "Value must be between 0 and 100");
        marketingFeePercentage = value;
    }

    function setDevelopmentFeePercentage(uint8 value) public onlyOwner{
        require(value >0 && value <100, "Value must be between 0 and 100");
        developmentFeePercentage = value;
    }

}