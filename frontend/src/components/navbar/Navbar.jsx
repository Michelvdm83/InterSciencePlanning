import NavbarButton from "./NavbarButton";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar m-0 h-20 bg-primary">
      <div className="flex-1">
        <NavbarButton
          title="SSP Planning"
          onClick={() => navigate("/SSPPlanning")}
        ></NavbarButton>
        <NavbarButton
          title="Gebruikers"
          onClick={() => navigate("/UserManagement")}
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
        <p>test inlogknop</p>
      </div>
    </div>
  );
}
