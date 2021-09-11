// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Kingdom.sol";

/**
 * @title Farcebook
 * @dev The royal kingdom of farcebook
 */
contract Farcebook is Kingdom {
    mapping (address => Subject) public subjects;
    Item[] public items;
    address public sovereign;
    string public sovereignName;

    /** 
     * @dev Set sovereign as mars sugarberg
     */
    constructor() {
        sovereignName = "mars sugarberg";
        items.push(Item("nothing", "nothing equipped", ItemType.NOTHING, 0));
    }
    
    modifier onlySmith {
        require(subjects[msg.sender].isSmith, "only smiths are worthy");
        _;
    }
    
    modifier onlySubject {
        require(subjects[msg.sender].exists, "subject does not exist");
        _;
    }
    
    /** 
     * @dev Admit subject into the kingdom of Farcebook
     * @param name of the subject
     */
    function admitSubject(string memory name) public {
        require(!subjects[msg.sender].exists, "subject already admitted");
        subjects[msg.sender].exists = true;
        subjects[msg.sender].name = name;
        subjects[msg.sender].balance = 100;
    }
    
    /** 
     * @dev equip item to subject
     * @param itemId to be equipped to the subject
     */
    function equipItem(uint32 itemId) public onlySubject {
        require(items.length > itemId, "item does not exist");
        require(subjects[msg.sender].balance >= items[itemId].cost, "insufficient funds");
        subjects[msg.sender].balance -= items[itemId].cost;
        if (items[itemId].itemType == ItemType.BOOTS) {
            subjects[msg.sender].boots = itemId;
        } else if (items[itemId].itemType == ItemType.PANTS) {
            subjects[msg.sender].pants = itemId;
        } else if (items[itemId].itemType == ItemType.HELMET) {
            subjects[msg.sender].helmet = itemId;
        } else if (items[itemId].itemType == ItemType.ARMOR) {
            subjects[msg.sender].armor = itemId;
        } else if (items[itemId].itemType == ItemType.WEAPON) {
            subjects[msg.sender].weapon = itemId;
        }
    }

    /** 
     * @dev Create item that others may equip for a fee
     * @param name of the new item
     * @param description of the new item
     * @param itemType of the new item
     * @param cost to equip the item
     */
    function createItem(string memory name, string memory description, ItemType itemType, uint32 cost) public onlySmith {
        require(items.length <= 2 ** 32, "too many items exist!");
        require(itemType != ItemType.NOTHING, "item must have a valid type!");
        items.push(Item(name, description, itemType, cost));
    }
    
     /** 
     * @dev Charge subject 10000 sugar coins and make subject a smith
     */
    function initiateSmith() public onlySubject {
        require(!subjects[msg.sender].isSmith, "subject is already a smith");
        require(subjects[msg.sender].balance >= 10000, "require 10000 sugar coins for initiation as a smith");
        subjects[msg.sender].isSmith = true;
        subjects[msg.sender].balance -= 10000;
        // make user a smith and subtract balance
    }
}
