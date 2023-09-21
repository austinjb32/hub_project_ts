import bcrypt from "bcrypt";
import mongoose from "mongoose";

const seedAdmin = async () => {
  console.log("hello");
  const { collections } = mongoose.connection;
  const userCollection = collections["users"];
  const adminUser = {
    name: "Admin User",
    email: "admin@gmail.com",
    password: await bcrypt.hash("123@Gmail", 12),
    isAdmin: true,
  };
  const result = await userCollection.insertOne(adminUser);
  return result.insertedId as mongoose.Types.ObjectId;
};
const seedCrewMember = async () => {
  const { collections } = mongoose.connection;
  const userCollection = collections["users"];
  const adminUser = {
    name: "CrewMember",
    email: "user@gmail.com",
    password: await bcrypt.hash("123@Gmail", 12),
    isAdmin: false,
  };
  const result = await userCollection.insertOne(adminUser);
  return result.insertedId as mongoose.Types.ObjectId;
};

// const seedAdminWithoutPassword = async () => {
//   const { collections } = mongoose.connection;
//   const userCollection = collections["users"];
//   const salt = await bcrypt.genSalt(
//     Number(process.env.BCRYPT_PASSWORD_HASH_ROUNDS)
//   );
//   const adminUser = {
//     name: "Admin User",
//     email: "admin2@admin.com",
//     phoneNumber: "123456783",
//     emergencyNumber: "123456786",
//     role: "ADMIN",
//     status: true,
//   };
//   const result = await userCollection.insertOne(adminUser);
//   return result.insertedId as mongoose.Types.ObjectId;
// };

export const UserSeed = {
  seedAdmin,
  seedCrewMember,
};
