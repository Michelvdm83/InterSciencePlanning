import { useState } from "react";
import ApiService from "../../services/ApiService";
import SystemModalButton from "../SystemModalButton";

export default function NavbarSearch() {
  const [nameSearch, setNameSearch] = useState("");
  const [namesList, setNamesList] = useState([]);

  function onChange(event) {
    const searchString = event.target.value;
    setNameSearch(searchString);
    updateSearch(searchString);
  }

  let allowSearch = true;
  function updateSearch(searchString) {
    if (searchString.length < 3) {
      setNamesList([]);
    }
    if (searchString.length > 2 && allowSearch) {
      allowSearch = false;
      ApiService.get("systems/search", { contains: searchString }).then(
        (response) => {
          setNamesList(response.data);
        },
      );
      setTimeout(() => {
        allowSearch = true;
      }, 300);
    }
  }

  return (
    <div className="dropdown">
      <input
        type="text"
        placeholder="Zoek Systeem"
        className="input input-bordered w-24 md:w-auto"
        value={nameSearch}
        onChange={(event) => onChange(event)}
        onFocus={(event) => updateSearch(event.target.value)}
      />
      {namesList.length > 0 && (
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          {namesList.length > 0 &&
            namesList.map((systemName) => {
              return (
                <SystemModalButton key={systemName} systemName={systemName}>
                  <li>
                    <div className="text-primary">{systemName}</div>
                  </li>
                </SystemModalButton>
              );
            })}
        </ul>
      )}
    </div>
  );
}
