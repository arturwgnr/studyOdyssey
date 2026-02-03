import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

import "../styles/Dashboard.css";

const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"];

function TopicDistributionChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <p>No data yet...</p>;
  }

  return (
    <div className="topic-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={safeData}
            dataKey="minutes"
            nameKey="topic"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {safeData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="topic-legend">
        {safeData.map((item, index) => (
          <div key={item.topic ?? index} className="legend-item">
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

function getProductivityStatus(score) {
  if (score >= 85) return { label: "Excellent", className: "excellent" };
  if (score >= 70) return { label: "Good", className: "good" };
  if (score >= 50) return { label: "Ok", className: "ok" };
  return { label: "Low", className: "low" };
}

function FocusTypeCard({ data }) {
  if (!data || data.every((d) => d.minutes === 0)) {
    return <p className="empty-message">No focus data yet.</p>;
  }

  return (
    <div className="focus-card focus-split">
      {/* LEFT – FOCUS TYPE */}
      <div className="focus-left">
        <p className="stat-label">FOCUS TYPE</p>

        <div className="focus-vertical">
          {data.map((item) => (
            <div key={item.type} className="focus-col">
              <div className="focus-bar-vertical">
                <div
                  className={`focus-fill-vertical ${item.type}`}
                  style={{ height: `${item.percent}%` }}
                />
              </div>

              <span className="focus-label">{item.type}</span>
              <span className="focus-value">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT – PRODUCTIVITY */}
      <div className="focus-right">
        <p className="stat-label">PRODUCTIVITY</p>

        <div className="productivity-score">
          <span className="score-value">78</span>
          <span className="score-max">/ 100</span>
        </div>

        {(() => {
          const score = 78; // depois você calcula
          const status = getProductivityStatus(score);

          return (
            <p className={`score-status ${status.className}`}>{status.label}</p>
          );
        })()}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const nav = useNavigate();

  const [studyTime, setStudyTime] = useState("--");
  const [lastSession, setLastSession] = useState(null);
  const [completeSummary, setCompleteSummary] = useState(null);

  const [projects, setProjects] = useState([]);

  const [weekReport, setWeekReport] = useState([]);
  const [topicDistribution, setTopicDistribution] = useState([]);

  const [totalWeek, setTotalWeek] = useState(0);
  const [averageWeek, setAverageWeek] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [sections, setSections] = useState([]);

  const [weekTotal, setWeekTotal] = useState(null);
  const [monthTotal, setMonthTotal] = useState(null);

  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "practical",
    date: "",
  });

  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => localStorage.getItem("username") || "User", []);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-IE", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  function authHeaders() {
    const t = localStorage.getItem("token");
    return { Authorization: `Bearer ${t}` };
  }

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function minutesToHours(minutes) {
    const safe = Number(minutes) || 0;
    const h = Math.floor(safe / 60);
    const m = safe % 60;

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }

  async function fetchSections() {
    try {
      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: authHeaders(),
      });
      setSections(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  async function getCompleteSummary() {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/complete-summary",
        { headers: authHeaders() },
      );

      setLastSession(res.data?.lastSession ?? null);
      setCompleteSummary(res.data ?? null);
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  async function getTopicDistribution() {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/topic-distribution",
        { headers: authHeaders() },
      );

      setTopicDistribution(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  async function getStudyMinutes() {
    try {
      const res = await axios.get("http://localhost:3000/dashboard/minutes", {
        headers: authHeaders(),
      });

      const minutes = Number(res.data) || 0;
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;

      setStudyTime(`${h}h ${m}min`);
    } catch (error) {
      console.error(error?.message || error);
      setStudyTime("--");
    }
  }

  async function getWeekReport() {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/week-report",
        {
          headers: authHeaders(),
        },
      );

      const data = Array.isArray(res.data) ? res.data : [];
      setWeekReport(data);

      const total = data.reduce((acc, d) => acc + (Number(d.minutes) || 0), 0);

      setTotalWeek(total);
      setAverageWeek(Math.round(total / 7));
    } catch (error) {
      console.error(error?.message || error);
      setWeekReport([]);
      setTotalWeek(0);
      setAverageWeek(0);
    }
  }

  async function getProjects() {
    try {
      const res = await axios.get("http://localhost:3000/projects", {
        headers: authHeaders(),
      });

      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error?.message || error);
      setProjects([]);
    }
  }

  async function getWeekSummary() {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/week-summary",
        { headers: authHeaders() },
      );
      setWeekTotal(Number(res.data?.minutes) || 0);
    } catch (error) {
      console.error(error?.message || error);
      setWeekTotal(0);
    }
  }

  async function getMonthSummary() {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/month-summary",
        { headers: authHeaders() },
      );
      setMonthTotal(Number(res.data?.minutes) || 0);
    } catch (error) {
      console.error(error?.message || error);
      setMonthTotal(0);
    }
  }

  async function refreshDashboard() {
    await Promise.all([
      getCompleteSummary(),
      getStudyMinutes(),
      getWeekReport(),
      getTopicDistribution(),
      getWeekSummary(),
      getMonthSummary(),
      getProjects(),
      fetchSections(),
    ]);
  }

  async function handleSubmitSession() {
    try {
      const payload = {
        topic: String(formData.topic || "").trim(),
        duration: Number(formData.duration),
        type: formData.type,
        date: formData.date || new Date().toISOString().split("T")[0],
      };

      if (!payload.topic) return window.alert("Topic is required.");
      if (!Number.isFinite(payload.duration) || payload.duration <= 0) {
        return window.alert("Did you study at all?");
      }

      if (editingId) {
        await axios.put(
          `http://localhost:3000/study-sections/${editingId}`,
          payload,
          { headers: authHeaders() },
        );
        setEditingId(null);
      } else {
        await axios.post("http://localhost:3000/study-sections", payload, {
          headers: authHeaders(),
        });

        setFormData({ topic: "", duration: "", type: "practical", date: "" });
      }

      setMenuOpen(false);

      if (showSections) {
        await fetchSections();
      }

      await refreshDashboard();
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  async function handleShowSections() {
    try {
      await fetchSections();
      setShowSections(true);
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  async function handleDeleteSection(id) {
    try {
      await axios.delete(`http://localhost:3000/study-sections/${id}`, {
        headers: authHeaders(),
      });

      setSections((prev) => prev.filter((s) => s.id !== id));
      await refreshDashboard();
    } catch (error) {
      console.error(error?.message || error);
    }
  }

  function getFocusTypeStats(sections = []) {
    const base = { theory: 0, practical: 0, logical: 0 };

    sections.forEach((s) => {
      if (base[s.type] !== undefined) {
        base[s.type] += Number(s.duration) || 0;
      }
    });

    const total = Object.values(base).reduce((a, b) => a + b, 0);

    return Object.entries(base).map(([type, minutes]) => ({
      type,
      minutes,
      percent: total ? Math.round((minutes / total) * 100) : 0,
    }));
  }

  const focusTypeStats = useMemo(() => {
    return getFocusTypeStats(sections);
  }, [sections]);

  useEffect(() => {
    refreshDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Welcome back, {user}! 👋</h1>
          <p className="dashboard-subtitle">
            You're 200 XP away from Level 15. Keep it up!
          </p>
        </div>

        <div className="right-area">
          <button className="dashboard-btn" onClick={handleMenuOpen}>
            + Add Section
          </button>
          <div className="header-date">📅 {todayLabel}</div>
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

      <div className="activity-wrapper">
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

        <div className="activity-section">
          <h3 className="activity-title">Overview</h3>

          <div className="activity-right">
            <div className="stat-card">
              <p className="stat-value">{completeSummary ? studyTime : "--"}</p>
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
              <p className="stat-value">{projects.length}</p>
              <p className="stat-label">Opened Projects</p>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">
              {editingId ? "Edit Study Section" : "Add Study Section"}
            </h3>

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
                onClick={() => {
                  setMenuOpen(false);
                  setEditingId(null);
                  setFormData({
                    topic: "",
                    duration: "",
                    type: "practical",
                    date: "",
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="last-section">
        <div className="last-grid">
          <div className="week-card">
            <h3 className="activity-title">This Week</h3>

            <div className="week-bars">
              {weekReport.map((d, i) => {
                const max = Math.max(
                  ...weekReport.map((w) => Number(w.minutes) || 0),
                );
                const height = max ? ((Number(d.minutes) || 0) / max) * 100 : 0;

                const isToday =
                  d.day ===
                  new Date().toLocaleDateString("en-US", { weekday: "short" });

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
                <strong>{totalWeek ? minutesToHours(totalWeek) : "--"}</strong>
                <p>Total this week</p>
              </div>
              <div>
                <strong>
                  {averageWeek ? minutesToHours(averageWeek) : "--"}
                </strong>
                <p>Daily average</p>
              </div>
            </div>
          </div>

          <div className="middle-stack">
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
                      {new Date(lastSession.date).toLocaleDateString("en-IE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="last-card half">No sessions yet…</div>
            )}

            <div className="stat-card half averages-card">
              <div className="average-block">
                <p className="stat-value">
                  {averageWeek ? minutesToHours(averageWeek) : "--"}
                </p>
                <p className="stat-label highlight">Daily Average</p>
              </div>

              <div className="average-block">
                <p className="stat-value">
                  {weekTotal !== null ? minutesToHours(weekTotal) : "--"}
                </p>
                <p className="stat-label highlight">Week Total</p>
              </div>

              <div className="average-block">
                <p className="stat-value">
                  {monthTotal !== null ? minutesToHours(monthTotal) : "--"}
                </p>
                <p className="stat-label highlight">Month Total</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">OVERALL TOPIC DISTRIBUTION</p>
            <TopicDistributionChart data={topicDistribution} />
          </div>
          <div className="stat-card">
            <FocusTypeCard data={focusTypeStats} />
          </div>
        </div>
      </div>

      {showSections && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Study Sessions</h3>

            <button
              className="dashboard-btn secondary"
              onClick={() => setShowSections(false)}
            >
              Close
            </button>

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
                      duration: String(s.duration ?? ""),
                      type: s.type,
                      date: String(s.date || "").split("T")[0],
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

            <button onClick={() => nav("/app/history")}>
              View Full History
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
