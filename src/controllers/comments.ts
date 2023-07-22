import { Request, Response } from "express";
import CommentService from "../services/comments";
import { UserAuthRequest } from "../middleware/auth";

exports.createComment = (req: UserAuthRequest, res: Response): void => {
  const { parentId, parentType, content } = req.body;
  console.log(req.body);
  const email = req.email;
  CommentService.create(email, parentId, parentType, content)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((error) => res.status(400).json(error.message));
};
