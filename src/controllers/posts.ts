import { Response } from "express";
import PostService from "../services/posts";
import { UserAuthRequest } from "../middleware/auth";

exports.createPost = (req: UserAuthRequest, res: Response): void => {
  const { title, content, community } = req.body;
  const username = req.username;
  PostService.create(title, content, username, community)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getJoinedPosts = (req: UserAuthRequest, res: Response): void => {
  const email = req.email;
  PostService.getJoinedPosts(email)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.deletePost = (req: UserAuthRequest, res: Response): void => {
  const { postId } = req.params;
  const email = req.email;
  PostService.deletePost(email, postId)
    .then(() => {
      res.status(200).json("Post successfully deleted");
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getPostDetails = (req: UserAuthRequest, res: Response): void => {
  const { postId } = req.params;
  PostService.getPostDetails(postId)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => res.status(400).json(error.message));
};
