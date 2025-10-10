import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
//import Dashboard from './components/pages/Dashboard';
import DashboardPage from "./components/pages/DashboardPage";
import { ProtectedRoute } from './routes/ProtectedRoute';
import ThemeToggle from './components/UI/ThemeToggle';

// import Login from "./pages/Login";
import DiagramEditorPage from "./components/pages/DiagramEditorPage";

export default function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <header style={{display:'flex',justifyContent:'space-between',padding:12}}>
          <div><Link to="/">Diagram Editor</Link></div>
          <nav style={{display:'flex',gap:12,alignItems:'center'}}>
            <Link to="/profile">Profile</Link>
            <ThemeToggle />
          </nav>
        </header>
       {/*  //testing area */}
{/*         <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/Dashboard" element={<Dashboard/>} />
          </Routes>
        </main> */}
         <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/diagram/:id" element={<DiagramEditorPage />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
