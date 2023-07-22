import Community from "../models/communities";
import Post from "../models/posts";
import User from "../models/users";
import PostService, {
  PostWithUserCommunity,
  PostWithAuthorCommunityResponse,
} from "./posts";

interface CommunityDetailsResponse {
  name: string;
  description: string;
  createdAt: Date;
  isMember: boolean;
  totalMembers: number;
  posts: PostWithAuthorCommunityResponse[];
}

class CommunityService {
  async create(name: string, description: string): Promise<Community> {
    const existingCommunity = await Community.findOne({ name: name });
    if (existingCommunity) {
      throw new Error("Community already exist");
    }

    const community = await Community.create({
      name: name,
      description: description,
    }).catch((error) => {
      throw new Error(error.message);
    });
    return community;
  }

  async getCommunities(): Promise<string[]> {
    const communities: Community[] = await Community.find();
    const communityNames: string[] = communities.map(
      (community) => community.name
    );
    return communityNames;
  }

  async getCommunityDetails(
    name: string,
    username: string
  ): Promise<CommunityDetailsResponse> {
    const community = await Community.findOne({ name: name });
    if (!community) {
      throw new Error("Community does not exist");
    }
    const user = await User.findOne({ username: username });
    const posts: PostWithUserCommunity[] = await Post.find({
      community: community._id,
    })
      .sort({ createdAt: -1 })
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

    const communityDetails: CommunityDetailsResponse = {
      name: community.name,
      description: community.description,
      createdAt: community.createdAt,
      isMember: user ? community.members.includes(user._id) : false,
      totalMembers: community.members.length,
      posts: postRes,
    };

    return communityDetails;
  }

  async joinCommunity(name: string, username: string): Promise<User> {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist");
    }
    const community = await Community.findOne({ name: name });
    if (!community) {
      throw new Error("Community does not exist");
    }

    await User.updateOne(
      { _id: user._id },
      { $addToSet: { followedCommunities: community._id } }
    );
    await Community.updateOne(
      { _id: community._id },
      { $addToSet: { members: user._id } }
    );

    const updatedUser = await User.findById(user._id);
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user");
    }
    return updatedUser;
  }

  async leaveCommunity(name: string, username: string): Promise<User> {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist");
    }
    const community = await Community.findOne({ name: name });
    if (!community) {
      throw new Error("Community does not exist");
    }

    await User.updateOne(
      { _id: user._id },
      { $pull: { followedCommunities: community._id } }
    );
    await Community.updateOne(
      { _id: community._id },
      { $pull: { members: user._id } }
    );

    const updatedUser = await User.findById(user._id);
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user");
    }
    return updatedUser;
  }
}

export default new CommunityService();
