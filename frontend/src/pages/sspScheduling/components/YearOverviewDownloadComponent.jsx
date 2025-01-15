import React from "react";

export default function YearOverviewDownloadComponent() {
  // Define column headers for CSV
  const fileHeaders = ["product_name", "price", "quantity", "total_price"];

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
      link.setAttribute("download", "product_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Sample JSON data for products
  const dummyData = [
    {
      product_name: "Widget",
      price: 50,
      quantity: 2,
      total_price: 100,
    },
    {
      product_name: "Gadget",
      price: 100,
      quantity: 1,
      total_price: 100,
    },
    {
      product_name: "Tool",
      price: 75,
      quantity: 3,
      total_price: 225,
    },
    {
      product_name: "Accessory",
      price: 25,
      quantity: 4,
      total_price: 100,
    },
    {
      product_name: "Equipment",
      price: 200,
      quantity: 1,
      total_price: 200,
    },
  ];

  // Render the button for CSV export
  return (
    <div className="h-max w-full gap-2 rounded-md bg-neutral p-2">
      <button
        className="btn btn-accent"
        onClick={() => {
          downloadCSV(dummyData, fileHeaders);
        }}
      >
        Download Jaaroverzicht
      </button>
    </div>
  );
}
