import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    console.log(formData);

    if (formData.password !== repeatedPass) {
      return window.alert("Passwords must match!");
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        formData,
      );
      console.log(res.data);
      console.log(res.data.name);

      localStorage.setItem("username", res.data.newUser.name);

      nav("/login");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <h1>Register Page</h1>

      <form onSubmit={handleSubmit} className="register-area">
        <p>Email</p>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="text"
          placeholder="insert email"
        />
        <p>First name</p>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="insert name"
        />
        <p>Password</p>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="insert password"
        />
        <p>Repeat Password</p>
        <input
          type="password"
          value={repeatedPass}
          onChange={(e) => setRepeatedPass(e.target.value)}
          placeholder="repeat password"
        />
        <br />
        <br />

        <button>Register</button>
      </form>
    </div>
  );
}
