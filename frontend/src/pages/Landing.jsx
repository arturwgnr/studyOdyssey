import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div>
      <h1>Welcome to Landing Page</h1>
      <button onClick={() => nav("/login")}>Login</button>
      <br />
      <button onClick={() => nav("/register")}>Register</button>
      <br />
    </div>
  );
}
