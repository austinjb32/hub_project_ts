"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const CustomUtils_1 = require("../../utils/CustomUtils");
const activity_1 = tslib_1.__importDefault(require("../../models/activity"));
class UserDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
  async viewUserById(args, context) {
    const user = await context.userLoaders.load(args.dataID);
    if (!user) {
      return null;
    }
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    console.log("database");
    await context.redisClient.client.HSET(
      "users",
      `${encodedJSON}`,
      JSON.stringify(user),
    );
    return {
      ...user._doc,
      _id: user._id.toString(),
      name: user.name.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      isAdmin: user.isAdmin,
    };
  }
  async viewUser(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    const dataStore = await context.redisClient.client.HGET(
      "usersSearch",
      `${encodedJSON}`,
    );
    let users;
    if (!dataStore) {
      users = await this.model
        .find({ ...args.filter } || {})
        .sort(args.sort || 0)
        .skip(args.skip || 0)
        .limit(args.limit || 1);
      console.log("database");
      await context.redisClient.client.HSET(
        "usersSearch",
        `${encodedJSON}`,
        JSON.stringify(users),
      );
    } else {
      users = JSON.parse(dataStore);
      console.log("redis");
    }
    if (!users) {
      throw new Error("No users Found");
    }
    const arrayusers = Object.values(users);
    const formatteduser = arrayusers.map((user) => {
      user = this.model.hydrate(user);
      return { ...user._doc };
    });
    return formatteduser;
  }
  async viewUsers(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    const dataStore = await context.redisClient.client.HGET(
      "usersSearch",
      `${encodedJSON}`,
    );
    let users;
    if (!dataStore) {
      users = await this.model
        .find({ ...args.filter })
        .skip(args.skip || 0)
        .sort(args.sort || 0)
        .limit(args.limit);
      console.log("database");
      await context.redisClient.client.HSET(
        "usersSearch",
        `${encodedJSON}`,
        JSON.stringify(users),
      );
    } else {
      users = JSON.parse(dataStore);
      console.log("redis");
    }
    if (!users) {
      throw new Error("No users Found");
    }
    const arrayusers = Object.values(users);
    const formatteduser = arrayusers.map((user) => {
      user = this.model.hydrate(user);
      return { ...user._doc };
    });
    return formatteduser;
  }
  async viewUserWithSearch(args, context) {
    async function saveInRedis(userSearch) {
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "usersSearch",
        `${encodedJSON}`,
        JSON.stringify(userSearch),
      );
    }
    const pipeline = [];
    pipeline.push({
      $search: {
        index: "searchUsers",
        text: {
          query: args.search.trim() || "",
          path: "name",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });
    pipeline.push({ $match: { ...args.filter } }, { $limit: args.limit || 1 });
    const userSearch = await this.model.aggregate(pipeline);
    console.log("database");
    if (!userSearch) {
      return "No User Available";
    }
    const formatteduser = userSearch.map((user) => {
      user = this.model.hydrate(user);
      return { ...user._doc };
    });
    saveInRedis(formatteduser);
    return formatteduser;
  }
  async viewUsersWithSearch(args, context) {
    async function saveInRedis(userSearch) {
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "usersSearch",
        `${encodedJSON}`,
        JSON.stringify(userSearch),
      );
    }
    const pipeline = [];
    pipeline.push({
      $search: {
        index: "searchUsers",
        text: {
          query: args.search.trim() || "",
          path: "name",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });
    pipeline.push({ $match: { ...args.filter } });
    const userSearch = await this.model.aggregate(pipeline);
    saveInRedis(userSearch);
    console.log("database");
    if (!userSearch) {
      return "No User Available";
    }
    const formattedUsers = userSearch.map((user) => {
      user = this.model.hydrate(user);
      return { ...user._doc };
    });
    return formattedUsers;
  }
  async countUsers(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    const users = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit)
      .countDocuments();
    console.log("database");
    await context.redisClient.client.HSET(
      "usersSearchCount",
      `${encodedJSON}`,
      JSON.stringify(users),
    );
    if (!users) {
      throw new Error("No users Found");
    }
    return users;
  }
  async countUsersWithSearch(args, context) {
    async function saveInRedis(userSearch) {
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "usersSearchCount",
        `${encodedJSON}`,
        JSON.stringify(userSearch),
      );
    }
    const pipeline = [];
    pipeline.push({
      $search: {
        index: "searchUsers",
        text: {
          query: args.search.trim() || "",
          path: "name",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });
    pipeline.push(
      { $match: { ...args.filter } },
      { $group: { _id: null, count: { $sum: 1 } } },
    );
    const userSearch = await this.model.aggregate(pipeline);
    const userSearchCount = userSearch.length;
    saveInRedis(userSearchCount);
    console.log("database");
    if (!userSearchCount) {
      return "No User Available";
    }
    return userSearchCount;
  }
  async updateUser(userData, userID, context) {
    async function redisUpdateOperations(user) {
      await context.redisClient.hDeleteCache(userID);
      await context.redisClient.hDeleteCache("usersSearch");
      await context.redisClient.client.hSet(
        "users",
        `${userID}`,
        JSON.stringify(user),
      );
    }
    const foundUser = await this.model.findById(userID);
    const currentUser = await this.model.findById(context.userId);
    // Check if the user is authorized to make the change
    if (
      foundUser._id.toString() !== context.userId ||
      currentUser?.isAdmin !== true
    ) {
      throw new Error("You're not Authorized to make this Change");
    }
    // Create an object with the fields to be updated
    const editUser = {
      name: userData.name,
      email: userData.email,
      imageUrl: userData.imageUrl,
      status: userData.status,
      bio: userData.bio,
    };
    // Use lodash to merge the changes into the user
    const updatedUser = lodash_1.default.merge(foundUser, editUser);
    // Update and save the user
    Object.assign(foundUser, updatedUser);
    await foundUser.save();
    const formattedUser = foundUser;
    await redisUpdateOperations(updatedUser);
    const lastData = "User Data Updated";
    const updateActivity = new activity_1.default({
      userId: foundUser?._id,
      track: [{ activity: lastData }],
      lastActivity: lastData,
    });
    updateActivity.save();
    return { ...formattedUser._doc, _id: formattedUser?._id.toString() };
  }
  async deleteUser(userID, context) {
    const foundUser = await this.model.findById(userID);
    const currentUser = await this.model.findById(context.userId);
    if (!foundUser) {
      throw new Error("No User Found");
    }
    // Check if the user is authorized to =ake the change
    if (
      !(foundUser._id.toString() === context.userId || currentUser?.isAdmin)
    ) {
      throw new Error("You're not Authorized to make this Change");
    }
    const deleteUser = await this.model.findByIdAndDelete(userID);
    const lastData = "User Deleted";
    await context.redisClient.hDeleteCache(foundUser._id.toString());
    await context.redisClient.hDeleteCache("usersSearch");
    const updateActivity = new activity_1.default({
      userId: context.userId,
      track: [{ activity: lastData }],
      lastActivity: lastData,
    });
    updateActivity.save();
    return { success: true, data: deleteUser };
  }
}
exports.default = UserDataSource;
//# sourceMappingURL=users.datasource.js.map
