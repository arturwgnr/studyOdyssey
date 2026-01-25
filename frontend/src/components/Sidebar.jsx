import "../styles/Sidebar.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "practical",
    date: "",
  });

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:3000/study-sections", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMenuOpen(false);
      setFormData({ topic: "", duration: "", type: "practical", date: "" });
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-div">
          <p className="logo">ᨒ</p>
          <h1 className="sidebar-title">Study Odyssey</h1>
        </div>
        <p className="sidebar-subtitle">Track your learning</p>
      </div>

      <div className="sidebar-divider" />

      <button onClick={handleMenuOpen} className="sidebar-add-btn">
        + Add Session
      </button>

      <nav className="sidebar-nav">
        <NavLink to="/app/dashboard" className="nav-item">
          Dashboard
        </NavLink>

        <NavLink to="/app/history" className="nav-item">
          History
        </NavLink>

        <NavLink to="/app/todo" className="nav-item">
          To-do
        </NavLink>

        <NavLink to="/app/achievements" className="nav-item">
          Achievements
        </NavLink>

        <NavLink to="/app/profile" className="nav-item">
          Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-picture">
            <p>AW</p>
          </div>
          <div className="user-data">
            <p className="user-status">Learner</p>
            <p className="user-sub">Pro Member</p>
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
                <button className="dashboard-btn" onClick={handleSubmit}>
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
      </div>
    </aside>
  );
}
