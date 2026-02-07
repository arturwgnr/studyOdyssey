import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Auth.css";

export default function Login() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        formData,
      );

      const token = res.data.token;
      const user = formData.email;

      localStorage.setItem("user", user);
      localStorage.setItem("token", token);

      nav("/app/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="header">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to continue your progress</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-btn">
            Log in
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => nav("/register")}>Create one</span>
        </p>
      </div>
    </div>
  );
}
