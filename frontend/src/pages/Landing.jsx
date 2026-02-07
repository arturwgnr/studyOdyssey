import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import phone from "../assets/phone2.jpeg";
import Kilp from "../assets/KILP.png";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-mark">ᨒ</span>
          <span className="logo-text">StudyOdyssey</span>
        </div>

        <nav className="landing-nav">
          <button className="nav-link" onClick={() => nav("/login")}>
            Login
          </button>
          <button className="nav-cta" onClick={() => nav("/register")}>
            Get Started
          </button>
        </nav>
      </header>

      {/* HERO */}
      <main className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">NOW IN BETA</span>

          <h1 className="hero-title">
            Master your <span>Learning</span>
          </h1>

          <p className="hero-subtitle">
            Track your study sessions, build consistency and turn discipline
            into progress. One system. One direction.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => nav("/register")}>
              Start for free
            </button>
            <button className="secondary-btn">Watch demo</button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              🔥 <strong>Streak-based progress</strong>
            </div>
            <div className="stat">
              🧠 <strong>Focused sessions</strong>
            </div>
            <div className="stat">
              🏆 <strong>Achievements & milestones</strong>
            </div>
          </div>
        </div>

        {/* VISUAL */}
        <div className="hero-visual">
          <img src={Kilp} alt="Mascot" className="hero-mascot" />

          <div className="mockup">
            <img
              src={phone}
              alt="Achievements preview"
              className="mockup-image"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
