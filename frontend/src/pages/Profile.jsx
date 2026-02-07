import "../styles/Profile.css";

export default function Profile() {
  // depois você vai substituir isso por dados reais do backend
  const user = {
    name: "Artur",
    email: "artur@email.com",
    level: 14,
    xp: 2300,
    streak: 12,
    memberSince: "Feb 2024",
  };

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">AW</div>

        <div className="profile-main-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <span className="stat-label">Level</span>
          <span className="stat-value">{user.level}</span>
        </div>

        <div className="profile-stat-card">
          <span className="stat-label">XP</span>
          <span className="stat-value">{user.xp}</span>
        </div>

        <div className="profile-stat-card">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{user.streak} days</span>
        </div>

        <div className="profile-stat-card">
          <span className="stat-label">Member since</span>
          <span className="stat-value">{user.memberSince}</span>
        </div>
      </div>

      {/* ACCOUNT */}
      <div className="profile-section">
        <h2 className="section-title">Account</h2>

        <div className="profile-field">
          <label>Name</label>
          <input type="text" value={user.name} disabled />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>

        <button className="profile-btn disabled">
          Edit profile (coming soon)
        </button>
      </div>
    </div>
  );
}
