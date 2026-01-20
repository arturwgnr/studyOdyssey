import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const user = localStorage.getItem("user");
  console.log(user);

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

  async function getCompleteSummary() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/dashboard/complete-summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

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

  async function getRecentSessions() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/dashboard/recent-sessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getLastSession() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/dashboard/last-session",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  const TOTAL_DAYS = 112; // mantém exatamente como está no grid

  const today = new Date();

  const heatmapDates = Array.from({ length: TOTAL_DAYS }).map((_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (TOTAL_DAYS - 1 - index));
    return d;
  });

  const monthLabels = [];
  let lastMonth = null;

  heatmapDates.forEach((date, index) => {
    const month = date.toLocaleString("en-US", { month: "short" });

    if (month !== lastMonth && index % 7 === 0) {
      monthLabels.push({ month, index });
      lastMonth = month;
    }
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Welcome back, Artur! 👋</h1>
            <p className="dashboard-subtitle">
              You're 200 XP away from Level 15. Keep it up!
            </p>
          </div>

          <p>{studyTime}</p>

          <div className="right-area">
            <button className="dashboard-btn" onClick={handleMenuOpen}>
              + Add Section
            </button>
            <div className="header-date">📅 October 24, 2023</div>
          </div>
        </header>

        <div className="dashboard-cards">
          <div className="streak-card">
            <span className="streak-label">🔥 CURRENT STREAK</span>
            <h2 className="streak-value">15 Days</h2>
            <div className="div-cards">
              <p className="streak-sub">Personal best: 24 days</p>
              <span onClick={handleShowSections} className="streak-link">
                View History
              </span>
            </div>
          </div>

          <div className="level-card">
            <div className="level-top">
              <div className="level-badge">14</div>

              <div className="level-info">
                <p className="level-title">Level 14</p>
                <p className="level-sub">Adept Scholar</p>
              </div>

              <div className="level-xp">
                <p className="xp-value">2,450</p>
                <span>/ 3,000 XP</span>
                <p className="xp-percent">81.6% Complete</p>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" />
            </div>

            <p className="level-quote">
              "The more that you read, the more things you will know."
            </p>
          </div>
        </div>

        {/* STUDY ACTIVITY */}
        <div className="activity-section">
          <h3 className="activity-title">Study Activity</h3>

          <div className="activity-layout">
            {/* LEFT - HEATMAP */}
            <div className="activity-left">
              <div className="month-labels">
                <span>Jan</span>
                <span>Mar</span>
                <span>Mai</span>
                <span>Jul</span>
                <span>Set</span>
                <span>Nov</span>
                <span>Dez</span>
              </div>
              <div className="activity-heatmap">
                <div className="weekday-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
                <div className="activity-grid">
                  {Array.from({ length: 84 }).map((_, index) => {
                    const intensity = index % 5;
                    return (
                      <div
                        key={index}
                        className={`activity-cell level-${intensity}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="activity-legend">
                <span>Less</span>
                <div className="legend-scale">
                  <div className="activity-cell level-0" />
                  <div className="activity-cell level-1" />
                  <div className="activity-cell level-2" />
                  <div className="activity-cell level-3" />
                  <div className="activity-cell level-4" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* RIGHT - STATS */}
            <div className="activity-right">
              <div className="stat-card">
                <p className="stat-value">33h</p>
                <p className="stat-label">Total Study Time</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">57</p>
                <p className="stat-label">Sessions Completed</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">4,130</p>
                <p className="stat-label">Total XP</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">100%</p>
                <p className="stat-label">Daily Goal</p>
              </div>
            </div>
          </div>
        </div>

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
        <button onClick={handleShowSections}>show summary</button>
      </main>
    </div>
  );
}
