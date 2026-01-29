import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjects({ userId }) {
  const projects = await prisma.project.findMany({
    where: { userId },
  });

  return projects;
}

export async function addProject({
  userId,
  name,
  description,
  status,
  startingDate,
}) {
  const newProject = await prisma.project.create({
    data: {
      userId,
      name,
      description,
      status,
      startingDate: startingDate ? new Date(startingDate) : null,
    },
  });

  return newProject;
}

export async function deleteProject({ userId, id }) {
  const project = await prisma.project.findFirst({
    where: { id, userId },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  } else {
    const updated = await prisma.project.delete({
      where: { id },
    });

    return updated;
  }
}
