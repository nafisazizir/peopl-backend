import Community from "../models/communities";
import User from "../models/users";
import Request from "../models/requests";

interface MatchMakingResponse {
  username: string;
  mutualCommunities: number;
  callToAction: string;
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

    if (community !== "") {
      const communityDocs = await Community.findOne({
        name: community,
      });
      const users = await User.find({
        _id: { $in: communityDocs?.members, $ne: user._id },
      });
      const response: MatchMakingResponse[] = await Promise.all(
        users.map(async (userA) => {
          const mutualCommunities = this.countMutualFollowedCommunities(
            user,
            userA
          );
          const callToAction = await this.getStatusUsers(user, userA);
          return {
            username: userA.username,
            mutualCommunities: mutualCommunities,
            callToAction: callToAction,
          };
        })
      );
      response.sort((a, b) => b.mutualCommunities - a.mutualCommunities);

      return response;
    } else {
      const users = await User.find({ _id: { $ne: user._id } });
      const response: MatchMakingResponse[] = await Promise.all(
        users.map(async (userA) => {
          const mutualCommunities = this.countMutualFollowedCommunities(
            user,
            userA
          );
          const callToAction = await this.getStatusUsers(user, userA);
          return {
            username: userA.username,
            mutualCommunities: mutualCommunities,
            callToAction: callToAction,
          };
        })
      );
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

  async getStatusUsers(userA: User, userB: User): Promise<string> {
    const request = await Request.findOne({
      $or: [
        { sender: userA._id, recipient: userB._id },
        { sender: userB._id, recipient: userA._id },
      ],
    });

    if (!request) {
      return "connect";
    }

    if (request.status === "pending") {
      if (request.sender.toString() === userA._id.toString()) {
        return "pending";
      } else {
        return "accept";
      }
    }
    return "chat";
  }
}

export default new MatchmakingService();
