import { useState } from "react";
import EmployeeService from "../../services/EmployeeService";
import NavbarButton from "./NavbarButton";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar h-20 bg-primary">
      <div className="flex-1">
        <NavbarButton
          title="SSP Planning"
          onClick={() => navigate("/ssp-planning")}
        ></NavbarButton>
        <NavbarButton
          title="Medewerkers"
          onClick={() => navigate("/medewerkers")}
        ></NavbarButton>
        <NavbarButton
          title="SSP Inplannen"
          onClick={() => navigate("/ssp-inplannen")}
        ></NavbarButton>
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
