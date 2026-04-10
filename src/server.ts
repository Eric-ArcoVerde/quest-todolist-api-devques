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
  console.log(todos);
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
  res.status(201).send();
});

app.delete("/todos/:id", async (req, res) => {
    const id = Number(req.params.id)
    console.log(id)

    try {
        const deletedTodo = await prisma.todo.findUnique({
            where: { id }
        })

        if (!deletedTodo) {
            return res.status(404).send({ message: "Tarefa não encontrada" })
        }

        await prisma.todo.delete({
            where: { id }
        })
    } catch (error) {
        return res.status(500).send({ message: "Falha ao excluir a tarefa" })
    }
    res.status(200).send()
});

app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}`);
});
