import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
        formData
      );

      const token = res.data.token;
      const user = formData.email; // <-- aqui sim existe

      localStorage.setItem("user", user);
      localStorage.setItem("token", token);

      nav("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <h1>Login Page</h1>

      <form className="login-area" onSubmit={handleSubmit}>
        <p>Email:</p>
        <input
          type="text"
          name="email"
          placeholder="insert email"
          value={formData.email}
          onChange={handleChange}
        />
        <p>Password:</p>
        <input
          type="password"
          name="password"
          placeholder="insert password"
          value={formData.password}
          onChange={handleChange}
        />{" "}
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
