import { Request, Response } from "express";
import UserService from "../services/users";
import { UserAuthRequest } from "../middleware/auth";

exports.register = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  UserService.register(email, password)
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.login = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  UserService.login(email, password)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getDetails = (req: Request, res: Response): void => {
  const { username } = req.params;
  UserService.getDetails(username)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.getRandomUsernameList = (req: Request, res: Response): void => {
  UserService.getRandomUsernameList()
    .then((usernameArray) => {
      res.status(200).send(usernameArray);
    })
    .catch((error) => res.status(400).json(error.message));
};

exports.setUsername = (req: UserAuthRequest, res: Response): void => {
  const { username } = req.params;
  const email = req.email;
  UserService.setUsername(email, username)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => res.status(400).json(error.message));
};
