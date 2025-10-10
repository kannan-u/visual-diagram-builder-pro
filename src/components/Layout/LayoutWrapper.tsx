import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../UI/ThemeToggle";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div>
          <Link to="/dashboardPage" style={{ fontWeight: "bold", fontSize: "18px" }}>
            Diagram Builder
          </Link>
        </div>
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/profile">Profile</Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", padding: "20px" }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          padding: "10px 20px",
          borderTop: "1px solid #ccc",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Diagram Builder
      </footer>
    </div>
  );
};

export default LayoutWrapper;
