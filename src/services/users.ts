import User from "../models/users";
import { generateUsername } from "unique-username-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import PostService, {
  PostWithUserCommunity,
  PostWithAuthorCommunityResponse,
} from "./posts";
import Post from "../models/posts";
import { ObjectId } from "mongoose";

config();

interface TokenResponse {
  token: string;
  username: string;
}

interface UserDetails {
  username: string;
  email: string;
  followedCommunities: ObjectId[];
  posts: PostWithAuthorCommunityResponse[];
}

class UserService {
  async register(email: string, password: string): Promise<TokenResponse> {
    // generate random username
    const username = await this.generateRandomUniqueUsername();

    // validate email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    // Validate the password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      } else {
        throw new Error(
          "Password must contain at least one alphabet and one number"
        );
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    }).catch((error) => {
      throw new Error(error.message);
    });

    const res = await this.login(email, password);
    return res;
  }

  async generateRandomUniqueUsername(): Promise<string> {
    let username = generateUsername("", 2, 19);
    let existingUser = await User.findOne({ username: username });

    while (existingUser) {
      username = generateUsername("", 2, 19);
      existingUser = await User.findOne({ username: username });
    }
    return username;
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email not found");
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (isMatchPassword) {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "",
        {
          expiresIn: "365d",
        }
      );
      return {
        token: token,
        username: user.username,
      };
    } else {
      throw new Error("Incorrect password");
    }
  }

  async getDetails(username: string): Promise<UserDetails> {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("Username not found");
    }

    const posts: PostWithUserCommunity[] = await Post.find({
      author: user._id,
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

    return {
      username: user.username,
      email: user.email,
      followedCommunities: user.followedCommunities,
      posts: postRes,
    };
  }

  async getRandomUsernameList(): Promise<string[]> {
    const usernamesArray: string[] = [];

    for (let i = 0; i < 5; i++) {
      const randomUsername = await this.generateRandomUniqueUsername();
      usernamesArray.push(randomUsername);
    }

    return usernamesArray;
  }

  async setUsername(
    email: string,
    newUsername: string
  ): Promise<TokenResponse> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }

    user.username = newUsername;
    await user.save();

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "",
      {
        expiresIn: "365d",
      }
    );
    return {
      token: token,
      username: newUsername,
    };
  }
}

export default new UserService();
