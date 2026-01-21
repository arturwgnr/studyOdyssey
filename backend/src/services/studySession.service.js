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

export async function sectionsCount({ userId }) {
  const summary = await prisma.studySession.count({
    where: { userId: userId },
  });

  return summary;
}

export async function getTotalStudyMinutes({ userId }) {
  const studyMinutes = await prisma.studySession.aggregate({
    _sum: {
      duration: true,
    },
    where: { userId: userId },
  });

  if (studyMinutes._sum.duration === null) {
    return 0;
  }

  return studyMinutes._sum.duration;
}

export async function getRecentSessions({ userId }) {
  const sessions = await prisma.studySession.findMany({
    where: { userId: userId },
    orderBy: { date: "desc" },
    take: 5,
  });

  if (sessions.length === 0) {
    return [];
  }

  return sessions;
}

export async function getLastSession({ userId }) {
  const session = await prisma.studySession.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return session ?? null;
}

export async function weeklyReport({ userId }) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      date: {
        gte: sevenDaysAgo,
      },
    },
  });

  // estrutura base: últimos 7 dias com 0 minutos
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    week.push({
      date: day.toDateString(),
      minutes: 0,
    });
  }

  // soma minutos por dia
  sessions.forEach((session) => {
    const sessionDay = new Date(session.date).toDateString();

    const day = week.find((d) => d.date === sessionDay);
    if (day) {
      day.minutes += session.duration;
    }
  });

  // formata para o front
  return week.reverse().map((d) => ({
    day: new Date(d.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    minutes: d.minutes,
  }));
}

export async function userSummary({ userId }) {
  const totalSessions = await sectionsCount({ userId });
  const totalMinutes = await getTotalStudyMinutes({ userId });
  const lastSession = await getLastSession({ userId });

  return {
    totalSessions,
    totalMinutes,
    lastSession,
  };
}
