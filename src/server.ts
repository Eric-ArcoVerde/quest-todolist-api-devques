import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const port = 3000;
const app = express();

app.use(express.json());

app.get("/todos", async (_, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      text: "asc",
    },
  });
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { text, completed } = req.body;

  try {
    await prisma.todo.create({
      data: {
        text,
        completed,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "Falha ao cadastrar um filme" });
  }
  res.status(201).json();
});

app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}`);
});
