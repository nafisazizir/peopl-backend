import { Request, Response } from "express";
import SearchService from "../services/search";

exports.search = (req: Request, res: Response): void => {
  let { keyword } = req.query ? req.query : req.body;
  SearchService.search(keyword)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => res.status(400).json(error.message));
};
