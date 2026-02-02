// PlannerView.jsx (tasks organizadas abaixo, layout estável)
import { useMemo, useState } from "react";
import axios from "axios";

import "../styles/PlannerView.css";

const DAYS = [
  { label: "Mon", offset: 0 },
  { label: "Tue", offset: 1 },
  { label: "Wed", offset: 2 },
  { label: "Thu", offset: 3 },
  { label: "Fri", offset: 4 },
  { label: "Sat", offset: 5 },
  { label: "Sun", offset: 6 },
];

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function PlannerView({ tasks, setTasks }) {
  const weekStart = useMemo(() => startOfWeek(), []);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const plannedTasks = tasks.filter((t) => t.plannedDate);
  const unplannedTasks = tasks.filter((t) => !t.plannedDate);

  async function updateTask(id, data) {
    const token = localStorage.getItem("token");

    const res = await axios.put(`http://localhost:3000/todo/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  }

  function updateTaskDate(taskId, plannedDate) {
    updateTask(taskId, { plannedDate });
  }

  function onDragStart(e, taskId) {
    e.dataTransfer.setData("taskId", taskId);
  }

  function onDrop(e, date) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    updateTaskDate(taskId, date);
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function removeFromPlanner(taskId) {
    updateTaskDate(taskId, null);
  }

  return (
    <>
      <div className="todo-panel planner-panel">
        <div className="panel-header">
          <h2 className="panel-title">Weekly Planner</h2>
          <span className="panel-hint">Plan your week</span>
        </div>

        {/* WEEK GRID (sempre fixo no topo) */}
        <div className="planner-grid">
          {DAYS.map((day) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + day.offset);
            const dateKey = formatDate(date);

            const dayTasks = plannedTasks.filter((t) =>
              t.plannedDate?.startsWith(dateKey),
            );

            return (
              <div
                key={day.label}
                className="planner-day"
                onDrop={(e) => onDrop(e, dateKey)}
                onDragOver={allowDrop}
              >
                <div className="planner-day-header">
                  <span className="planner-day-label">{day.label}</span>
                  <span className="planner-day-date">
                    {date.toLocaleDateString("en-IE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="planner-day-body">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      className={`planner-task priority-${task.priority.toLowerCase()}`}
                    >
                      <span className="planner-task-title">{task.title}</span>

                      <div className="planner-actions">
                        <button
                          className="planner-edit"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingTask(task);
                            setEditForm({
                              title: task.title,
                              description: task.description || "",
                              priority: task.priority,
                            });
                          }}
                        >
                          ✎
                        </button>

                        <button
                          className="planner-remove"
                          onClick={() => removeFromPlanner(task.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* UNPLANNED TASKS (SEÇÃO SEPARADA EMBAIXO) */}
        <section className="planner-unplanned-section">
          <h3 className="planner-unplanned-title">Unplanned Tasks</h3>

          <div className="planner-unplanned-list">
            {unplannedTasks.length === 0 && (
              <p className="planner-unplanned-empty">All tasks planned</p>
            )}

            {unplannedTasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                className={`planner-task pool priority-${task.priority.toLowerCase()}`}
              >
                <span className="planner-task-title">{task.title}</span>

                <button
                  className="planner-edit"
                  onClick={() => {
                    setIsEditing(true);
                    setEditingTask(task);
                    setEditForm({
                      title: task.title,
                      description: task.description || "",
                      priority: task.priority,
                    });
                  }}
                >
                  ✎
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Edit Task</h3>

            <div className="modal-content">
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Task title"
                className="modal-input"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description"
                className="modal-textarea"
              />

              <select
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
                className="modal-select"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="dashboard-btn"
                onClick={async () => {
                  await updateTask(editingTask.id, editForm);
                  setIsEditing(false);
                  setEditingTask(null);
                }}
              >
                Save
              </button>

              <button
                className="dashboard-btn secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
