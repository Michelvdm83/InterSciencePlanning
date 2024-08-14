import React, { useState } from "react";
import AddHoliday from "./components/AddHoliday";
import { useGetEmployees } from "../../hooks/useGetEmployees.js";
import HolidayList from "./components/HolidayList.jsx";

export default function Holidays() {
  const [employees] = useGetEmployees();
  const [holidays, setHolidays] = useState([]);

  return (
    <div className="flex h-full w-screen items-start gap-8 p-8">
      <HolidayList />
      <AddHoliday
        employees={employees}
        holidays={holidays}
        setHolidays={setHolidays}
      />
    </div>
  );
}
