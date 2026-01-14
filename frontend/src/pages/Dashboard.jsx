import { useState } from "react";
import axios from "axios";

import "../styles/Dashboard.css";

export default function Dashboard() {
  const user = localStorage.getItem("user");

  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    duration: "",
    type: "pratical",
    date: "",
  });

  function handleMenuOpen() {
    setMenuOpen((prev) => !prev);

    console.log(menuOpen);
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
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <h1>Welcome to Dashboard </h1>
      <h2>{user}</h2>

      <div className="add-section">
        <button onClick={handleMenuOpen}>Add Section</button>
        {menuOpen && (
          <div>
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
              <option value="pratical">Pratical</option>
            </select>

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setMenuOpen(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
