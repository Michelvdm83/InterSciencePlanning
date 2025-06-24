import { useState } from "react";
import ApiService from "../../services/ApiService";
import SystemModalButton from "../SystemModalButton";

export default function NavbarSearch() {
  const [systemSearch, setSystemSearch] = useState("");
  const [systemList, setSystemList] = useState([]);

  function onChange(event) {
    const searchString = event.target.value;
    setSystemSearch(searchString);
    updateSearch(searchString);
  }

  let allowSearch = true;

  function updateSearch(searchString) {
    if (searchString.length < 3) {
      setSystemList([]);
    }
    if (searchString.length > 2 && allowSearch) {
      allowSearch = false;
      ApiService.get("systems/search", { contains: searchString }).then(
        (response) => {
          setSystemList(response.data);
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
        value={systemSearch}
        onChange={(event) => onChange(event)}
        onFocus={(event) => updateSearch(event.target.value)}
      />
      {systemList.length > 0 && (
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          {systemList.length > 0 &&
            systemList.map((system) => {
              return (
                <SystemModalButton
                  key={system.systemName}
                  systemName={system.systemName}
                >
                  <li>
                    <div className="text-primary">
                      {system.systemName + " - " + system.poNumber}
                    </div>
                  </li>
                </SystemModalButton>
              );
            })}
        </ul>
      )}
    </div>
  );
}
