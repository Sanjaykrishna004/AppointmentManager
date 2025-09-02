import React, { useState } from "react";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentTable from "./components/AppointmentTable";
import "../src/css/App.css";
import { getAppointments } from "../src/api/api";
 
const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [showTable, setShowTable] = useState(false); // control table visibility

  const fetchAppointments = async () => {
    try 
    {
      const response = await getAppointments();
      setAppointments(response.data);
      setShowTable(true); // show table after fetch
    }
    catch (err) 
    {
      console.error("Error fetching appointments:", err.response || err);
      alert("Failed to fetch appointments. Check backend connection.");
    }
  };

  return (
    <div className="container">
      {/* Header with logo */}
      <div className="header-with-logo">
        <img
          src={require("../src/img/img1.jpeg")} // path to your logo
          alt="Logo"
          className="header-logo"
        />
        <h1>Appointment Manager</h1>
      </div>

      <AppointmentForm refresh={fetchAppointments} />

      {/* Centered buttons */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        {!showTable ? (
          <button onClick={fetchAppointments} className="btn-primary">
            View All Appointments
          </button>
        ) : (
          <button onClick={() => setShowTable(false)} className="btn-secondary">
            Close Appointments
          </button>
        )}
      </div>

      {/* Show table only when user clicked view */}
      {showTable ? (
        appointments.length > 0 ? (
          <AppointmentTable appointments={appointments} />
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            No appointments available.
          </p>
        )
      ) : (
        <p style={{ textAlign: "center", color: "black" }}>
          Click "View All Appointments" to see the data.
        </p>
      )}
    </div>
  );
};

export default App;
