import React, { useEffect, useState } from "react";
import AddHoliday from "./components/AddHoliday";
import { useGetEmployees } from "../../hooks/useGetEmployees.js";
import HolidayList from "./components/HolidayList.jsx";
import ApiService from "../../services/ApiService.js";

export default function Holidays() {
  const [employees] = useGetEmployees();
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    ApiService.get("holidays").then((response) => {
      setHolidays(response.data);
    });
  }, []);

  return (
    <div className="flex h-full w-screen items-start gap-8 p-8">
      <HolidayList holidays={holidays} setHolidays={setHolidays} />
      <AddHoliday
        employees={employees}
        holidays={holidays}
        setHolidays={setHolidays}
      />
    </div>
  );
}
