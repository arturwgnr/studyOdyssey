import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/Projects.css";

export default function Projects() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingDate: "",
    status: "planned",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "planned",
  });

  const [projects, setProjects] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (!formData.name.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/projects", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => [...prev, res.data]);

      setFormData({
        name: "",
        description: "",
        startingDate: "",
        status: "planned",
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getProjects() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteProject(id) {
    try {
      if (!window.confirm("Delete this project?")) return;

      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error.message);
    }
  }

  function getDaysOnProject(startingDate, status) {
    if (!startingDate) return null;
    if (status === "completed") return null;

    const start = new Date(startingDate);
    const today = new Date();
    const diff = today - start;

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  async function updateProject(id, data) {
    const token = localStorage.getItem("token");

    const res = await axios.put(`http://localhost:3000/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <main className="projects-main">
      {/* HEADER */}
      <header className="projects-header">
        <div>
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            Track what you are building and learning
          </p>
        </div>
      </header>

      {/* FORM */}
      <section className="project-form">
        <h3 className="form-title">Add Project</h3>

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Project name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="date"
            name="startingDate"
            value={formData.startingDate}
            onChange={handleChange}
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Project description"
          value={formData.description}
          onChange={handleChange}
          className="project-description-input"
        />

        <button className="project-add-btn" onClick={handleSubmit}>
          Add Project
        </button>
      </section>

      {/* LIST */}
      <section className="projects-grid">
        {projects.length === 0 && (
          <p className="projects-empty">No projects yet.</p>
        )}

        {projects.map((p) => {
          const days = getDaysOnProject(p.startingDate, p.status);

          return (
            <article key={p.id} className={`project-card ${p.status}`}>
              {/* ACTIONS */}
              <div className="project-actions">
                <span className={`project-status status-${p.status}`}>
                  {p.status}
                </span>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditingItem(p);
                    setEditForm({
                      name: p.name,
                      description: p.description,
                      status: p.status,
                    });
                  }}
                  className="project-btn edit"
                >
                  Edit
                </button>
                <button
                  className="project-btn delete"
                  onClick={() => deleteProject(p.id)}
                >
                  ×
                </button>
              </div>

              {/* HEADER */}
              <div className="project-header">
                <h3 className="project-name">{p.name}</h3>
              </div>

              {/* DESCRIPTION */}
              {p.description && (
                <p className="project-description clamp">{p.description}</p>
              )}

              {/* META */}
              <div className="project-meta">
                {p.startingDate && (
                  <div>
                    <span className="meta-label">Started</span>
                    <span className="meta-value">
                      {new Date(p.startingDate).toLocaleDateString("en-IE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {days !== null && (
                  <div>
                    <span className="meta-label">Active for</span>
                    <span className="meta-value">
                      {days} day{days !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {p.status === "completed" && (
                  <div>
                    <span className="meta-label">Status</span>
                    <span className="meta-value">Completed</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {isEditing && (
          <div className="modal-overlay">
            <div className="modal-box">
              {/* HEADER */}
              <h3 className="modal-title">Edit Project</h3>

              {/* BODY */}
              <div className="modal-content">
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  type="text"
                  placeholder="Project name"
                  className="modal-input"
                />

                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Project description"
                  className="modal-textarea"
                />

                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="modal-select"
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="modal-actions">
                <button
                  className="dashboard-btn"
                  onClick={async () => {
                    try {
                      const updated = await updateProject(
                        editingItem.id,
                        editForm,
                      );

                      // update local (sem refetch)
                      setProjects((prev) =>
                        prev.map((p) => (p.id === updated.id ? updated : p)),
                      );

                      // close modal
                      setIsEditing(false);
                      setEditingItem(null);

                      // reset form
                      setEditForm({
                        name: "",
                        description: "",
                        status: "planned",
                      });
                    } catch (err) {
                      console.error(err.message);
                    }
                  }}
                >
                  Save
                </button>

                <button
                  className="dashboard-btn secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
