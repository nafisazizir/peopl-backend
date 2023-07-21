import { Response } from "express";
import MessageService from "../services/messages";
import { UserAuthRequest } from "../middleware/auth";

exports.sendMessage = (req: UserAuthRequest, res: Response): void => {
  const { recipient, content } = req.query ? req.query : req.body;
  const username = req.username;
  MessageService.create(username, recipient, content)
    .then((message) => {
      res.status(201).json(message);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getMessages = (req: UserAuthRequest, res: Response): void => {
  const { recipient } = req.query ? req.query : req.body;
  const username = req.username;
  MessageService.getMessages(username, recipient)
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((error) => res.status(400).json(error.message));
};
