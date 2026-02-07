import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import "../styles/Layout.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
