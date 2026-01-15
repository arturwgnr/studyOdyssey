import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">StudyFlow</h1>
        <p className="sidebar-subtitle">Track your learning</p>
      </div>

      <div className="sidebar-divider"></div>

      <button className="sidebar-add-btn">+ Add Session</button>

      <nav className="sidebar-nav">
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item">History</button>
        <button className="nav-item">Achievements</button>
        <button className="nav-item">Profile</button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">Learner</p>
          <p className="user-status">Pro Member</p>
        </div>
      </div>
    </aside>
  );
}
