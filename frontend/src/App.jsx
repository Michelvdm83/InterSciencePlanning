import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";

export default function App() {
  return (
    <>
      <div id="page" className="font-Effra_Rg flex h-screen w-screen flex-col">
        <Navbar />

        <div>
          <Routes>
            <Route path="/SSPPlanning" element={<SSPPlanning />} />
            <Route path="/UserManagement" element={<UserManagement />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
