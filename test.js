CriminalDataSender = artifacts.require("CriminalDataSender");
contract("CriminalDataSender", (accounts) => {
  let criminalDataSender;
  const owner = accounts[0];
  const nonOwner = accounts[1];

  beforeEach(async () => {
    criminalDataSender = await CriminalDataSender.new({ from: owner });
  });

  it("should set the contract deployer as the owner", async () => {
    const contractOwner = await criminalDataSender.owner();
    assert.equal(contractOwner, owner, "Owner is not correctly set");
  });

  it("should allow the owner to create an entity", async () => {
    const entityData = {
      name: "John Doe",
      id: 1,
      cnic: 1234567890123,
      sensitivity: 2, // High sensitivity
    };

    await criminalDataSender.createEntity(
      entityData.name,
      entityData.id,
      entityData.cnic,
      entityData.sensitivity,
      { from: owner },
    );

    const createdEntity = await criminalDataSender.getEntity(entityData.cnic, {
      from: owner,
    });
    assert.equal(
      createdEntity[0].name,
      entityData.name,
      "Entity name mismatch",
    );
    assert.equal(
      createdEntity[0].id.toNumber(),
      entityData.id,
      "Entity ID mismatch",
    );
    assert.equal(
      createdEntity[0].cnic.toNumber(),
      entityData.cnic,
      "Entity CNIC mismatch",
    );
    assert.equal(
      createdEntity[0].sensitivity.toNumber(),
      entityData.sensitivity,
      "Entity sensitivity mismatch",
    );
  });

  it("should emit an EntityCreated event when an entity is created", async () => {
    const entityData = {
      name: "Jane Doe",
      id: 2,
      cnic: 9876543210987,
      sensitivity: 1, // Medium sensitivity
    };

    const tx = await criminalDataSender.createEntity(
      entityData.name,
      entityData.id,
      entityData.cnic,
      entityData.sensitivity,
      { from: owner },
    );

    assert.equal(tx.logs.length, 1, "Incorrect number of events emitted");
    assert.equal(tx.logs[0].event, "EntityCreated", "Incorrect event emitted");
    assert.equal(
      tx.logs[0].args.id.toNumber(),
      entityData.id,
      "Event entity ID mismatch",
    );
    assert.equal(tx.logs[0].args.owner, owner, "Event owner mismatch");
    assert.equal(
      tx.logs[0].args.sensitivity.toNumber(),
      entityData.sensitivity,
      "Event sensitivity mismatch",
    );
  });

  it("should prevent non-owners from creating an entity", async () => {
    const entityData = {
      name: "Jake Doe",
      id: 3,
      cnic: 5555555555555,
      sensitivity: 0, // Low sensitivity
    };

    try {
      await criminalDataSender.createEntity(
        entityData.name,
        entityData.id,
        entityData.cnic,
        entityData.sensitivity,
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

  it("should retrieve an existing entity", async () => {
    const entityData = {
      name: "James Doe",
      id: 4,
      cnic: 1111111111111,
      sensitivity: 0, // Low sensitivity
    };

    await criminalDataSender.createEntity(
      entityData.name,
      entityData.id,
      entityData.cnic,
      entityData.sensitivity,
      { from: owner },
    );

    const retrievedEntity = await criminalDataSender.getEntity(
      entityData.cnic,
      { from: owner },
    );
    assert.equal(
      retrievedEntity[0].name,
      entityData.name,
      "Entity name mismatch",
    );
    assert.equal(
      retrievedEntity[0].id.toNumber(),
      entityData.id,
      "Entity ID mismatch",
    );
    assert.equal(
      retrievedEntity[0].cnic.toNumber(),
      entityData.cnic,
      "Entity CNIC mismatch",
    );
  });

  it("should return 'Criminal data not found' when an entity is not present", async () => {
    const missingCnic = 9999999999999;
    const retrievedEntity = await criminalDataSender.getEntity(missingCnic, {
      from: owner,
    });
    assert.equal(
      retrievedEntity[1],
      "Criminal data not found",
      "Incorrect response for missing entity",
    );
  });

  it("should allow the owner to delete an entity", async () => {
    const entityData = {
      name: "Jake Doe",
      id: 5,
      cnic: 2222222222222,
      sensitivity: 1, // Medium sensitivity
    };

    await criminalDataSender.createEntity(
      entityData.name,
      entityData.id,
      entityData.cnic,
      entityData.sensitivity,
      { from: owner },
    );

    await criminalDataSender.deleteEntity(entityData.cnic, { from: owner });
    const retrievedEntity = await criminalDataSender.getEntity(
      entityData.cnic,
      { from: owner },
    );
    assert.equal(
      retrievedEntity[1],
      "Criminal data not found",
      "Entity was not deleted",
    );
  });

  it("should prevent non-owners from deleting an entity", async () => {
    const entityData = {
      name: "Jill Doe",
      id: 6,
      cnic: 3333333333333,
      sensitivity: 2, // High sensitivity
    };

    await criminalDataSender.createEntity(
      entityData.name,
      entityData.id,
      entityData.cnic,
      entityData.sensitivity,
      { from: owner },
    );

    try {
      await criminalDataSender.deleteEntity(entityData.cnic, {
        from: nonOwner,
      });
      assert.fail("Non-owner was able to delete an entity");
    } catch (error) {
      assert(
        error.message.includes("Access denied"),
        "Expected access denied error",
      );
    }
  });
});
