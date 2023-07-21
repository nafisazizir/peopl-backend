import Community from "../models/communities";
import User from "../models/users";

interface MatchMakingResponse {
  username: string;
  mutualCommunities: number;
}

class MatchmakingService {
  async findUsers(
    username: string,
    community: string
  ): Promise<MatchMakingResponse[]> {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (community !== undefined) {
      const communityDocs = await Community.findOne({
        name: community,
      });
      const users = await User.find({
        _id: { $in: communityDocs?.members, $ne: user._id },
      });
      const response: MatchMakingResponse[] = users.map((userA) => {
        const mutualCommunities = this.countMutualFollowedCommunities(
          user,
          userA
        );
        return {
          username: userA.username,
          mutualCommunities: mutualCommunities,
        };
      });
      response.sort((a, b) => b.mutualCommunities - a.mutualCommunities);

      return response;
    } else {
      const users = await User.find({ _id: { $ne: user._id } });
      const response: MatchMakingResponse[] = users.map((userA) => {
        const mutualCommunities = this.countMutualFollowedCommunities(
          user,
          userA
        );
        return {
          username: userA.username,
          mutualCommunities: mutualCommunities,
        };
      });
      response.sort((a, b) => b.mutualCommunities - a.mutualCommunities);

      return response;
    }
  }

  countMutualFollowedCommunities(userA: User, userB: User): number {
    let followedCommunitiesA = new Set(
      userA.followedCommunities.map((a) => {
        return a.toString();
      })
    );
    let followedCommunitiesB = new Set(
      userB.followedCommunities.map((b) => {
        return b.toString();
      })
    );

    const intersectionSet = new Set<any>();
    for (const element of followedCommunitiesA) {
      if (followedCommunitiesB.has(element)) {
        intersectionSet.add(element);
      }
    }

    return intersectionSet.size;
  }
}

export default new MatchmakingService();
