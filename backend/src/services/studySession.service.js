import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addStudySection({ userId, duration, topic, type, date }) {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const newStudySection = await prisma.studySession.create({
    data: { userId, duration, topic, type, date },
  });

  return newStudySection;
}

export async function listStudySection({ userId }) {
  const studySection = await prisma.studySession.findMany({
    where: { userId },
  });

  return studySection;
}
