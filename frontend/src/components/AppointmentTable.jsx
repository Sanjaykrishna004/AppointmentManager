import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-theme-quartz.css";
import "../css/AppointmentTable.css";

import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const AppointmentTable = ({ appointments }) => {
  const [quickFilter, setQuickFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Columns definition
  const columnDefs = useMemo(
    () => [
      { headerName: "Doctor", field: "doctorName", flex: 1, sortable: true, filter: true, resizable: true },
      { headerName: "Patient", field: "patientName", flex: 1, sortable: true, filter: true, resizable: true },
      { headerName: "Date", field: "date", flex: 1, sortable: true, filter: "agDateColumnFilter", resizable: true },
      {
        headerName: "Time",field: "time",flex: 1,sortable: true,filter: true,resizable: true,
        comparator: (valueA, valueB) => {
          const parseTime = (timeStr) => 
          {
            if (!timeStr) return 0;
            const [time, modifier] = timeStr.split(" "); // e.g., "12:30 PM"
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return hours * 60 + minutes; // total minutes since midnight
          };
          return parseTime(valueA) - parseTime(valueB);
        },
      },
      { headerName: "Notes", field: "notes", flex: 2, resizable: true },
    ],
    []
  );

  return (
    <div style={{ position: "relative" }}>
      {/* Global Search */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search appointments..."
          onChange={(e) => setQuickFilter(e.target.value)}
          className="global-search"
        />
      </div>

      {/* Loading Overlay */}
      <div className={`loading-overlay ${loading ? "active" : ""}`}>
        <div className="spinner"></div>
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-quartz custom-aggrid" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={appointments}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={8}
          paginationPageSizeSelector={[8, 20, 50, 100]}
          quickFilterText={quickFilter}
          animateRows={true}
          onGridReady={() => {
            setTimeout(() => setLoading(false), 500);
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentTable;
