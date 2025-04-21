import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/static", express.static(path.join(__dirname, "../../static")));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://translate.googleapis.com https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;"
  );
  next();
});

const staticPaths = ["form", "main_pg", "logged", "main_pg/content"];
staticPaths.forEach((folder) => {
  app.use(express.static(path.join(__dirname, `../../static/${folder}`)));
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/form/form.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
