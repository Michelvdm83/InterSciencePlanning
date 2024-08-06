import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";
import SSPSCheduling from "./components/sspScheduling/SSPScheduling";
import Login from "./pages/login/Login";
import EmployeeService from "./services/EmployeeService";

export default function App() {
  const isLoggedIn = EmployeeService.isLoggedIn();

  const employeeFunction = EmployeeService.getEmployeeFunction();

  return (
    <>
      <div className="font-Effra_Rg flex h-screen w-screen flex-col">
        <Navbar />

        <div className="h-full">
          <Routes>
            <Route path="/ssp-planning" element={<SSPPlanning />} />
            <Route path="/gebruikers" element={<UserManagement />} />
            <Route path="/ssp-inplannen" element={<SSPSCheduling />} />
            <Route path="/inloggen" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
