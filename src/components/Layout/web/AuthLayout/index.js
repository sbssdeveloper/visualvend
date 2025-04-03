import { Outlet } from "react-router-dom";
import Header from "../../../../Widgets/web/Header";
import Sidebar from "../../../../Widgets/web/Sidebar";

export default function AuthLayout() {
  return (
    <main className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
