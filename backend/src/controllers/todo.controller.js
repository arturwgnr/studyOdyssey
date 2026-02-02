import {
  addTask,
  fetchTasks,
  deleteTask,
  editTask,
} from "../services/todo.service.js";

export async function fetchTasksController(req, res) {
  try {
    const userId = req.userId;

    if (!req.userId) {
      return res.status(401).json("UNAUTHORIZED");
    }

    const tasks = await fetchTasks({ userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function addTaskController(req, res) {
  try {
    const userId = req.userId;

    if (!req.userId) {
      return res.status(401).json("UNAUTHORIZED");
    }

    const { title, description, priority } = req.body;

    const newTask = await addTask({
      userId,
      title,
      description,
      priority,
    });

    res.status(200).json(newTask);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function deleteTaskController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deleted = await deleteTask({ userId, id });

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export async function editTaskController(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, priority } = req.body;

    const updated = await editTask({
      userId,
      id,
      title,
      description,
      priority,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
