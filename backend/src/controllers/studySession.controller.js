import {
  addStudySection,
  listStudySection,
  deleteStudySection,
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
    const { id } = req.params;

    const updated = await deleteStudySection({ id });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
