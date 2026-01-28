import { addProject, getProjects } from "../services/projects.service";

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
    const { name, description, status } = req.body;

    const newProject = await addProject({ userId, name, description, status });

    res.status(200).json(newProject);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
