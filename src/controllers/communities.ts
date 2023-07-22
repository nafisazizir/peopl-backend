import { Request, Response } from "express";
import CommunityService from "../services/communities";
import { UserAuthRequest } from "../middleware/auth";

exports.createCommunity = (req: Request, res: Response): void => {
  const { name, description } = req.query ? req.query : req.body;
  CommunityService.create(name, description)
    .then((community) => {
      res.status(201).json(community);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getCommunities = (req: Request, res: Response): void => {
  CommunityService.getCommunities()
    .then((communities) => res.status(200).send(communities))
    .catch((error) => res.status(400).json(error.message));
};

exports.getCommunityDetails = (req: UserAuthRequest, res: Response): void => {
  const { name } = req.params;
  const username = req.username;
  CommunityService.getCommunityDetails(name, username)
    .then((community) => res.status(200).send(community))
    .catch((error) => res.status(400).json(error.message));
};

exports.joinCommunity = (req: UserAuthRequest, res: Response): void => {
  const { name } = req.params;
  const username = req.username;
  CommunityService.joinCommunity(name, username)
    .then((user) => res.status(200).send(user))
    .catch((error) => res.status(400).json(error.message));
};

exports.leaveCommunity = (req: UserAuthRequest, res: Response): void => {
  const { name } = req.params;
  const username = req.username;
  CommunityService.leaveCommunity(name, username)
    .then((user) => res.status(200).send(user))
    .catch((error) => res.status(400).json(error.message));
};

exports.getJoinedCommunities = (req: UserAuthRequest, res: Response): void => {
  const username = req.username;
  CommunityService.getJoinedCommunities(username)
    .then((communities) => res.status(200).send(communities))
    .catch((error) => res.status(400).json(error.message));
};
