import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import busRouter from './routes/busRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/buses', busRouter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'BUSIT API is running' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚌 BUSIT server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});