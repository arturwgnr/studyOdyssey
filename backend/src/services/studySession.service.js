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

  if (duration <= 0) {
    throw new Error("WRONG_DURATION");
  }

  const newStudySection = await prisma.studySession.create({
    data: {
      userId,
      duration: Number(duration), // <-- precisa ser número
      topic,
      type,
      date: new Date(date), // <-- precisa ser Date
    },
  });

  return newStudySection;
}

export async function listStudySection({ userId }) {
  const studySection = await prisma.studySession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  });

  return studySection;
}

export async function deleteStudySection({ id }) {
  const studySection = await prisma.studySession.findUnique({
    where: { id },
  });

  if (!studySection) {
    throw new Error("SECTION_NOT_FOUND");
  }

  const updated = await prisma.studySession.delete({
    where: { id },
  });

  return updated;
}
