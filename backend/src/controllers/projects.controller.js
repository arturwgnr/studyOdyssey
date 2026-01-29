import {
  addProject,
  getProjects,
  deleteProject,
} from "../services/projects.service.js";

export async function getProjectsController(req, res) {
  try {
    const userId = req.userId;
    const projects = await getProjects({ userId });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function addProjectController(req, res) {
  try {
    const userId = req.userId;
    const { name, description, status, startingDate } = req.body;

    const newProject = await addProject({
      userId,
      name,
      description,
      status,
      startingDate,
    });

    res.status(200).json(newProject);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function deleteProjectController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deleted = await deleteProject({ userId, id });

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
