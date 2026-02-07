import "../styles/Achievements.css";
import Kilp from "../assets/KILP.png";

export default function Achievements() {
  return (
    <div className="achievements-page">
      <div className="achievements-card">
        <img
          src={Kilp} // depois você troca
          alt="Mascot"
          className="achievements-mascot"
        />

        <h1 className="achievements-title">Achievements</h1>
        <p className="achievements-subtitle">
          This section is under construction
        </p>

        <span className="achievements-hint">
          New milestones, badges and progress insights coming soon.
        </span>
      </div>
    </div>
  );
}
