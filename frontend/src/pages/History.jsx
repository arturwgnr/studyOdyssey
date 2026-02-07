import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/History.css";

export default function History() {
  const [studySessions, setStudySessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    topic: "",
    duration: "",
    date: "",
    type: "practical",
  });

  async function fetchSections() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getStudySessions() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudySessions(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteSession(id) {
    try {
      const token = localStorage.getItem("token");
      if (!window.confirm("Are you sure you want to delete this session?"))
        return;

      await axios.delete(`http://localhost:3000/study-sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudySessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateSession(id, data) {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:3000/study-sections/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // update local state (sem refetch)
      setStudySessions((prev) => prev.map((s) => (s.id === id ? res.data : s)));

      setIsEditing(false);
      setSessionId(null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getStudySessions();
    fetchSections();
  }, []);

  return (
    <main className="history-main">
      {/* HEADER */}
      <header className="history-header">
        <div>
          <h1 className="history-title">Session History</h1>
          <p className="history-subtitle">
            Manage and review your study sessions
          </p>
        </div>
      </header>

      {/* LIST */}
      <section className="history-list">
        {studySessions.length === 0 && (
          <p className="history-empty">No study sessions yet.</p>
        )}

        {studySessions.map((s) => (
          <article key={s.id} className="history-card">
            {/* ACTIONS */}
            <div className="history-actions">
              <span className={`history-type ${s.type}`}>{s.type}</span>
              <button
                className="history-btn edit"
                onClick={() => {
                  setSessionId(s.id);
                  setIsEditing(true);
                  setEditForm({
                    topic: s.topic,
                    duration: s.duration,
                    date: s.date.split("T")[0],
                    type: s.type,
                  });
                }}
              >
                Edit
              </button>

              <button
                className="history-btn delete"
                onClick={() => deleteSession(s.id)}
              >
                ×
              </button>
            </div>

            {/* MAIN */}
            <div className="history-main-content">
              <h3 className="history-topic">{s.topic}</h3>
            </div>

            {/* META */}
            <div className="history-meta">
              <div>
                <span className="meta-label">Duration</span>
                <span className="meta-value">{s.duration} min</span>
              </div>

              <div>
                <span className="meta-label">Date</span>
                <span className="meta-value">
                  {new Date(s.date).toLocaleDateString("en-IE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </article>
        ))}

        {/* MODAL */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Edit Study Session</h3>

              <div className="modal-content">
                <input
                  className="modal-input"
                  value={editForm.topic}
                  onChange={(e) =>
                    setEditForm({ ...editForm, topic: e.target.value })
                  }
                  placeholder="Topic"
                />

                <input
                  className="modal-input"
                  type="number"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                  placeholder="Duration (min)"
                />

                <input
                  className="modal-input"
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                />

                <select
                  className="modal-select"
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                >
                  <option value="theory">Theory</option>
                  <option value="logical">Logical</option>
                  <option value="practical">Practical</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="dashboard-btn"
                  onClick={() => updateSession(sessionId, editForm)}
                >
                  Save
                </button>

                <button
                  className="dashboard-btn secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setSessionId(null);
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
