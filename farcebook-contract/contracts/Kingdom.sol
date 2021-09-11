// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Kingdom
 * @dev A kingdom of subjects and items
 */
contract Kingdom {
    enum ItemType{NOTHING, BOOTS, PANTS, HELMET, ARMOR, WEAPON}
    struct Item {
        string name;
        string description;
        ItemType itemType;
        uint32 cost;
    }

    struct Subject {
        bool exists;
        bool isSmith;
        string name;
        uint32 balance;
        uint boots;
        uint pants;
        uint helmet;
        uint armor;
        uint weapon;
    }
}
