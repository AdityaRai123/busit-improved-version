-- BUSIT Database Schema
-- Bus Ticketing System for VIT University

-- Create database
CREATE DATABASE IF NOT EXISTS authentication;
USE authentication;

-- Users table (enhanced)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_seats INT NOT NULL DEFAULT 40,
    available_seats INT NOT NULL DEFAULT 40,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bus_id INT NOT NULL,
    seat_number INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(15) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    booking_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat_booking (bus_id, seat_number, booking_date)
);

-- Sample data for buses
INSERT INTO buses (bus_number, from_location, to_location, departure_time, arrival_time, price, total_seats, available_seats) VALUES
('VIT001', 'VIT Vellore', 'Chennai Central', '2024-01-15 08:00:00', '2024-01-15 12:00:00', 250.00, 40, 40),
('VIT002', 'VIT Vellore', 'Bangalore', '2024-01-15 09:00:00', '2024-01-15 15:00:00', 350.00, 40, 40),
('VIT003', 'Chennai Central', 'VIT Vellore', '2024-01-15 14:00:00', '2024-01-15 18:00:00', 250.00, 40, 40),
('VIT004', 'Bangalore', 'VIT Vellore', '2024-01-15 16:00:00', '2024-01-15 22:00:00', 350.00, 40, 40),
('VIT005', 'VIT Vellore', 'Hyderabad', '2024-01-15 10:00:00', '2024-01-15 18:00:00', 450.00, 40, 40),
('VIT006', 'Hyderabad', 'VIT Vellore', '2024-01-15 20:00:00', '2024-01-16 04:00:00', 450.00, 40, 40),
('VIT007', 'VIT Vellore', 'Mumbai', '2024-01-15 07:00:00', '2024-01-16 07:00:00', 800.00, 40, 40),
('VIT008', 'Mumbai', 'VIT Vellore', '2024-01-15 18:00:00', '2024-01-16 18:00:00', 800.00, 40, 40);

-- Create indexes for better performance
CREATE INDEX idx_buses_from_to ON buses(from_location, to_location);
CREATE INDEX idx_buses_departure ON buses(departure_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_bus ON bookings(bus_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Create view for available seats
CREATE VIEW available_seats_view AS
SELECT 
    b.id as bus_id,
    b.bus_number,
    b.from_location,
    b.to_location,
    b.departure_time,
    b.arrival_time,
    b.price,
    b.total_seats,
    (b.total_seats - COALESCE(booked.count, 0)) as available_seats
FROM buses b
LEFT JOIN (
    SELECT bus_id, COUNT(*) as count
    FROM bookings
    WHERE status != 'cancelled'
    GROUP BY bus_id
) booked ON b.id = booked.bus_id
WHERE b.status = 'active';

-- Create view for booking details
CREATE VIEW booking_details_view AS
SELECT 
    bk.id,
    bk.user_id,
    bk.bus_id,
    bk.seat_number,
    bk.passenger_name,
    bk.passenger_phone,
    bk.amount,
    bk.status,
    bk.booking_date,
    bk.created_at,
    b.bus_number,
    b.from_location,
    b.to_location,
    b.departure_time,
    b.arrival_time,
    u.username,
    u.email
FROM bookings bk
JOIN buses b ON bk.bus_id = b.id
JOIN users u ON bk.user_id = u.id; 