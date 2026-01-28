import { useState } from "react";

export default function Projects() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planned",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    console.log(formData);
  }

  return (
    <div>
      <div className="project-header">
        <h1>Projects</h1>
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

        <button onClick={handleSubmit}>Add</button>
      </div>
      <div className="project-cards">
        <h1>Project Name: {formData.name}</h1>
        <p>Description: {formData.description}</p>
        <p>Status: {formData.status}</p>
      </div>
    </div>
  );
}
