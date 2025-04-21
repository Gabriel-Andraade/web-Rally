import { comparePasswords, hashPassword } from "../security/auth";
import { Router, Request, Response } from "express";
import { getDb } from "../db";
import { sendVerificationEmail } from "../security/verifycode/verification";

const router = Router();

interface RegisterBody {
  name: string;
  lastName: string;
  email: string;
  number: string;
  cpf: string;
  password: string;
}

interface LoginBody {
  email?: string;
  password?: string;
  cpf?: string;
}

interface VerifyCodeBody {
  email: string;
  code: string;
}

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { name, lastName, email, number, cpf, password } = req.body;

    try {
      const db = await getDb();

      // Verifica se e-mail já está em uso
      const [existingEmail]: any = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "E-mail já está em uso." });
      }

      // Verifica se CPF já está em uso
      const [existingCpf]: any = await db.execute(
        "SELECT id FROM users WHERE cpf = ?",
        [cpf]
      );
      if (existingCpf.length > 0) {
        return res.status(400).json({ message: "CPF já cadastrado." });
      }

      const hashedPassword = await hashPassword(password);

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      await db.execute(
        `INSERT INTO users (name, lastName, email, number, cpf, password, is_verified, verification_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          lastName,
          email,
          number,
          cpf,
          hashedPassword,
          false,
          verificationCode,
        ]
      );

      await sendVerificationEmail(email, verificationCode);

      res.status(201).json({
        message: "Usuário criado. Verifique o e-mail para ativar a conta.",
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: "Erro ao registrar usuário." });
    }
  }
);

router.post(
  "/verify-code",
  async (req: Request<{}, {}, VerifyCodeBody>, res: Response) => {
    const { email, code } = req.body;

    try {
      const db = await getDb();
      const [rows]: any = await db.execute(
        "SELECT verification_code, is_verified FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const user = rows[0];

      if (user.is_verified) {
        return res.status(400).json({ message: "Usuário já verificado." });
      }

      if (user.verification_code !== code) {
        return res
          .status(400)
          .json({ message: "Código de verificação inválido." });
      }

      await db.execute(
        "UPDATE users SET is_verified = ?, verification_code = NULL WHERE email = ?",
        [true, email]
      );

      res.status(200).json({ message: "E-mail verificado com sucesso!" });
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      res.status(500).json({ message: "Erro ao verificar código." });
    }
  }
);

router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password, cpf } = req.body;

    try {
      const db = await getDb();
      const [rows]: any = await db.execute(
        "SELECT name, password, is_verified FROM users WHERE email = ? AND cpf = ?",
        [email, cpf]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const user = rows[0];

      if (!user.is_verified) {
        return res
          .status(403)
          .json({ message: "E-mail ainda não verificado." });
      }

      const isPasswordValid = await comparePasswords(password!, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      res.json({
        name: user.name,
        message: "Login realizado com sucesso!",
        token: "token-fake-aqui", // Troca isso depois por um JWT
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
);

router.post("/send-code", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await sendVerificationEmail(email, verificationCode);

    res
      .status(200)
      .json({ message: "Código de verificação reenviado com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar código de verificação:", error);
    res.status(500).json({ message: "Erro ao enviar código de verificação." });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const [rows]: any = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar os dados do usuário:", error);
    res.status(500).json({ message: "Erro ao recuperar os dados do usuário." });
  }
});

export default router;
