// const CriminalDataSender = artifacts.require("CriminalDataSender");
// contract("CriminalDataSender", (accounts) => {
//   let criminalDataSender;
//   const owner = accounts[0];
//   const nonOwner = accounts[1];

//   beforeEach(async () => {
//     criminalDataSender = await CriminalDataSender.new({ from: owner });
//   });

//   it("should set the contract deployer as the owner", async () => {
//     const contractOwner = await criminalDataSender.owner();
//     assert.equal(contractOwner, owner, "Owner is not correctly set");
//   });

//   it("should allow the owner to create an entity", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };

//     await criminalDataSender.createEntity(
//       entityData.name,
//       entityData.id,
//       entityData.cnic,
//       entityData.sensitivity,
//       { from: owner },
//     );

//     const createdEntity = await criminalDataSender.getEntity(entityData.cnic, {
//       from: owner,
//     });
//     assert.equal(
//       createdEntity[0].name,
//       entityData.name,
//       "Entity name mismatch",
//     );
//     assert.equal(createdEntity[0].id, entityData.id, "Entity ID mismatch");
//     assert.equal(
//       createdEntity[0].cnic,
//       entityData.cnic,
//       "Entity CNIC mismatch",
//     );
//     assert.equal(
//       createdEntity[0].sensitivity,
//       entityData.sensitivity,
//       "Entity sensitivity mismatch",
//     );
//   });

//   it("should emit an EntityCreated event when an entity is created", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };

//     const tx = await criminalDataSender.createEntity(
//       entityData.name,
//       entityData.id,
//       entityData.cnic,
//       entityData.sensitivity,
//       { from: owner },
//     );

//     assert.equal(tx.logs.length, 1, "Incorrect number of events emitted");
//     assert.equal(tx.logs[0].event, "EntityCreated", "Incorrect event emitted");
//     assert.equal(tx.logs[0].args.id, entityData.id, "Event entity ID mismatch");
//     assert.equal(tx.logs[0].args.owner, owner, "Event owner mismatch");
//     assert.equal(
//       tx.logs[0].args.sensitivity,
//       entityData.sensitivity,
//       "Event sensitivity mismatch",
//     );
//   });

//   it("should prevent non-owners from creating an entity", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };

//     try {
//       await criminalDataSender.createEntity(
//         entityData.name,
//         entityData.id,
//         entityData.cnic,
//         entityData.sensitivity,
//         { from: nonOwner },
//       );
//       assert.fail("Non-owner was able to create an entity");
//     } catch (error) {
//       assert(
//         error.message.includes("Access denied"),
//         "Expected access denied error",
//       );
//     }
//   });

//   it("should retrieve an existing entity", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };

//     await criminalDataSender.createEntity(
//       entityData.name,
//       entityData.id,
//       entityData.cnic,
//       entityData.sensitivity,
//       { from: owner },
//     );

//     const retrievedEntity = await criminalDataSender.getEntity(
//       entityData.cnic,
//       { from: owner },
//     );
//     assert.equal(
//       retrievedEntity[0].name,
//       entityData.name,
//       "Entity name mismatch",
//     );
//     assert.equal(retrievedEntity[0].id, entityData.id, "Entity ID mismatch");
//     assert.equal(
//       retrievedEntity[0].cnic,
//       entityData.cnic,
//       "Entity CNIC mismatch",
//     );
//   });

//   it("should return 'Criminal data not found' when an entity is not present", async () => {
//     const missingCnic = 9999999999999;
//     const retrievedEntity = await criminalDataSender.getEntity(missingCnic, {
//       from: owner,
//     });
//     assert.equal(
//       retrievedEntity[1],
//       "Criminal data not found",
//       "Incorrect response for missing entity",
//     );
//   });

//   it("should allow the owner to delete an entity", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };

//     await criminalDataSender.createEntity(
//       entityData.name,
//       entityData.id,
//       entityData.cnic,
//       entityData.sensitivity,
//       { from: owner },
//     );

//     await criminalDataSender.deleteEntity(entityData.cnic, { from: owner });
//     const retrievedEntity = await criminalDataSender.getEntity(
//       entityData.cnic,
//       { from: owner },
//     );
//     assert.equal(
//       retrievedEntity[1],
//       "Criminal data not found",
//       "Entity was not deleted",
//     );
//   });

//   it("should prevent non-owners from deleting an entity", async () => {
//     const entityData = {
//       name: "huzaifa",
//       id: 1,
//       cnic: 1234567890123,
//       sensitivity: 1,
//     };
//     await criminalDataSender.createEntity(
//       entityData.name,
//       entityData.id,
//       entityData.cnic,
//       entityData.sensitivity,
//       { from: owner },
//     );

//     try {
//       await criminalDataSender.deleteEntity(entityData.cnic, {
//         from: nonOwner,
//       });
//       assert.fail("Non-owner was able to delete an entity");
//     } catch (error) {
//       assert(
//         error.message.includes("Access denied"),
//         "Expected access denied error",
//       );
//     }
//   });
// });
