import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import ApiService from "../../../services/ApiService.js";

export default function YearOverviewDownloadComponent() {
  const [year, setYear] = useState(new Date());
  // Define column headers for CSV, used to set the data in the correct format
  const fileHeaders = ["name", "systemType"];

  // Function to convert JSON to CSV string
  function convertJSONToCSV(jsonData, columnHeaders) {
    // Map JSON data to CSV rows
    const rows = jsonData
      .sort(sortOnSystemTypeThenName)
      .map((row) =>
        // Map each row to CSV format
        columnHeaders.map((field) => row[field] || "").join(","),
      )
      .join("\n");

    // Combine Dutch headers and rows
    return "Naam,Systeem type\n" + rows;
  }

  function sortOnSystemTypeThenName(a, b) {
    if (a.systemType != b.systemType)
      return a.systemType.localeCompare(b.systemType);
    return a.name.localeCompare(b.name);
  }

  // Function to initiate CSV download
  function downloadCSV(jsonData, headers) {
    const csvData = convertJSONToCSV(jsonData, headers);

    // Check if CSV data is empty
    if (csvData === "") {
      alert("No data to export");
    } else {
      // Create CSV file and initiate download
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        "Jaaroverzicht_" + format(year, "yyyy") + ".csv",
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function handleDownloadButtonClick() {
    ApiService.get("systems/year-overview/" + format(year, "yyyy")).then(
      (response) => {
        downloadCSV(response.data, fileHeaders);
      },
    );
  }

  return (
    <div className="flex h-max w-full items-center justify-center gap-10 rounded-md bg-neutral p-3">
      <DatePicker
        className="w-44 rounded-md bg-white p-0 text-center text-lg"
        selected={year}
        onChange={(date) => setYear(date)}
        showYearPicker
        dateFormat="yyyy"
        yearItemNumber={4}
        showMonthYearDropdown
      />
      <button
        className="btn btn-accent"
        onClick={() => {
          handleDownloadButtonClick();
        }}
      >
        Download Jaaroverzicht
      </button>
    </div>
  );
}
