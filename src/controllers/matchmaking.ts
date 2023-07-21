import { Request, Response } from "express";
import { UserAuthRequest } from "../middleware/auth";
import MatchmakingService from "../services/matchmaking";

exports.findUsers = (req: UserAuthRequest, res: Response): void => {
  const username = req.username;
  const { community } = req.query ? req.query : req.body;

  MatchmakingService.findUsers(username, community)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => res.status(400).json(error.message));
};
