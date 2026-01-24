import { useState, useEffect } from "react";
import axios from "axios";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"];

function TopicDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No data yet...</p>;
  }

  return (
    <div className="topic-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="minutes"
            nameKey="topic"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGENDA */}
      <div className="topic-legend">
        {data.map((item, index) => (
          <div key={item.topic} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="legend-label">{item.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  //USE EFFECT

  //dashboard
  const [studyTime, setStudyTime] = useState("");
  const [lastSession, setLastSession] = useState(null);

  const [completeSummary, setCompleteSummary] = useState(null);
  const [weekReport, setWeekReport] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);
  const [totalWeek, setTotalWeek] = useState();
  const [averageWeek, setAverageWeek] = useState();

  const [editingId, setEditingId] = useState(null);

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

  function minutesToHours(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;

    return `${h}h ${m}min`;
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

      if (editingId) {
        await axios.put(
          `http://localhost:3000/study-sections/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEditingId(null);
        setMenuOpen(false);
        await Promise.all([
          getCompleteSummary(),
          getStudyMinutes(),
          getWeekReport(),
          getTopicDistribution(),
        ]);
      } else {
        await axios.post("http://localhost:3000/study-sections", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuOpen(false);
        setFormData({ topic: "", duration: "", type: "practical", date: "" });
        if (showSections) fetchSections();

        await Promise.all([
          getCompleteSummary(),
          getStudyMinutes(),
          getWeekReport(),
          getTopicDistribution(),
        ]);
      }
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

      setSections((prev) => prev.filter((s) => s.id !== id));

      await Promise.all([
        getCompleteSummary(),
        getStudyMinutes(),
        getWeekReport(),
        getTopicDistribution(),
      ]);
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

      setLastSession(res.data.lastSession);
      setCompleteSummary(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getTopicDistribution() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/dashboard/topic-distribution",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTopicDistribution(res.data);
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

  async function getWeekReport() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/dashboard/week-report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = res.data;
      setWeekReport(data);

      const totalWeekMinutes = data.reduce((acc, day) => acc + day.minutes, 0);

      const dailyAverage = Math.round(totalWeekMinutes / 7);

      setTotalWeek(totalWeekMinutes);
      setAverageWeek(dailyAverage);

      console.log(totalWeek, averageWeek);
    } catch (error) {
      console.error(error.message);
    }
  }

  //PIE CHART
  function topicDistributionChart({ data }) {
    if (!data || data.length === 0) {
      return <p>No data yet...</p>;
    }
  }

  //Reload Content
  useEffect(() => {
    getCompleteSummary();
    getStudyMinutes();
    getWeekReport();
    getTopicDistribution();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <button onClick={getTopicDistribution}>TEST LOG</button>
          <div className="header-left">
            <h1 className="dashboard-title">Welcome back, King Artur! 👋</h1>
            <p className="dashboard-subtitle">
              You're 200 XP away from Level 15. Keep it up!
            </p>
          </div>

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
        <div className="activity-wrapper">
          {/* CARD 1 - STUDY ACTIVITY (HEATMAP) */}
          <div className="activity-section">
            <h3 className="activity-title">Study Activity</h3>

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
          </div>

          {/* CARD 2 - STATS */}
          <div className="activity-section">
            <h3 className="activity-title">Overview</h3>

            <div className="activity-right">
              <div className="stat-card">
                <p className="stat-value">
                  {completeSummary ? studyTime : "--"}
                </p>
                <p className="stat-label">Total Study Time</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">
                  {completeSummary?.totalSessions ?? "--"}
                </p>
                <p className="stat-label">Sessions Completed</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">100%</p>
                <p className="stat-label">Daily Goal</p>
              </div>

              <div className="stat-card">
                <p className="stat-value">1</p>
                <p className="stat-label">Opened Projects</p>
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

        <div className="last-section">
          <div className="last-grid">
            {/* WEEKLY CARD */}
            <div className="week-card">
              <h3 className="activity-title">This Week</h3>

              <div className="week-bars">
                {weekReport.map((d, i) => {
                  const max = Math.max(...weekReport.map((w) => w.minutes));
                  const height = max ? (d.minutes / max) * 100 : 0;
                  const isToday =
                    d.day ===
                    new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                    });

                  return (
                    <div key={i} className="week-bar-wrapper">
                      <div
                        className={`week-bar ${isToday ? "active" : ""}`}
                        style={{ height: `${height}%` }}
                      />
                      <span>{d.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="week-divider" />

              <div className="week-stats">
                <div>
                  <strong>{totalWeek} min</strong>
                  <p>Total this week</p>
                </div>
                <div>
                  <strong>{averageWeek} min</strong>
                  <p>Daily average</p>
                </div>
              </div>
            </div>

            {/* LAST SESSION */}
            <div className="middle-stack">
              {/* LAST SESSION */}
              {lastSession ? (
                <div className="last-card half">
                  <h3 className="activity-title">Last Session</h3>

                  <div className="last-main">
                    <h4 className="last-topic">{lastSession.topic}</h4>
                    <span className="last-type">{lastSession.type}</span>
                  </div>

                  <div className="last-meta">
                    <div>
                      <span className="meta-label">Duration: </span>
                      <span className="meta-value">
                        {lastSession.duration} min
                      </span>
                    </div>

                    <div>
                      <span className="meta-label">Date: </span>
                      <span className="meta-value">
                        {new Date(lastSession.date).toLocaleDateString(
                          "en-IE",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="last-card half">No sessions yet…</div>
              )}

              {/* DAILY AVERAGE */}
              <div className="stat-card half">
                <p className="stat-value">
                  {averageWeek ? minutesToHours(averageWeek) : "--"}
                </p>
                <p
                  style={{ color: "#10b77f", fontWeight: "bold" }}
                  className="stat-label"
                >
                  Daily Average
                </p>
              </div>
            </div>

            {/* TOPIC DISTRIBUTION */}
            <div className="stat-card">
              <p className="stat-label">Topic Distribution</p>
              <TopicDistributionChart data={topicDistribution} />
            </div>
          </div>
        </div>

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
                  <button
                    onClick={() => {
                      setEditingId(s.id);
                      setFormData({
                        topic: s.topic,
                        duration: s.duration,
                        type: s.type,
                        date: s.date.split("T")[0],
                      });
                      setMenuOpen(true);
                      setShowSections(false);
                    }}
                    className="edit-btn"
                  >
                    edit
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
      </main>
    </div>
  );
}
