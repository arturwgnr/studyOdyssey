import { useState, useEffect } from "react";
import axios from "axios";

import InboxView from "../components/InboxView";
import PlannerView from "../components/PlannerView";

import "../styles/Todo.css";

export default function Todo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("inbox"); // inbox | planner

  async function fetchTasks() {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:3000/todo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(res.data);
  }

  async function addTask(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:3000/todo", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFormData({ title: "", description: "", priority: "MEDIUM" });
    fetchTasks();
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await axios.delete(`http://localhost:3000/todo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="todo-page">
      {/* HEADER */}
      <header className="todo-header">
        <div className="todo-header-content">
          <h1 className="todo-title">Personal Planner</h1>
          <p className="todo-subtitle">Always stay one step ahead</p>
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="todo-nav">
        <button
          className={viewMode === "inbox" ? "nav-btn active" : "nav-btn"}
          onClick={() => setViewMode("inbox")}
        >
          Inbox
        </button>

        <button
          className={viewMode === "planner" ? "nav-btn active" : "nav-btn"}
          onClick={() => setViewMode("planner")}
        >
          Planner
        </button>
      </div>

      {/* LAYOUT */}
      <section className="todo-layout">
        {viewMode === "inbox" && (
          <InboxView
            tasks={tasks.filter((t) => !t.plannedDate)}
            formData={formData}
            setFormData={setFormData}
            addTask={addTask}
            handleDelete={handleDelete}
          />
        )}

        {viewMode === "planner" && (
          <PlannerView tasks={tasks} setTasks={setTasks} />
        )}
      </section>
    </main>
  );
}
