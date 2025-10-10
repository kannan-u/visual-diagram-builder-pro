import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";



export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold">Diagram Dashboard</h1>
      {user && (
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      )}
    </header>
  );
}