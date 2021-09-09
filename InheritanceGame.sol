// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.3 <0.9.0;

import "./Farcebook.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crown is ERC721, Ownable {
    address private inheritanceGame;
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (uint256 => string) _tokenUris;
    mapping (address => bool) _sovereigns;
    constructor(address _inheritanceGame) ERC721("Crown", "NFT") {
        inheritanceGame = _inheritanceGame;
    }
    function _mintNFT(address recipient, string memory tokenURI)
        external onlyOwner
        returns (uint256)
    {
        require(msg.sender == inheritanceGame, "only the worthy may mint a crown");
        require(!_sovereigns[recipient], "a sovereign may receive only one crown");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _tokenUris[newItemId] = tokenURI;
        _sovereigns[recipient] = true;
        return newItemId;
    }
}

/**
 * @title InheritanceGame
 * @dev The quest to find the heir to the kingdom of Farcebook
 */
contract InheritanceGame is Farcebook {
    address public crown;
    constructor() Farcebook() {
        Crown _crown = new Crown(address(this));
        crown = address(_crown);
    }
    
    function nameHeir(address heir, string memory tokenURI) public returns (uint256) {
        require(heir != sovereign, "this heir is already the sovereign");
        require(subjects[heir].balance >= 1000000000, "this heir is not worthy");
        sovereignName = subjects[heir].name;
        sovereign = heir;
        
        return Crown(crown)._mintNFT(address(heir), tokenURI);
    }
    
    function earnSugarCoins() onlySubject public {
        subjects[msg.sender].balance += 1000;
    }
    
    function doubleSugarCoins() onlySubject public {
        subjects[msg.sender].balance *= 2;
    }
    
    function gambleSugarCoins(uint32 amount) onlySubject public {
        require(subjects[msg.sender].balance >= amount, "you may not stake what you do not have!");
        subjects[msg.sender].balance -= amount;
        
        uint rand = uint(keccak256(abi.encodePacked(block.number + amount)));
        
        if (rand % 11 == 0) {
            subjects[msg.sender].balance += amount * 11;
        }
    }
}
