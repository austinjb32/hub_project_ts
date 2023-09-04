"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
class UserDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async getUserById(userId) {
        const user = await this.model.findById(userId).lean().exec();
        if (!user) {
            console.log("0");
            return null;
        }
        console.log(user);
        // Convert isAdmin to Maybe<string> or undefined
        const isAdmin = typeof user.isAdmin === 'boolean' ? (user.isAdmin ? 'true' : 'false') : user.isAdmin;
        console.log("1");
        // Map the Date fields to strings
        const userWithFormattedDates = {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            isAdmin
        };
        console.log("2");
        return userWithFormattedDates;
    }
    async createUser(userInput) {
        const user = new this.model(userInput);
        await user.save();
        return user.toObject();
    }
}
exports.default = UserDataSource;
//# sourceMappingURL=users.datasource.js.map