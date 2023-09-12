"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt")); // Import your types here
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const validation_1 = require("../../middleware/validation");
class UserDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async viewUser(userId, context) {
        const user = await context.userLoaders.load(userId);
        if (!user) {
            return null;
        }
        return {
            ...user._doc,
            _id: user._id.toString(),
            name: user.name.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            isAdmin: user.isAdmin,
        };
    }
    async getUserById(userId) {
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
        const validLogin = (0, validation_1.loginValidation)({ email, password });
        if (validLogin.error) {
            throw new Error(`${validLogin.error.name}${validLogin.error.message}`);
        }
        const hashedPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!hashedPassword) {
            throw new Error("Wrong Password");
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, "somesupersecretsecret", { expiresIn: "1h" });
        let refreshToken;
        if (user.isAdmin) {
            refreshToken = jsonwebtoken_1.default.sign({
                email: user.email,
                userId: user._id.toString(),
            }, "somesupersecretsecret", { expiresIn: "30d" });
            context.refreshToken = refreshToken;
            console.log(refreshToken);
        }
        context.token = token;
        return { token: token, userId: user._id.toString(), refreshToken: refreshToken };
    }
    async createUser(userInput) {
        const validCreation = (0, validation_1.userCreationValidation)(userInput);
        if (validCreation.error) {
            throw new Error(`${validCreation.error.name}${validCreation.error.message}`);
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