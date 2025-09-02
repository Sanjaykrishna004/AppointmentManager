package com.example.appointment.repo;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import com.example.appointment.entity.Appointment;

public class HibernateUtil {
    private static final SessionFactory sessionFactory = buildSessionFactory();

    private static SessionFactory buildSessionFactory() {
        try 
        {
            Configuration configuration = new Configuration().configure("hibernate.cfg.xml");
            configuration.addAnnotatedClass(Appointment.class);
            return configuration.buildSessionFactory();
        } 
        catch (Throwable ex) 
        {
            System.err.println("Initial SessionFactory creation failed: " + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}
