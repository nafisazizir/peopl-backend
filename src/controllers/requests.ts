import { Response } from "express";
import RequestService from "../services/requests";
import { UserAuthRequest } from "../middleware/auth";

exports.createRequest = (req: UserAuthRequest, res: Response): void => {
  const { recipient } = req.body;
  const username = req.username;
  RequestService.create(username, recipient)
    .then((request) => {
      res.status(201).json(request);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getPendingRequests = (req: UserAuthRequest, res: Response): void => {
  const username = req.username;
  RequestService.getPendingRequests(username)
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.acceptChatRequest = (req: UserAuthRequest, res: Response): void => {
  const requestId = req.params.requestId;
  const username = req.username;
  RequestService.acceptChatRequest(username, requestId)
    .then(() => {
      res.status(200).json("Request successfully acepted");
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.rejectChatRequest = (req: UserAuthRequest, res: Response): void => {
  const requestId = req.params.requestId;
  const username = req.username;
  RequestService.rejecttChatRequest(username, requestId)
    .then(() => {
      res.status(200).json("Request successfully rejected");
    })
    .catch((error) => res.status(400).json(error.message));
};
