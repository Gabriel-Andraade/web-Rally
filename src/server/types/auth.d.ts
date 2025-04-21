import { Request } from "express";

export interface TokenPayLoad {
  id: string;
  name: string;
  lastName: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayLoad;
}
