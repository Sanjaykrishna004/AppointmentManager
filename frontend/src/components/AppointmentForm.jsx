import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addAppointment } from "../api/api.js";
import "../css/Appointmentform.css";

const AppointmentForm = ({ refresh }) => {
  const [form, setForm] = useState({
    doctorName: "",
    patientName: "",
    date: null,
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Doctor options
  const doctorOptions = [
    "Dr.Sanjay(Cardiologist)",
    "Dr.Krishna",
    "Dr.Arun",
    "Dr.Santhosh",
    "Dr.Bala",
    "Dr.Anbu",
    "Dr.Jeeva",
    "Dr.Madhavan",
    "Dr.Sanjay(Neurologist)",
  ];

  // Generate time slots
  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        let hour = h % 12 === 0 ? 12 : h % 12;
        let minute = m.toString().padStart(2, "0");
        let period = h < 12 ? "AM" : "PM";
        times.push(`${hour}:${minute} ${period}`);
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validation
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s.-]+$/; // Patient name: letters, spaces, dot, hyphen

    if (!form.doctorName) {
      newErrors.doctorName = "Doctor name is required";
    }
    if (!form.patientName) {
      newErrors.patientName = "Patient name is required";
    } else if (!nameRegex.test(form.patientName)) {
      newErrors.patientName = "Only letters, spaces, dot, or hyphen allowed";
    }
    if (!form.date) {
      newErrors.date = "Date is required";
    }
    if (!form.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formattedDate = form.date.toISOString().split("T")[0];
      await addAppointment({ ...form, date: formattedDate });
      refresh();

      // Reset form
      setForm({
        doctorName: "",
        patientName: "",
        date: null,
        time: "",
        notes: "",
      });
      setErrors({});
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Slot already booked → show error under Time field
        setErrors((prev) => ({
          ...prev,
          time: "This slot is already booked. Please choose another time.",
        }));
      } else {
        console.error("Error adding appointment:", err.response || err);
        setErrors((prev) => ({
          ...prev,
          general: "Failed to add appointment. Check backend connection.",
        }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header with logo */}
      <div className="form-header-with-logo">
        <img
          src={require("../img/img2.jpeg")}
          alt="Logo"
          className="form-header-logo"
        />
        <h2>Book Appointment</h2>
      </div>

      {/* Doctor Dropdown */}
      <select
        name="doctorName"
        value={form.doctorName}
        onChange={handleChange}
      >
        <option value="">Select Doctor</option>
        {doctorOptions.map((doc) => (
          <option key={doc} value={doc}>
            {doc}
          </option>
        ))}
      </select>
      {errors.doctorName && (
        <span className="error">{errors.doctorName}</span>
      )}

      {/* Patient Name */}
      <input
        name="patientName"
        value={form.patientName}
        onChange={handleChange}
        placeholder="Enter Patient Name"
      />
      {errors.patientName && (
        <span className="error">{errors.patientName}</span>
      )}

      {/* Date Picker */}
      <DatePicker
        selected={form.date}
        onChange={(date) => setForm({ ...form, date })}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        minDate={new Date()}
      />
      {errors.date && <span className="error">{errors.date}</span>}

      {/* Time Dropdown */}
      <select name="time" value={form.time} onChange={handleChange}>
        <option value="">Select Time</option>
        {timeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {errors.time && <span className="error">{errors.time}</span>}

      {/* Notes */}
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Additional Notes (optional)"
        rows="3"
      />

      {/* General backend error */}
      {errors.general && <span className="error">{errors.general}</span>}

      <button type="submit">Add Appointment</button>
    </form>
  );
};  

export default AppointmentForm;
