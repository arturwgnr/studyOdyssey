import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const user = localStorage.getItem("user");

  //dashboard
  const [studyTime, setStudyTime] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "practical",
    date: "",
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

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmitSession() {
    const token = localStorage.getItem("token");
    try {
      if (formData.duration <= 0) {
        return window.alert("Did you study at all?");
      }

      await axios.post("http://localhost:3000/study-sections", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuOpen(false);
      setFormData({ topic: "", duration: "", type: "practical", date: "" });
      if (showSections) fetchSections();

      getStudyMinutes();
      console.log(studyTime);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleShowSections() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(res.data);
      setShowSections(true);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleDeleteSection(id) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/study-sections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSections();
    } catch (error) {
      console.error(error.message);
    }
  }

  //---------------------------------------------------------

  //Summary Dashboard

  async function showSummary() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getStudyMinutes() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/dashboard/minutes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const minutes = res.data;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      const formatted = `${hours}h ${mins}min`;

      setStudyTime(formatted);

      console.log(studyTime);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user}</h1>
          <p>{studyTime}</p>
          <button className="dashboard-btn" onClick={handleMenuOpen}>
            + Add Section
          </button>
          <button
            className="dashboard-btn secondary"
            onClick={handleShowSections}
          >
            Show Sessions
          </button>
        </header>

        {menuOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Add Study Section</h3>

              <input
                name="topic"
                placeholder="Topic"
                value={formData.topic}
                onChange={handleChange}
                className="modal-input"
              />

              <input
                name="duration"
                type="number"
                placeholder="Minutes"
                value={formData.duration}
                onChange={handleChange}
                className="modal-input"
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="modal-select"
              >
                <option value="theory">Theory</option>
                <option value="logical">Logical</option>
                <option value="practical">Practical</option>
              </select>

              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="modal-input"
              />

              <div className="modal-actions">
                <button className="dashboard-btn" onClick={handleSubmitSession}>
                  Save
                </button>
                <button
                  className="dashboard-btn secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showSections && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Study Sessions</h3>

              {sections.length === 0 && (
                <p className="empty-message">No study sessions yet.</p>
              )}

              {sections.map((s) => (
                <div key={s.id} className="session-card">
                  <p>
                    <strong>{s.topic}</strong>
                  </p>
                  <p>Duration: {s.duration} min</p>
                  <p>Type: {s.type}</p>
                  <p>Date: {new Date(s.date).toLocaleDateString()}</p>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSection(s.id)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                className="dashboard-btn secondary"
                onClick={() => setShowSections(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <button onClick={getStudyMinutes}>show summary</button>
      </main>
    </div>
  );
}
