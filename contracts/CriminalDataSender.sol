// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/// @title Criminal Data Sender Contract
/// @notice This contract allows for creation, retrieval, and updating of criminal data entries.
/// @dev This contract uses NatSpec for documentation.
contract CriminalDataSender {
    /// @notice CrimeSeverity level of the criminals.
    enum CrimeSeverity {
        Low,
        Medium,
        High
    }

    /// @notice Structure of the Criminal entity.
    /// @dev Entity structure for the criminals.
    struct PersonalDetails {
        string name;
        string fatherName;
        uint16 age;
        uint56 cnic;
        string location;
        string gender;
    }

    struct CrimeDetails {
        uint16 id;
        CrimeSeverity crimeSeverity;
        string offenseDescription;
        uint8 offenseCode;
        uint56 offenseDate;
        uint16 caseId;
        string investigationOfficer;
        string courtVerdict;
    }

    struct PrisonDetails {
        string prisonLocation;
        uint8 prisonId;
        uint8 tenure; // Time the criminal is sentenced to spend in prison (in years)
        uint8 prisonCode;
    }

    /// @notice Structure to combine personal, crime, and prison details of the criminal.
    struct CriminalEntity {
        PersonalDetails personal;
        CrimeDetails crime;
        PrisonDetails prison;
        uint256 timeStamp; // Time of record creation or update
    }

    /// @notice Mapping to hold the instance of the criminal data.
    mapping(uint56 => CriminalEntity) public criminalData;

    /// @notice Mapping from CNIC to ID.
    mapping(uint56 => uint56) public cnicToID;

    /// @notice Array to hold the criminal IDs.
    uint56[] public criminalIds;

    /// @notice Address of the contract owner.
    address public immutable owner;

    /// @notice State variable to hold the criminal count.
    uint32 public criminalCount = 0;

    /// @notice Event emitted when a new entity is created.
    event EntityCreated(uint56 cnic, address owner);

    /// @notice Event emitted when an entity is updated.
    event EntityUpdated(uint56 id);

    /// @notice Constructor to set the owner of the contract.
    constructor() {
        owner = msg.sender;
    }

    /// @notice Modifier to restrict functions to the contract owner only.
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Access denied: Only owner can call this function"
        );
        _;
    }

    /// @notice Function to create a new criminal entity.
    /// @param _personal Struct containing personal details of the criminal.
    /// @param _crime Struct containing crime details of the criminal.
    /// @param _prison Struct containing prison details of the criminal.
    function createEntity(
        PersonalDetails memory _personal,
        CrimeDetails memory _crime,
        PrisonDetails memory _prison
    ) public onlyOwner {
        require(_personal.cnic != 0, "Invalid CNIC");
        require(_crime.id != 0, "Invalid ID");
        // Create a new CriminalEntity
        criminalData[_crime.id] = CriminalEntity({
            personal: _personal,
            crime: _crime,
            prison: _prison,
            timeStamp: block.timestamp
        });

        // Link CNIC to ID and update mappings
        cnicToID[_personal.cnic] = _crime.id;
        criminalIds.push(_crime.id);
        criminalCount++;

        // Emit event for entity creation
        emit EntityCreated(_personal.cnic, owner);
    }

    /// @notice Function to return the criminal entity data (can only be called by the owner).
    /// @param _cnic CNIC of the entity.
    /// @return Criminal entity.
    function getEntity(uint56 _cnic)
        public
        view
        onlyOwner
        returns (CriminalEntity memory)
    {
        uint56 entityId = cnicToID[_cnic];
        require(entityId != 0, "Criminal data not found");
        return criminalData[entityId];
    }

    /// @notice Function to retrieve all the active criminal entities stored in the mapping.
    /// @return allCriminals An array of all the active criminal entities.
    function getAllCriminals()
        public
        view
        onlyOwner
        returns (CriminalEntity[] memory)
    {
        require(criminalIds.length > 0, "No criminal data available");

        CriminalEntity[] memory allCriminals = new CriminalEntity[](
            criminalIds.length
        );
        for (uint16 i = 0; i < criminalIds.length; i++) {
            allCriminals[i] = criminalData[criminalIds[i]];
        }
        return allCriminals;
    }

    /// @notice Function to update an existing criminal entity's data.
    /// @param _cnic CNIC of the entity to update.
    /// @param _personal Updated personal details of the criminal.
    /// @param _crime Updated crime details of the criminal.
    /// @param _prison Updated prison details of the criminal.
    function updateEntity(
        uint56 _cnic,
        PersonalDetails memory _personal,
        CrimeDetails memory _crime,
        PrisonDetails memory _prison
    ) public onlyOwner {
        uint56 entityId = cnicToID[_cnic];
        require(entityId != 0, "Criminal data not found");

        // Update the criminal data
        criminalData[entityId] = CriminalEntity({
            personal: _personal,
            crime: _crime,
            prison: _prison,
            timeStamp: block.timestamp
        });

        // Emit event for entity update
        emit EntityUpdated(entityId);
    }
}

