import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [repeatedPass, setRepeatedPass] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== repeatedPass) {
      return window.alert("Passwords must match!");
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        formData,
      );

      localStorage.setItem("username", res.data.newUser.name);
      nav("/login");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="top-bar"></div>
        <div className="header">
          <h1>Create your account</h1>
          <p className="auth-subtitle">
            Start building consistency and tracking your progress
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Your name"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="input-group">
            <label>Repeat password</label>
            <input
              type="password"
              value={repeatedPass}
              onChange={(e) => setRepeatedPass(e.target.value)}
              placeholder="Repeat password"
            />
          </div>

          <button className="auth-btn">Create account</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => nav("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}
