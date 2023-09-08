import DataLoader from 'dataloader';
import { IPostDocument, IPostSchemaDocument } from './posts.model';
import PostModel from './posts.model';
import { Post } from '../../../__generated__/resolvers-types';

export const postLoader = new DataLoader<string, IPostDocument[]>(async (ids) => {
    // Find all posts with the creator field matching the provided user IDs
    const posts = await PostModel.find({ creator: { $in: ids } });
  
    // Create a map of user IDs to an array of their posts
    const userPostsMap: Record<string, IPostDocument[]> = {};
  
    // Initialize the map with empty arrays for each user ID
    ids.forEach((id) => {
      userPostsMap[id] = [];
    });
  
    // Group the posts by their creator's user ID
    posts.forEach((post) => {
      userPostsMap[post.creator.toString()].push(post);
    });
  
    // Map the IDs to arrays of user posts, maintaining the order
    return ids.map((id) => userPostsMap[id]);
  });
  