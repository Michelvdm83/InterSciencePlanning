import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./pages/sspPlanning/SSPPlanning.jsx";
import EmployeeManagement from "./pages/employeeManagement/EmployeeManagement.jsx";
import SSPSCheduling from "./pages/sspScheduling/SSPScheduling.jsx";
import Login from "./pages/login/Login";
import EmployeeService from "./services/EmployeeService";
import FtPlanning from "./pages/ftPlanning/FtPlanning";
import Holidays from "./pages/holidays/Holidays";
import SetPassword from "./pages/setPassword/SetPassword";

export default function App() {
  useEffect(() => {
    if (EmployeeService.isLoggedIn()) {
      EmployeeService.setUpAutoLogout();
    }
  }, []);

  function getHomeRoute() {
    switch (EmployeeService.getEmployeeFunction()) {
      case "TEAM_LEADER":
      case "WAREHOUSE":
      case "SSP":
        return <Route path="/" element={<SSPPlanning />} />;
      case "FT":
        return <Route path="/" element={<FtPlanning />} />;
      default:
        return <Route path="/" element={<Login />} />;
    }
  }

  function getRoutes() {
    if (!EmployeeService.isLoggedIn()) {
      return (
        <Routes>
          <Route path="/ssp-planning" element={<Login />} />
          <Route path="/ft-planning" element={<Login />} />
          <Route path="/medewerkers" element={<Login />} />
          <Route path="/ssp-inplannen" element={<Login />} />
          <Route path="/vakanties" element={<Login />} />
          <Route path="/inloggen" element={<Login />} />
          <Route
            path="/wachtwoord-instellen/:employeeId/:passwordLinkId"
            element={<SetPassword />}
          />
          <Route path="/" element={<Login />} />
        </Routes>
      );
    }
    return (
      <Routes>
        <Route path="/ssp-planning" element={<SSPPlanning />} />
        <Route path="/ft-planning" element={<FtPlanning />} />
        <Route path="/medewerkers" element={<EmployeeManagement />} />
        <Route path="/ssp-inplannen" element={<SSPSCheduling />} />
        <Route path="/vakanties" element={<Holidays />} />
        <Route path="/inloggen" element={<Login />} />
        <Route
          path="/wachtwoord-instellen/:employeeId/:passwordLinkId"
          element={<SetPassword />}
        />
        {getHomeRoute()}
      </Routes>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col font-Effra_Rg">
      <Navbar />

      <div className="h-[calc(100%-5rem)] align-middle">{getRoutes()}</div>
    </div>
  );
}
