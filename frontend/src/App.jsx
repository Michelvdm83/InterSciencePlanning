import { Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import SSPPlanning from "./components/sspNavbar/SSPPlanning";
import UserManagement from "./components/userManagement/UserManagement";
import SSPSCheduling from "./components/sspScheduling/SSPScheduling";
import SystemOverview from "./pages/systemOverview/SystemOverview";
import Login from "./pages/login/Login";
import EmployeeService from "./services/EmployeeService";
import FtPlanning from "./pages/ftPlanning/FtPlanning";
import Holidays from "./pages/holidays/Holidays";
import SetPassword from "./pages/setPassword/SetPassword";

export default function App() {
  const { link } = useParams();

  function getHomeRoute() {
    switch (EmployeeService.getEmployeeFunction()) {
      case "TEAM_LEADER":
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
          <Route path="/systeem/:systemName" element={<Login />} />
          <Route path="/systeem" element={<Login />} />
        </Routes>
      );
    }
    return (
      <Routes>
        <Route path="/systeem/:systemName" element={<SystemOverview />} />
        <Route path="/ssp-planning" element={<SSPPlanning />} />
        <Route path="/ft-planning" element={<FtPlanning />} />
        <Route path="/medewerkers" element={<UserManagement />} />
        <Route path="/ssp-inplannen" element={<SSPSCheduling />} />
        <Route path="/vakanties" element={<Holidays />} />
        <Route path="/inloggen" element={<Login />} />
        <Route path="/systeem" element={<SystemOverview sName="brt-001" />} />
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
