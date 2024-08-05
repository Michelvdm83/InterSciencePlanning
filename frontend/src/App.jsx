import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";
import Login from "./pages/login/Login";
import EmployeeService from "./services/EmployeeService";

export default function App() {
  const isLoggedIn = EmployeeService.isLoggedIn();

  const employeeFunction = EmployeeService.getEmployeeFunction();

  return (
    <>
      <div className="flex h-screen w-screen flex-col font-Effra_Rg">
        <Navbar />

        <div>
          <Routes>
            <Route path="/ssp-planning" element={<SSPPlanning />} />
            <Route path="/gebruikers" element={<UserManagement />} />
            <Route path="/inloggen" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
