import { useEffect, useState } from "react";
import NavbarButton from "./NavbarButton";
import { useNavigate } from "react-router-dom";

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
    <div className="navbar h-20 bg-primary">
      <div className="flex-1">
        {showSSPPages && (
          <NavbarButton
            title="SSP Planning"
            onClick={() => navigate("/ssp-planning")}
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
            title="SSP Inplannen"
            onClick={() => navigate("/ssp-inplannen")}
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
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        {EmployeeService.isLoggedIn() && (
          <NavbarButton
            title="Uitloggen"
            onClick={() => {
              EmployeeService.logout();
              navigate("/inloggen");
            }}
          ></NavbarButton>
        )}
      </div>
    </div>
  );
}
