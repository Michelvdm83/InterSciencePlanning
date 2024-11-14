import { useEffect, useState } from "react";
import NavbarButton from "./NavbarButton";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../../services/EmployeeService";
import NavbarSearch from "./NavbarSearch";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSSPPages, setShowSSPPages] = useState(false);
  const [showFTPages, setShowFTPages] = useState(false);
  const [showTeamleaderPages, setShowTeamleaderPages] = useState(false);

  useEffect(() => {
    switch (EmployeeService.getEmployeeFunction()) {
      case "TEAM_LEADER":
        setShowTeamleaderPages(true);
        setShowSSPPages(true);
        setShowFTPages(true);
        break;
      case "SSP":
        setShowSSPPages(true);
        break;
      case "FT":
        setShowFTPages(true);
        break;
      default:
    }
  });

  return (
    <div
      className={`navbar ${EmployeeService.isLoggedIn() ? "min-h-min" : "min-h-20"} flex-wrap bg-primary p-4`}
    >
      <div className="min-w-min flex-1 flex-wrap">
        {showSSPPages && (
          <NavbarButton
            title="SSP Planning"
            onClick={() => navigate("/ssp-planning")}
          ></NavbarButton>
        )}
        {showTeamleaderPages && (
          <NavbarButton
            title="SSP Inplannen"
            onClick={() => navigate("/ssp-inplannen")}
          ></NavbarButton>
        )}
        {showFTPages && (
          <NavbarButton
            title="FT Planning"
            onClick={() => navigate("/ft-planning")}
          ></NavbarButton>
        )}
        {showTeamleaderPages && (
          <NavbarButton
            title="Medewerkers"
            onClick={() => navigate("/medewerkers")}
          ></NavbarButton>
        )}
        {showTeamleaderPages && (
          <NavbarButton
            title="Vakanties"
            onClick={() => navigate("/vakanties")}
          ></NavbarButton>
        )}
      </div>

      {EmployeeService.isLoggedIn() && (
        <div className="min-w-min flex-none gap-2">
          <NavbarSearch />

          <NavbarButton
            title="Uitloggen"
            onClick={() => {
              EmployeeService.logout();
              navigate("/inloggen");
            }}
          ></NavbarButton>
        </div>
      )}
    </div>
  );
}
