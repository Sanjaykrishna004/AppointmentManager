package com.example.appointment.repo;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.hibernate.Session;
import org.hibernate.Transaction;
import com.example.appointment.entity.Appointment;
import java.util.List;

@Path("/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentResource {

    @GET
    public Response getAppointments() {
        List<Appointment> appointments;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            appointments = session.createQuery("from Appointment", Appointment.class).list();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching appointments: " + e.getMessage()).build();
        }
        return Response.ok(appointments).build();
    }

    @POST
    public Response addAppointment(@Valid Appointment appointment) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            // 🔎 Step 1: Check if doctor already has an appointment at the same date & time
            Long count = session.createQuery(
                    "SELECT COUNT(a) FROM Appointment a WHERE a.doctorName = :doctorName AND a.date = :date AND a.time = :time",
                    Long.class)
                .setParameter("doctorName", appointment.getDoctorName())
                .setParameter("date", appointment.getDate())
                .setParameter("time", appointment.getTime())
                .uniqueResult();

            if (count != null && count > 0) {
                return Response.status(Response.Status.CONFLICT)
                        .entity("This slot is already booked for " + appointment.getDoctorName() +
                                " at " + appointment.getDate() + " " + appointment.getTime())
                        .build();
            }

            // ✅ Step 2: Save appointment if no conflict
            tx = session.beginTransaction();
            session.persist(appointment);
            tx.commit();

            return Response.status(Response.Status.CREATED).entity(appointment).build();

        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error adding appointment: " + e.getMessage()).build();
        }
    }
}
