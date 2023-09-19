"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const validation_1 = require("../../middleware/Validation/validation");
const activity_1 = tslib_1.__importDefault(require("../../models/activity"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
class AuthDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
  async login({ email, password }, context) {
    const user = await this.model.findOne({ email: email }).exec();
    if (!user) {
      const error = new Error("No User Found");
      throw error;
    }
    const validLogin = (0, validation_1.loginValidation)({ email, password });
    if (validLogin.error) {
      throw new Error(`${validLogin.error.name}${validLogin.error.message}`);
    }
    const hashedPassword = bcrypt_1.default.compareSync(
      password,
      user.password,
    );
    if (!hashedPassword) {
      throw new Error("Wrong Password");
    }
    //////////////////{User Token}/////////////////////
    const token = jsonwebtoken_1.default.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" },
    );
    context.token = token;
    //////////////////{Refresh Token}/////////////////////
    let refreshToken;
    refreshToken = jsonwebtoken_1.default.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "30d" },
    );
    context.refreshToken = refreshToken;
    const lastData = "User Logged In";
    const updateActivity = new activity_1.default({
      userId: user._id,
      track: [{ activity: lastData }],
      lastActivity: lastData,
    });
    updateActivity.save();
    return {
      token: token,
      userId: user._id.toString(),
      refreshToken: refreshToken,
    };
  }
  async createUser(userInput, context) {
    const validCreation = (0, validation_1.userCreationValidation)(userInput);
    if (validCreation.error) {
      throw new Error(
        `${validCreation.error.name}${validCreation.error.message}`,
      );
    }
    const user = await this.model.findOne({ email: userInput.email });
    if (user) {
      const error = new Error("User already exists");
      throw error;
    }
    const hashedPassword = await bcrypt_1.default.hash(userInput.password, 12);
    const newUser = new this.model({
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    });
    await newUser.save();
    await context.redisClient.client.HSET(
      "users",
      `${userInput}`,
      JSON.stringify(newUser),
    );
    const lastData = "User Created";
    const updateActivity = new activity_1.default({
      userId: newUser._id,
      track: [{ activity: lastData }],
      lastActivity: lastData,
    });
    updateActivity.save();
    return {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }
}
exports.default = AuthDataSource;
//# sourceMappingURL=auth.dataSource.js.map
