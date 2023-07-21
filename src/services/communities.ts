import Community from "../models/communities";
import Post from "../models/posts";
import User from "../models/users";

interface CommunityDetailsResponse {
  name: string;
  description: string;
  createdAt: Date;
  isMember: boolean;
  totalMembers: number;
  posts: Post[];
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
    const posts = await Post.find({ community: community._id });
    const communityDetails: CommunityDetailsResponse = {
      name: community.name,
      description: community.description,
      createdAt: community.createdAt,
      isMember: user ? community.members.includes(user._id) : false,
      totalMembers: community.members.length,
      posts: posts ? posts : [],
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
