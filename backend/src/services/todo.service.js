import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchTasks({ userId }) {
  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  return tasks;
}

export async function addTask({ userId, title, description, priority }) {
  const newTask = await prisma.task.create({
    data: { userId, title, description, priority },
  });

  return newTask;
}
