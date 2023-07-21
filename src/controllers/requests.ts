import { Response } from "express";
import RequestService from "../services/requests";
import { UserAuthRequest } from "../middleware/auth";

exports.createRequest = (req: UserAuthRequest, res: Response): void => {
  const { recipient } = req.query ? req.query : req.body;
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
      res.status(201).json(request);
    })
    .catch((error) => res.status(400).json(error.message));
};
