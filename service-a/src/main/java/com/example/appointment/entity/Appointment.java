package com.example.appointment.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Entity
@Table(name = "Appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank(message = "Doctor name is required")// constraint
    @Pattern(regexp = "^[A-Za-z\\s.-]+$", message = "Doctor name must contain only letters, spaces, dots, or hyphens")
    private String doctorName;

    @NotBlank(message = "Patient name is required")
    @Pattern(regexp = "^[A-Za-z\\s.-]+$", message = "Patient name must contain only letters, spaces, dots, or hyphens")
    private String patientName;

    private String date;
    private String time;
    private String notes;

    public Appointment() {
        
    }
    public Appointment(String doctorName, String patientName, String date, String time, String notes)
    {
        this.doctorName = doctorName;
        this.patientName = patientName;
        this.date = date;
        this.time = time;
        this.notes = notes;
    }

    public int getId() 
    {
        return id; 
    }
    public String getDoctorName() 
    { 
        return doctorName; 
    }
    public void setDoctorName(String doctorName) 
    { 
        this.doctorName = doctorName; 
    }
    public String getPatientName() 
    {
         return patientName; 
    }
    public void setPatientName(String patientName) 
    {
         this.patientName = patientName;
    }
    public String getDate() 
    { 
        return date; 
    }
    public void setDate(String date) 
    { 
        this.date = date; 
    }
    public String getTime() 
    { 
        return time; 
    }
    public void setTime(String time) 
    { 
        this.time = time; 
    }
    public String getNotes() 
    {
         return notes; 
    }
    public void setNotes(String notes) 
    { 
        this.notes = notes; 
    }
}
