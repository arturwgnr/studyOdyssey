import { useState, useEffect } from "react";
import axios from "axios";

export default function History() {
  const [studySessions, setStudySessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  function refreshData() {
    getStudySessions();
  }

  async function getStudySessions() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/study-sections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudySessions(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteSession(id) {
    try {
      const token = localStorage.getItem("token");

      if (!window.confirm("Are you sure you want to delete this session?"))
        return;

      const res = await axios.delete(
        `http://localhost:3000/study-sections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
      getStudySessions();
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div>
      <h1>Welcome to History</h1>

      <div className="study-sessions">
        {studySessions.map((s) => (
          <div key={s.id} className="study-card">
            <button onClick={() => deleteSession(s.id)}>x</button>
            <h3>{s.topic}</h3>
            <p>Duration: {s.duration} min</p>
            <p>Type: {s.type}</p>
            <p>Date: {s.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
