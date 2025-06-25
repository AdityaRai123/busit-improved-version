import express from 'express';
import connectToDatabase from '../lib/db.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [buses] = await db.query(`
            SELECT * FROM buses 
            WHERE status = 'active' 
            ORDER BY departure_time ASC
        `);
        
        return res.status(200).json({ buses });
    } catch (err) {
        console.error('Get buses error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Search buses
router.post('/search', async (req, res) => {
    const { from, to, date } = req.body;
    
    if (!from || !to || !date) {
        return res.status(400).json({ message: "From, to, and date are required" });
    }
    
    try {
        const db = await connectToDatabase();
        const [buses] = await db.query(`
            SELECT * FROM buses 
            WHERE from_location = ? 
            AND to_location = ? 
            AND DATE(departure_time) = ? 
            AND status = 'active'
            ORDER BY departure_time ASC
        `, [from, to, date]);
        
        return res.status(200).json({ buses });
    } catch (err) {
        console.error('Search buses error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get bus by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = await connectToDatabase();
        const [buses] = await db.query('SELECT * FROM buses WHERE id = ? AND status = "active"', [id]);
        
        if (buses.length === 0) {
            return res.status(404).json({ message: "Bus not found" });
        }
        
        return res.status(200).json({ bus: buses[0] });
    } catch (err) {
        console.error('Get bus error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get available seats for a bus
router.get('/:id/seats', async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = await connectToDatabase();
        
        // Get bus details
        const [buses] = await db.query('SELECT * FROM buses WHERE id = ?', [id]);
        if (buses.length === 0) {
            return res.status(404).json({ message: "Bus not found" });
        }
        
        const bus = buses[0];
        
        // Get booked seats
        const [bookings] = await db.query(`
            SELECT seat_number FROM bookings 
            WHERE bus_id = ? AND status != 'cancelled'
        `, [id]);
        
        const bookedSeats = bookings.map(booking => booking.seat_number);
        const totalSeats = bus.total_seats;
        const availableSeats = [];
        
        // Generate available seats
        for (let i = 1; i <= totalSeats; i++) {
            if (!bookedSeats.includes(i)) {
                availableSeats.push(i);
            }
        }
        
        return res.status(200).json({ 
            availableSeats,
            totalSeats,
            bookedSeats
        });
    } catch (err) {
        console.error('Get seats error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Create booking
router.post('/:id/book', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { seatNumber, passengerName, passengerPhone } = req.body;
    
    if (!seatNumber || !passengerName || !passengerPhone) {
        return res.status(400).json({ message: "Seat number, passenger name, and phone are required" });
    }
    
    try {
        const db = await connectToDatabase();
        
        // Check if bus exists
        const [buses] = await db.query('SELECT * FROM buses WHERE id = ? AND status = "active"', [id]);
        if (buses.length === 0) {
            return res.status(404).json({ message: "Bus not found" });
        }
        
        const bus = buses[0];
        
        // Check if seat is available
        const [existingBookings] = await db.query(`
            SELECT * FROM bookings 
            WHERE bus_id = ? AND seat_number = ? AND status != 'cancelled'
        `, [id, seatNumber]);
        
        if (existingBookings.length > 0) {
            return res.status(409).json({ message: "Seat is already booked" });
        }
        
        // Create booking
        const [result] = await db.query(`
            INSERT INTO bookings (user_id, bus_id, seat_number, passenger_name, passenger_phone, amount, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, 'confirmed', NOW())
        `, [req.userId, id, seatNumber, passengerName, passengerPhone, bus.price]);
        
        const bookingId = result.insertId;
        
        return res.status(201).json({ 
            message: "Booking created successfully",
            bookingId,
            amount: bus.price
        });
    } catch (err) {
        console.error('Create booking error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get user's bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [bookings] = await db.query(`
            SELECT b.*, bs.from_location, bs.to_location, bs.departure_time, bs.arrival_time, bs.bus_number
            FROM bookings b
            JOIN buses bs ON b.bus_id = bs.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.userId]);
        
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error('Get bookings error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Cancel booking
router.post('/bookings/:id/cancel', verifyToken, async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = await connectToDatabase();
        
        // Check if booking exists and belongs to user
        const [bookings] = await db.query(`
            SELECT * FROM bookings 
            WHERE id = ? AND user_id = ? AND status = 'confirmed'
        `, [id, req.userId]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: "Booking not found or cannot be cancelled" });
        }
        
        // Update booking status
        await db.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [id]);
        
        return res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error('Cancel booking error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get booking details
router.get('/bookings/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    
    try {
        const db = await connectToDatabase();
        const [bookings] = await db.query(`
            SELECT b.*, bs.from_location, bs.to_location, bs.departure_time, bs.arrival_time, bs.bus_number
            FROM bookings b
            JOIN buses bs ON b.bus_id = bs.id
            WHERE b.id = ? AND b.user_id = ?
        `, [id, req.userId]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        return res.status(200).json({ booking: bookings[0] });
    } catch (err) {
        console.error('Get booking error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router; 