import DataLoader from 'dataloader';
import postModel from './posts.model';

// Define a function to fetch posts by an array of user IDs
const getPostsByUserId = async (userId: string) => {
  const posts = await postModel.find({ creator: userId });
  return posts;
};

export const getPostLoader = () => new DataLoader(async (userIds) => {
  // Since you have only one user, you can fetch posts for that user
  const userPosts = await getPostsByUserId(userIds[0] as string);

  // Return the posts directly as an array
  return [userPosts];
});
