import Post from "../models/posts";
import Community from "../models/communities";
import User from "../models/users";
import Comment from "../models/comments";
import { Schema } from "mongoose";

interface CommentResponse {
  content: string;
  author: Schema.Types.ObjectId;
  parentId: Schema.Types.ObjectId;
  parentType: number;
  createdAt: Date;
  replies: CommentResponse[];
}

interface PostDetailsResponse {
  _id: string;
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  community: Schema.Types.ObjectId;
  createdAt: Date;
  comments: CommentResponse[];
}

export interface PostWithUserCommunity {
  _id: any;
  __v: any;
  title: string;
  content: string;
  author: User;
  community: Community;
  createdAt: Date;
}

export interface PostWithAuthorCommunityResponse {
  _id: string;
  title: string;
  content: string;
  author: string;
  community: string;
  createdAt: Date;
  __v: number;
}

class PostService {
  async create(
    title: string,
    content: string,
    username: string,
    community: string
  ): Promise<Post> {
    const communityDoc = await Community.findOne({ name: community });
    if (!communityDoc) {
      throw new Error("Community does not exist");
    }
    const userDoc = await User.findOne({ username: username });
    if (!userDoc) {
      throw new Error("User does not exist");
    }

    const post = Post.create({
      title: title,
      content: content,
      author: userDoc._id,
      community: communityDoc._id,
    }).catch((error) => {
      throw new Error(error.message);
    });

    return post;
  }

  async getJoinedPosts(
    email: string
  ): Promise<PostWithAuthorCommunityResponse[]> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }

    const posts: PostWithUserCommunity[] = await Post.find({
      community: { $in: user.followedCommunities },
    })
      .sort({ createdAt: -1 })
      .populate("author", "username") // Populates author field with username
      .populate("community", "name"); // Populates community field with name

    const res = await Promise.all(
      posts.map(async (post) => {
        const comments = await this.getCommentsRecursive(post._id);
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

    return res;
  }

  async deletePost(email: string, postId: string): Promise<boolean> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post does not exist");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    if (post.author.toString() !== user._id.toString()) {
      throw new Error("User is not the author of this post");
    }

    await Post.findByIdAndDelete(post._id)
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw new Error(error.message);
      });
    return true;
  }

  async getPostDetails(postId: string): Promise<PostDetailsResponse> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post does not exist");
    }
    const comments = await this.getCommentsRecursive(postId);
    const postResponse: PostDetailsResponse = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      community: post.community,
      createdAt: post.createdAt,
      comments: comments.comments,
    };
    return postResponse;
  }

  async getCommentsRecursive(
    parentId: string
  ): Promise<{ comments: CommentResponse[]; totalComments: number }> {
    const comments = await Comment.find({ parentId: parentId }).sort({
      createdAt: -1,
    });
    const nestedComments: CommentResponse[] = [];
    let totalComments = comments.length;

    for (const comment of comments) {
      const nestedComment: CommentResponse = {
        content: comment.content,
        author: comment.author,
        parentId: comment.parentId,
        parentType: comment.parentType,
        createdAt: comment.createdAt,
        replies: [],
      };
      const subCommentsResult = await this.getCommentsRecursive(comment._id);
      if (subCommentsResult.totalComments > 0) {
        totalComments += subCommentsResult.totalComments;
        nestedComment.replies = subCommentsResult.comments;
      }
      nestedComments.push(nestedComment);
    }

    return { comments: nestedComments, totalComments };
  }
}

export default new PostService();
