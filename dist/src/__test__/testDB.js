"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDB = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongo = null;
const connectDB = async () => {
  mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose_1.default.connect(uri);
};
const dropDB = async () => {
  if (mongo) {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongo.stop();
  }
};
const dropCollections = async () => {
  if (mongo) {
    const collections = await mongoose_1.default.connection.db.collections();
    for (const collection of collections) {
      await collection.drop();
    }
  }
};
exports.testDB = { connectDB, dropDB, dropCollections };
//# sourceMappingURL=testDB.js.map
