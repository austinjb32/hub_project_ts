import DataLoader from 'dataloader';
import UserModel from './users.model';
import { IUserDocument } from './users.model';

export const userLoader = new DataLoader<string, IUserDocument>(async (ids) => {
  const users = await UserModel.find({ _id: { $in: ids } });

  // Create a map of user IDs to user documents
  const userMap: Record<string, IUserDocument> = {};
  users.forEach((user) => {
    userMap[user._id] = user;
  });

  // Map the IDs to user documents, maintaining the order
  return ids.map((id) => userMap[id]);
});
