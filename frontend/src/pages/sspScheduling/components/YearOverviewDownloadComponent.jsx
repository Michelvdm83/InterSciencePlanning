import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import ApiService from "../../../services/ApiService.js";

export default function YearOverviewDownloadComponent() {
  const [year, setYear] = useState(new Date());
  // Define column headers for CSV
  const fileHeaders = ["name", "systemType"];

  // Function to convert JSON to CSV string
  function convertJSONToCSV(jsonData, columnHeaders) {
    // Check if JSON data is empty
    if (jsonData.length === 0) {
      return "";
    }

    // Create headers string
    const headers = columnHeaders.join(",") + "\n";

    // Map JSON data to CSV rows
    const rows = jsonData
      .map((row) => {
        // Map each row to CSV format
        return columnHeaders.map((field) => row[field] || "").join(",");
      })
      .join("\n");

    // Combine headers and rows
    return headers + rows;
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

  // Render the button for CSV export
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
