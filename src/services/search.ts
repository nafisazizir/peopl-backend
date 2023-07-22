import User from "../models/users";
import Community from "../models/communities";
import Post from "../models/posts";
import PostService, {
  PostWithUserCommunity,
  PostWithAuthorCommunityResponse,
} from "./posts";

interface SearchResponse {
  posts: PostWithAuthorCommunityResponse[];
  communities: Community[];
  users: User[];
}

class SearchService {
  async search(keyword: string): Promise<SearchResponse> {
    const searchRegex = new RegExp(keyword, "i");
    const posts: PostWithUserCommunity[] = await Post.find({
      $or: [{ title: searchRegex }, { content: searchRegex }],
    })
      .populate("author", "username")
      .populate("community", "name");

    const postRes: PostWithAuthorCommunityResponse[] = await Promise.all(
      posts.map(async (post) => {
        const comments = await PostService.getCommentsRecursive(post._id);
        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          author: post.author.username,
          community: post.community.name,
          createdAt: post.createdAt,
          totalComments: comments.totalComments,
          __v: post.__v,
        };
      })
    );

    const communities = await Community.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    });
    const users = await User.find({ username: searchRegex });

    return { posts: postRes, communities, users };
  }
}

export default new SearchService();
