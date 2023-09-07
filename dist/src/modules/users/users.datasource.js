"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt")); // Import your types here
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
class UserDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async viewUser(userId) {
        const user = await this.model.findById(userId).lean().exec();
        if (!user) {
            return null;
        }
        return {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            isAdmin: user.isAdmin,
        };
    }
    async login({ email, password }, context) {
        const user = await this.model.findOne({ email: email });
        if (!user) {
            const error = new Error("User already exists");
            throw error;
        }
        if (email == null ||
            password == null) {
            const error = new Error("No Input received");
            throw error;
        }
        const hashedPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!hashedPassword) {
            throw new Error("Wrong Password");
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, "somesupersecretsecret", { expiresIn: "1h" });
        context.token = token;
        return { token: token, userId: user._id.toString() };
    }
    async createUser(userInput) {
        const user = await this.model.findOne({ email: userInput.email });
        if (user) {
            const error = new Error("User already exists");
            throw error;
        }
        if (userInput.email == null ||
            userInput.name == null ||
            userInput.password == null) {
            const error = new Error("No Input received");
            throw error;
        }
        const hashedPassword = await bcrypt_1.default.hash(userInput.password, 12);
        const newUser = new this.model({
            name: userInput.name,
            email: userInput.email,
            password: hashedPassword,
        });
        await newUser.save();
        return {
            ...newUser.toObject(),
            _id: newUser._id.toString(),
            createdAt: newUser.createdAt.toISOString(),
            updatedAt: newUser.updatedAt.toISOString(),
        };
    }
}
exports.default = UserDataSource;
//# sourceMappingURL=users.datasource.js.map