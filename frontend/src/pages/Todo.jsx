import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/Todo.css";

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
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(res.data);
  }

  async function addTask(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:3000/todo", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFormData({ title: "", description: "", priority: "MEDIUM" });
    fetchTasks();
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await axios.delete(`http://localhost:3000/todo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="todo-page">
      {/* HEADER */}
      <header className="todo-header">
        <div className="todo-header-content">
          <h1 className="todo-title">Personal Planner</h1>
          <p className="todo-subtitle">Always stay one step ahead</p>
        </div>
      </header>

      {/* LAYOUT */}
      <section className="todo-layout">
        {/* INBOX */}
        <div className="todo-panel inbox-panel">
          <div className="panel-header">
            <h2 className="panel-title">Inbox</h2>
            <span className="panel-hint">Unplanned tasks</span>
          </div>

          {/* FORM */}
          <form className="task-form" onSubmit={addTask}>
            <div className="form-group">
              <input
                type="text"
                className="task-input"
                placeholder="Task title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <textarea
                className="task-textarea"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="form-row">
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
            </div>
          </form>

          {/* LIST */}
          <div className="task-list">
            {tasks.length === 0 && <p className="empty-state">No tasks yet.</p>}

            {tasks.map((task) => (
              <article
                key={task.id}
                className={`task-card priority-${task.priority.toLowerCase()}`}
              >
                <div className="task-card-header">
                  <h3 className="task-title">{task.title}</h3>

                  <button
                    className="task-delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    ×
                  </button>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                <div className="task-footer">
                  <span
                    className={`task-badge priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  {/* futuro: drag handle / plan button */}
                  <span className="task-action-hint">Drag to plan →</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* FUTURO: PLANNER PANEL */}
        <div className="todo-panel planner-panel">
          <div className="panel-header">
            <h2 className="panel-title">Weekly Planner</h2>
            <span className="panel-hint">Coming next</span>
          </div>

          <div className="planner-placeholder">
            <p>Drag tasks here to plan your week.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
