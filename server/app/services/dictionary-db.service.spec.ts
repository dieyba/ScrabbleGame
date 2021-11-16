// import { fail } from "assert";
// import * as chai from "chai";
// import { expect } from "chai";
// import * as chaiAsPromised from "chai-as-promised";
// import { describe } from "mocha";
// import { MongoClient } from "mongodb";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import { DatabaseService } from "./database.service";
// chai.use(chaiAsPromised); // this allows us to test for rejection

// describe("Database service", () => {
//   let databaseService: DatabaseService;
//   let mongoServer: MongoMemoryServer;

//   beforeEach(async () => {
//     databaseService = new DatabaseService();

//     // Start a local test server
//     mongoServer = new MongoMemoryServer();
//   });

//   afterEach(async () => {
//     if (databaseService["client"] && databaseService["client"].isConnected()) {
//       await databaseService["client"].close();
//     }
//   });

//   // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
//   it("should connect to the database when start is called", async () => {
//     // Reconnect to local server
//     const mongoUri = await mongoServer.getUri();
//     await databaseService.start(mongoUri);
//     expect(databaseService["client"]).to.not.be.undefined;
//     expect(databaseService["db"].databaseName).to.equal("database");
//   });

//   it("should not connect to the database when start is called with wrong URL", async () => {
//     // Try to reconnect to local server
//     try {
//       await databaseService.start("WRONG URL");
//       fail();
//     } catch {
//       expect(databaseService["client"]).to.be.undefined;
//     }
//   });

//   it("should no longer be connected if close is called", async () => {
//     const mongoUri = await mongoServer.getUri();
//     await databaseService.start(mongoUri);
//     await databaseService.closeConnection();
//     expect(databaseService["client"].isConnected()).to.be.false;
//   });

//   it("should populate the database with a helper function", async () => {
//     const mongoUri = await mongoServer.getUri();
//     const client = await MongoClient.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     databaseService["db"] = client.db("database");
//     await databaseService.populateDB();
//     let courses = await databaseService.database
//       .collection("courses")
//       .find({})
//       .toArray();
//     expect(courses.length).to.equal(5);
//   });

//   it("should not populate the database with start function if it is already populated", async () => {
//     const mongoUri = await mongoServer.getUri();
//     await databaseService.start(mongoUri);
//     let courses = await databaseService.database
//       .collection("courses")
//       .find({})
//       .toArray();
//     expect(courses.length).to.equal(5);
//     await databaseService.closeConnection();
//     await databaseService.start(mongoUri);
//     courses = await databaseService.database
//       .collection("courses")
//       .find({})
//       .toArray();
//     expect(courses.length).to.equal(5);
//   });
// });
