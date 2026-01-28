import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProjects({ userId }) {
  const projects = await prisma.projects.findMany({
    where: { userId },
  });

  if (!projects) {
    throw new Error("PROJECT_NOT_FOUND");
  }
}
