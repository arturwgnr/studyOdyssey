// InboxView.jsx (com marcar como concluído ao clicar na task)
import axios from "axios";

export default function InboxView({
  tasks,
  formData,
  setFormData,
  addTask,
  handleDelete,
  fetchTasks,
}) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IE", {
      day: "2-digit",
      month: "short",
    });
  }

  function onDragStart(e, taskId) {
    e.dataTransfer.setData("taskId", taskId);

    const img = document.createElement("div");
    img.style.width = "0px";
    img.style.height = "0px";
    document.body.appendChild(img);
    e.dataTransfer.setDragImage(img, 0, 0);

    setTimeout(() => document.body.removeChild(img), 0);
  }

  async function toggleCompleted(task) {
    const token = localStorage.getItem("token");

    const newStatus = task.status === "PENDING" ? "DONE" : "PENDING";

    const res = await axios.put(
      `http://localhost:3000/todo-status/${task.id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    fetchTasks();
    console.log(res.data);
  }

  return (
    <div className="todo-panel inbox-panel">
      {/* HEADER */}
      <div className="panel-header">
        <h2 className="panel-title">Inbox</h2>
        <span className="panel-hint">All tasks overview</span>
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
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={() => toggleCompleted(task)}
            className={`task-card priority-${task.priority.toLowerCase()} ${
              task.status === "DONE" ? "completed" : ""
            }`}
          >
            {/* CARD HEADER */}
            <div className="task-card-header">
              <div className="top-part">
                <h3 className="task-title">{task.title}</h3>

                <span className="task-created">
                  {formatDate(task.createdAt)}
                </span>
              </div>

              <button
                className="task-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task.id);
                }}
              >
                ×
              </button>
            </div>

            {/* DESCRIPTION */}
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            {/* FOOTER */}
            <div className="task-footer">
              <span
                className={`task-badge priority-${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              {task.status === "DONE" ? (
                <span className="task-status completed">Done</span>
              ) : task.plannedDate ? (
                <span className="task-status planned">Planned</span>
              ) : (
                <span className="task-action-hint">Unplanned</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
