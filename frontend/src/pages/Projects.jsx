import { useState, useEffect } from "react";
import axios from "axios";

export default function Projects() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingDate: "",
    status: "planned",
  });

  const [projects, setProjects] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) => [...prev, res.data]);
      console.log(res.data);
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
      const token = localStorage.getItem("token");

      if (!window.confirm("Delete this project?")) return;

      const res = await axios.delete(`http://localhost:3000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
      console.log(`Deleted: ${res.data}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div>
      <div className="project-header">
        <h1>Projects</h1>
        <button onClick={getProjects}>Get Projects</button>
        <h3>Add Project:</h3>

        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Project description"
          value={formData.description}
          onChange={handleChange}
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          name="startingDate"
          value={formData.startingDate}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Add</button>
      </div>
      <div className="project-cards">
        {projects.length === 0 ? (
          <p>No projects yet...</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="project-card">
              <button onClick={() => deleteProject(p.id)}>x</button>
              <h3>{p.name}</h3>
              <p>Desc: {p.description}</p>
              <span>Status: {p.status}</span>
              <span>Starting Date: {p.startingDate}</span>
              <p>-------</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
