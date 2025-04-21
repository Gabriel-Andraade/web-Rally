import { Request, Response, Router } from "express";
import {
  generateToken,
  hashPassword,
  comparePasswords,
} from "../security/auth";
import { getDb } from "../db";
import type { Users } from "../types/user";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, lastName, email, number, cpf, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const db = await getDb();

    const [result] = await db.execute(
      `INSERT INTO users (name, lastName, email, number, cpf, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, lastName, email, number, cpf, hashedPassword]
    );

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error.message);
    res.status(500).json({ message: "Erro ao registrar usuário." });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password, cpf } = req.body;

  try {
    const db = await getDb();

    const [rows]: any = await db.execute(
      "SELECT * FROM users WHERE email = ? AND cpf = ?",
      [email, cpf]
    );

    const users = rows as Users[];

    if (users.length === 0) {
      res
        .status(401)
        .json({ message: "Credenciais inválidas (usuário não encontrado)" });
      return;
    }

    const user = users[0];

    if (!user.is_verified) {
      res
        .status(403)
        .json({
          message:
            "E-mail não verificado. Verifique seu e-mail antes de fazer login.",
        });
      return;
    }

    const senhaCorreta = await comparePasswords(password, user.password);
    if (!senhaCorreta) {
      res
        .status(401)
        .json({ message: "Credenciais inválidas (senha incorreta)" });
      return;
    }

    const token = generateToken({
      id: String(user.id),
      name: user.name,
      lastName: user.lastName,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao realizar login." });
  }
});

export default router;
