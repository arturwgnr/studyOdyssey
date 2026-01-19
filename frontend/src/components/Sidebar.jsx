import "../styles/Sidebar.css";
import { useState } from "react";
import axios from "axios";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "pratical",
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

      const res = await axios.post(
        "http://localhost:3000/study-sections",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      setMenuOpen(false);
      setFormData({ topic: "", duration: "", type: "practical", date: "" });
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Study Odyssey</h1>
        <p className="sidebar-subtitle">Track your learning</p>
      </div>

      <div className="sidebar-divider"></div>

      <button onClick={handleMenuOpen} className="sidebar-add-btn">
        + Add Session
      </button>

      <nav className="sidebar-nav">
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item">History</button>
        <button className="nav-item">Achievements</button>
        <button className="nav-item">Profile</button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">Learner</p>
          <p className="user-status">Pro Member</p>
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
