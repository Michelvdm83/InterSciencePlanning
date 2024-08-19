import React from "react";

export default function Holiday({ holiday, holidays, setHolidays }) {
  return (
    <div className="flex justify-between rounded-md bg-base-100 p-3">
      <div>
        <p className="">
          {holiday.startDate} <span className="mx-2">-</span> {holiday.endDate}
        </p>
      </div>
    </div>
  );
}
