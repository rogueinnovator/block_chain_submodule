// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
/// @title Criminal Data Sender Contract
/// @notice this contract allow for creation , retrieval and deletion of the criminal data entries
/// @dev this contract use NatSpec for documentation
contract CriminalDataSender {
    /// @notice Sensitivity level of the criminals
    enum Sensitivity {
        Low,
        Medium,
        High
    }
    /// @notice Structure of the Criminal entity
    /// @dev Entity Structure for the Criminals
    struct Entity {
        string name;
        uint16 id;
        uint56 cnic;
        Sensitivity sensitivity;
        uint256 timeStamp;
    }
    /// @notice mapping to hold the instance of the criminal
    mapping(uint56 => Entity) public criminalData;
    /// @notice mapping from Cnic to id
    mapping(uint56 => uint56) public cnicToID;
    /// @notice Array to hold the criminal Ids
    /// @dev Arrays that will add in unsequential access to the criminals
    uint56[] public criminalIds;
    /// @notice Address of the contract owner
    address public immutable owner;
    /// @notice state variable to hold the criminal count
    uint32 public criminalCount = 0;
    /// @notice Event emited when a new entity is created
    /// @param  id id of the entity
    /// @param  owner The add of the contract owner
    /// @param sensitivity Sensitivity of the criminal created
    /// @param criminalCount Number of the criminals created
    event EntityCreated(
        uint16 id,
        address owner,
        Sensitivity sensitivity,
        uint32 criminalCount
    );
    /// @notice Event emitted on Entity deletion
    event EntityDeleted(uint56 indexed cnic);
    /// @notice Constructor to set the owner of the contract
    /// @dev Set the contract deployer as sender
    constructor() {
        owner = msg.sender;
    }
    /// @notice Modifier to restrict the functions to the contract owner only
    /// @dev Check if the Add of the sender is equal to the owner
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Access denied: Only owner can call this function"
        );
        _;
    }
    //.1==>
    /// @notice Function to create a new entity
    /// @param _name The name of the entity
    /// @param _id ID of the entity
    /// @param _cnic Cnic of the entity
    /// @param sensitivity Sensitivity of the entity
    /// @dev Adds a new entity to the criminalData mapping and emit a EntityCreated update the cnicToId mapping and also push the current id to the criminlIds array
    function createEntity(
        string memory _name,
        uint16 _id,
        uint56 _cnic,
        Sensitivity sensitivity
    ) public onlyOwner {
        require(_id != 0, "Invalid ID");
        require(_cnic != 0, "Invalid CNIC");

        criminalData[_id] = Entity(
            _name,
            _id,
            _cnic,
            sensitivity,
            block.timestamp
        );
        cnicToID[_cnic] = _id;
        criminalIds.push(_id);
        criminalCount++;

        emit EntityCreated(_id, owner, sensitivity, criminalCount);
    }
    //.2==>
    /// @notice Function to return the entity data (can only be called by the owner)
    /// @param _cnic Cnic of the entity
    /// @return criminalData Criminlal entity
    /// @dev It search for the criminal data in the criminalData mapping if find returns the enttity else return ""
    function getEntity(
        uint56 _cnic
    ) public view onlyOwner returns (Entity memory, string memory) {
        uint56 entityId = cnicToID[_cnic];
        if (entityId == 0) {
            return (
                Entity("", 0, 0, Sensitivity.Low, 0),
                "Criminal data not found"
            );
        }
        return (criminalData[entityId], "");
    }
    //.3==>
    /// @notice This is used to retrieve all the active entities stored in the mapping
    /// @return allCriminals returns an array of all the active entities
    /// @dev Loops through the criminalIds array and retrieves only the non-deleted entities
    function getAllCriminals() public view onlyOwner returns (Entity[] memory) {
        require(criminalIds.length > 0, "No criminal data available");

        // Create a dynamic array to store the active criminals
        Entity[] memory allCriminals = new Entity[](criminalIds.length);
        uint16 activeCount = 0;

        // Loop through criminalIds to find active criminals
        for (uint16 i = 0; i < criminalIds.length; i++) {
            uint56 id = criminalIds[i];
            // If the entity still exists (not deleted), add it to the array
            if (criminalData[id].id != 0) {
                allCriminals[activeCount] = criminalData[id];
                activeCount++;
            }
        }

        // Resize the array to match the number of active criminals
        bytes memory resize;
        assembly {
            resize := mload(add(allCriminals, mul(activeCount, 0x20)))
        }
        return allCriminals;
    }
    //.4==>
    /// @notice This function is used to deleted an entity
    /// @param _cnic The cnic of the entity to be deleted
    /// @dev it first retrieve the corresponding id of the given cnic then iterates onn the whole criminalData mapping and delete the id specified id entity
    function deleteEntity(uint56 _cnic) public onlyOwner {
        uint56 entityId = cnicToID[_cnic];
        require(entityId != 0, "Criminal data not found");

        // Remove the criminal ID from the array
        for (uint16 i = 0; i < criminalIds.length; i++) {
            if (criminalIds[i] == entityId) {
                criminalIds[i] = criminalIds[criminalIds.length - 1];
                criminalIds.pop();
                break;
            }
        }
        emit EntityDeleted(_cnic);
        delete criminalData[entityId];
        delete cnicToID[_cnic];
        criminalCount--;
    }
}
