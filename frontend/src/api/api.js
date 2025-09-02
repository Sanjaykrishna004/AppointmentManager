import axios from "axios";

const API_URL = "http://localhost:8080/api/appointments";

export const getAppointments = () => axios.get(API_URL);// for get 
export const addAppointment = (appointment) =>// for post
  axios.post(API_URL, appointment, 
  {
    headers: { "Content-Type": "application/json" },
  });
