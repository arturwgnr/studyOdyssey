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

export async function deleteTask({ userId, id }) {
  const deleted = await prisma.task.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) {
    throw new Error("TASK_NOT_FOUND");
  }

  return deleted;
}

export async function editTask({ userId, id, title, description, priority }) {
  const task = await prisma.task.findUnique({
    where: { id, userId },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const updated = await prisma.task.update({
    where: { userId, id },
    data: { title, description, priority },
  });

  return updated;
}
