// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.8;
contract CriminalDataSender{
    uint public DataCount = 10;
    struct CriminalEntity{
        uint id;
        string name;
        uint cnic;
    }
    mapping(uint => CriminalEntity) public criminalsEnttities;
    constructor(){
            ("criminals data inserted");
    }
    function CreateEntity(string memory _name,uint _cnic) public{
        
    }

}