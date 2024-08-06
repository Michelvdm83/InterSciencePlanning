import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";
import Login from "./pages/login/Login";
import EmployeeService from "./services/EmployeeService";
import FtPlanning from "./pages/ftPlanning/FtPlanning";

export default function App() {
  const navigate = useNavigate();
  const isLoggedIn = EmployeeService.isLoggedIn();

  const employeeFunction = EmployeeService.getEmployeeFunction();

  function getHomeRoute() {
    switch (employeeFunction) {
      case "TEAM_LEADER":
      case "SSP":
        return <Route path="/" element={<SSPPlanning />} />;
      case "FT":
        return <Route path="/" element={<FtPlanning />} />;
      default:
        return <Route path="/" element={<Login />} />;
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col font-Effra_Rg">
      <Navbar />

      <div>
        <Routes>
          <Route path="/ssp-planning" element={<SSPPlanning />} />
          <Route path="/gebruikers" element={<UserManagement />} />
          <Route path="/inloggen" element={<Login />} />
          {getHomeRoute()}
        </Routes>
      </div>
    </div>
  );
}
