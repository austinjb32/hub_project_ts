import DataLoader from "dataloader";
import postModel from "./posts.model";

// Define a function to fetch posts by an array of user IDs
const getPostsByUserId = async (userId: unknown) => {
  const posts = await postModel.find({ creator: userId });
  return posts;
};

export const getPostFromUserIDLoader = () =>
  new DataLoader(async (userIds) => {
    // Since you have only one user, you can fetch posts for that user
    const userPosts = await getPostsByUserId(userIds[0]);

    // Return the posts directly as an array
    return [userPosts];
  });

const getPost = async (userId: unknown) => {
  const post = await postModel.find({ _id: userId });
  return post;
};

export const getPostLoader = () =>
  new DataLoader(async (userIds) => {
    // Since you have only one user, you can fetch posts for that user
    const userPosts = await getPost(userIds[0]);

    // Return the posts directly as an array
    return [userPosts];
  });
