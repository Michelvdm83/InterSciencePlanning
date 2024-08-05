import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";
import SystemOverview from "./pages/systemOverview/SystemOverview";

export default function App() {
  return (
    <>
      <div className="flex h-screen w-screen flex-col font-Effra_Rg">
        <Navbar />

        <div>
          <Routes>
            <Route path="/ssp-planning" element={<SSPPlanning />} />
            <Route path="/gebruikers" element={<UserManagement />} />
            <Route path="/systeem/:systemId" element={<SystemOverview />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
