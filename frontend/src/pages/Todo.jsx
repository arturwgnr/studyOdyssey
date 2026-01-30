import { useState, useEffect } from "react";
import axios from "axios";

export default function Todo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [tasks, setTasks] = useState([]);

  async function fetchTasks() {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:3000/todo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(res.data);
  }

  async function addTask(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:3000/todo", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFormData({ title: "", description: "", priority: "MEDIUM" });
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="todo-page">
      <header className="todo-header">
        <h1 className="todo-title">Personal Planner</h1>
        <p className="todo-subtitle">Always stay one step ahead</p>
      </header>

      <main className="todo-layout">
        <section className="inbox-panel">
          <h2 className="panel-title">Inbox</h2>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task title"
              className="task-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Description (optional)"
              className="task-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <select
              className="task-priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <button type="submit" className="task-submit">
              Add task
            </button>
          </form>

          <div className="inbox-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card priority-${task.priority.toLowerCase()}`}
              >
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
