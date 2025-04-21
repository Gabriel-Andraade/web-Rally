import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../security/auth";
import { AuthRequest } from "../types/auth";

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autenticação ausente ou mal formatado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const userData = verifyToken(token);
    if (!userData) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Erro ao verificar token." });
  }
};
