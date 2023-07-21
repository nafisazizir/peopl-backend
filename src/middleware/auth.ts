import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

interface JwtPayload {
  username: string;
  email: string;
}

export interface UserAuthRequest extends Request {
  username: string;
  email: string;
}

export default function verifyToken(
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  if (!token.startsWith("Bearer ")) {
    return res.status(401).send("Invalid Token");
  }

  token = token.substring(7, token.length);
  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_KEY ? process.env.TOKEN_KEY : ""
    ) as JwtPayload;
    req.username = decoded.username;
    req.email = decoded.email;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}
