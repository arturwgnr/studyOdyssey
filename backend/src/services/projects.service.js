import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjects({ userId }) {
  const projects = await prisma.projects.findMany({
    where: { userId },
  });

  return projects;
}

export async function addProject({ userId, name, description, status }) {
  const newProject = await prisma.project.create({
    data: {
      userId,
      name,
      description,
      status,
    },
  });

  return newProject;
}
