import {
  addStudySection,
  listStudySection,
  deleteStudySection,
  sectionsCount,
  getTotalStudyMinutes,
  getRecentSessions,
  getLastSession,
  userSummary,
  weeklyReport,
  topicDistribution,
  updateStudySection,
  getWeekSummary,
  getMonthSummary,
} from "../services/studySession.service.js";

export async function addStudySectionController(req, res) {
  const { duration, topic, type, date } = req.body;
  const userId = req.userId;

  try {
    const newStudySection = await addStudySection({
      userId,
      duration,
      topic,
      type,
      date,
    });

    res.status(200).json({ message: "Section Created:", newStudySection });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function listStudySectionController(req, res) {
  const userId = req.userId;

  try {
    const studySection = await listStudySection({ userId });

    res.status(200).json(studySection);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function deleteStudySectionController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const updated = await deleteStudySection({ userId, id });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function updateStudySectionController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { topic, duration, type, date } = req.body;

    const updated = await updateStudySection({
      userId,
      id,
      topic,
      duration,
      type,
      date,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function dashboardSummaryController(req, res) {
  try {
    const userId = req.userId;

    const summary = await sectionsCount({ userId });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function getTotalStudyMinutesController(req, res) {
  try {
    const userId = req.userId;

    const studyMinutes = await getTotalStudyMinutes({ userId });

    res.status(200).json(studyMinutes);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function getRecentSessionsController(req, res) {
  try {
    const userId = req.userId;
    const recentSession = await getRecentSessions({ userId });

    res.status(200).json(recentSession);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function getLastSessionController(req, res) {
  try {
    const userId = req.userId;
    const lastSession = await getLastSession({ userId });

    res.status(200).json(lastSession);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function userSummaryController(req, res) {
  try {
    const userId = req.userId;

    const summary = await userSummary({ userId });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function weeklyReportController(req, res) {
  try {
    const userId = req.userId;

    const weekReport = await weeklyReport({ userId });

    res.status(200).json(weekReport);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function topicDistributionController(req, res) {
  try {
    const userId = req.userId;
    const sessions = await topicDistribution({ userId });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function weekSummaryController(req, res) {
  try {
    const userId = req.userId;
    const minutes = await getWeekSummary({ userId });
    res.status(200).json({ minutes });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export async function monthSummaryController(req, res) {
  try {
    const userId = req.userId;
    const minutes = await getMonthSummary({ userId });
    res.status(200).json({ minutes });
  } catch (err) {
    res.status(500).json(err.message);
  }
}
