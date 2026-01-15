import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/Dashboard.css";

export default function Dashboard() {
  const user = localStorage.getItem("user");

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "practical",
    date: "",
  });

  async function fetchData() {}

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:3000/study-sections",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      setMenuOpen(false);
      setFormData({
        topic: "",
        duration: "",
        type: "practical",
        date: "",
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleShowSections() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSections(res.data); // salva as sessões
      setShowSections(true); // abre o menu
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleDeleteSection(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/study-sections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <h2>{user}</h2>

      <button onClick={handleMenuOpen}>Add Section</button>
      <br />
      <br />
      <button onClick={handleShowSections}>Show Study Sections</button>

      {menuOpen && (
        <div className="overlay">
          <div className="menu-box">
            <h3>Add Study Section</h3>

            <input
              name="topic"
              placeholder="Topic"
              value={formData.topic}
              onChange={handleChange}
            />

            <input
              name="duration"
              type="number"
              placeholder="Minutes"
              value={formData.duration}
              onChange={handleChange}
            />

            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="theory">Theory</option>
              <option value="logical">Logical</option>
              <option value="practical">Practical</option>
            </select>

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />

            <br />
            <br />

            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setMenuOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {showSections && (
        <div className="overlay">
          <div className="menu-box">
            <h3>Study Sections List:</h3>

            {sections.length === 0 && <p>No study sessions yet.</p>}

            {sections.map((s) => (
              <div key={s.id} className="section-item">
                <p>
                  <strong>{s.topic}</strong>
                </p>
                <p>Duration: {s.duration} min</p>
                <p>Type: {s.type}</p>
                <p>Date: {new Date(s.date).toLocaleDateString()}</p>
                <button onClick={() => handleDeleteSection(s.id)}>x</button>
                <hr />
              </div>
            ))}

            <button onClick={() => setShowSections(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
