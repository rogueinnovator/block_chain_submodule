const CriminalDataSender = artifacts.require("CriminalDataSender");

contract("CriminalDataSender", (accounts) => {
  let criminalDataSender;
  const owner = accounts[0];
  const nonOwner = accounts[1];

  const personalDetails = {
    name: "Huzaifa",
    fatherName: "Ali",
    age: 25,
    cnic: 1234567890123,
    location: "City A",
    gender: "Male",
  };

  const crimeDetails = {
    id: 1,
    crimeSeverity: 2, // Assuming High severity
    offenseDescription: "Robbery",
    offenseCode: 101,
    offenseDate: 20230101,
    caseId: 1001,
    investigationOfficer: "Officer A",
    courtVerdict: "Guilty",
  };

  const prisonDetails = {
    prisonLocation: "Prison A",
    prisonId: 101,
    tenure: 5,
    prisonCode: 202,
  };

  beforeEach(async () => {
    criminalDataSender = await CriminalDataSender.new({ from: owner });
  });

  it("should set the contract deployer as the owner", async () => {
    const contractOwner = await criminalDataSender.owner();
    assert.equal(contractOwner, owner, "Owner is not correctly set");
  });

  it("should allow the owner to create an entity", async () => {
    await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const createdEntity = await criminalDataSender.getEntity(
      personalDetails.cnic,
      { from: owner },
    );

    assert.equal(
      createdEntity.personal.name,
      personalDetails.name,
      "Entity name mismatch",
    );
    assert.equal(
      createdEntity.crime.id,
      crimeDetails.id,
      "Entity crime ID mismatch",
    );
    assert.equal(
      createdEntity.crime.crimeSeverity,
      crimeDetails.crimeSeverity,
      "Entity crime severity mismatch",
    );
  });

  it("should emit an EntityCreated event when an entity is created", async () => {
    const tx = await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    assert.equal(tx.logs.length, 1, "Incorrect number of events emitted");
    assert.equal(tx.logs[0].event, "EntityCreated", "Incorrect event emitted");
    assert.equal(
      tx.logs[0].args.cnic,
      personalDetails.cnic,
      "Event CNIC mismatch",
    );
    assert.equal(tx.logs[0].args.owner, owner, "Event owner mismatch");
  });

  it("should prevent non-owners from creating an entity", async () => {
    try {
      await criminalDataSender.createEntity(
        personalDetails,
        crimeDetails,
        prisonDetails,
        { from: nonOwner },
      );
      assert.fail("Non-owner was able to create an entity");
    } catch (error) {
      assert(
        error.message.includes("Access denied"),
        "Expected access denied error",
      );
    }
  });

  it("should allow the owner to retrieve an existing entity", async () => {
    await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const retrievedEntity = await criminalDataSender.getEntity(
      personalDetails.cnic,
      { from: owner },
    );

    assert.equal(
      retrievedEntity.personal.name,
      personalDetails.name,
      "Entity name mismatch",
    );
    assert.equal(
      retrievedEntity.crime.offenseDescription,
      crimeDetails.offenseDescription,
      "Offense description mismatch",
    );
  });

  it("should return 'Criminal data not found' when an entity does not exist", async () => {
    const missingCnic = 9999999999999;
    try {
      await criminalDataSender.getEntity(missingCnic, { from: owner });
      assert.fail("Expected error for non-existent entity");
    } catch (error) {
      assert(
        error.message.includes("Criminal data not found"),
        "Expected 'Criminal data not found' error",
      );
    }
  });

  it("should allow the owner to update an existing entity", async () => {
    await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const updatedPersonalDetails = {
      ...personalDetails,
      name: "Updated Huzaifa",
    };
    await criminalDataSender.updateEntity(
      personalDetails.cnic,
      updatedPersonalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const updatedEntity = await criminalDataSender.getEntity(
      personalDetails.cnic,
      { from: owner },
    );
    assert.equal(
      updatedEntity.personal.name,
      "Updated Huzaifa",
      "Entity name was not updated",
    );
  });

  it("should emit an EntityUpdated event when an entity is updated", async () => {
    await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const tx = await criminalDataSender.updateEntity(
      personalDetails.cnic,
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );
    assert.equal(tx.logs.length, 1, "Incorrect number of events emitted");
    assert.equal(tx.logs[0].event, "EntityUpdated", "Incorrect event emitted");
    assert.equal(
      tx.logs[0].args.id,
      crimeDetails.id,
      "Event entity ID mismatch",
    );
  });

  it("should prevent non-owners from updating an entity", async () => {
    await criminalDataSender.createEntity(
      personalDetails,
      crimeDetails,
      prisonDetails,
      { from: owner },
    );

    const updatedPersonalDetails = {
      ...personalDetails,
      name: "Unauthorized Update",
    };
    try {
      await criminalDataSender.updateEntity(
        personalDetails.cnic,
        updatedPersonalDetails,
        crimeDetails,
        prisonDetails,
        { from: nonOwner },
      );
      assert.fail("Non-owner was able to update an entity");
    } catch (error) {
      assert(
        error.message.includes("Access denied"),
        "Expected access denied error",
      );
    }
  });

  // Additional test cases can be added as needed for further functionality.
});
