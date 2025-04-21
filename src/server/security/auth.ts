import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TokenPayLoad } from "../types/auth";

const SECRET_KEY = process.env.JWT_SECRET || "secret-dev";

export const generateToken = (payLoad: TokenPayLoad): string => {
  return jwt.sign(payLoad, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string): TokenPayLoad | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayLoad;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
