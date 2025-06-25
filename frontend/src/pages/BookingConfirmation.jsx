import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:3000/buses/bookings/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBooking(response.data.booking);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Error fetching booking details');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4'></div>
                    <p className='text-white text-lg'>Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-white text-lg'>Booking not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
            </div>
            
            <div className='relative max-w-2xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm'>
                        <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                            <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z' />
                        </svg>
                    </div>
                    <h1 className='text-3xl font-bold text-white mb-2'>BUSIT</h1>
                    <p className='text-blue-100 text-sm'>Your Journey, Our Priority</p>
                </div>

                {/* Success Message */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 mb-8'>
                    <div className='text-center mb-6'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-green-500 bg-opacity-20 rounded-full mb-4'>
                            <svg className='w-8 h-8 text-green-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                        <h2 className='text-2xl font-bold text-white mb-2'>Booking Confirmed!</h2>
                        <p className='text-blue-100 text-sm'>Your bus ticket has been successfully booked</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-100 rounded-lg backdrop-blur-sm">
                            <div className='flex items-center'>
                                <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Booking Details */}
                    <div className='bg-white bg-opacity-5 rounded-lg p-6 mb-6'>
                        <h3 className='text-lg font-semibold text-white mb-4'>Booking Details</h3>
                        
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Booking ID:</span>
                                <span className='text-white font-medium'>#{booking.id}</span>
                            </div>
                            
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Bus Number:</span>
                                <span className='text-white font-medium'>{booking.bus_number}</span>
                            </div>
                            
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Passenger:</span>
                                <span className='text-white font-medium'>{booking.passenger_name}</span>
                            </div>
                            
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Seat Number:</span>
                                <span className='text-white font-medium'>{booking.seat_number}</span>
                            </div>
                            
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Amount:</span>
                                <span className='text-white font-bold text-lg'>₹{booking.amount}</span>
                            </div>
                            
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Status:</span>
                                <span className='px-2 py-1 bg-green-500 bg-opacity-20 text-green-200 text-sm rounded-full'>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Journey Details */}
                    <div className='bg-white bg-opacity-5 rounded-lg p-6 mb-6'>
                        <h3 className='text-lg font-semibold text-white mb-4'>Journey Details</h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <p className='text-blue-200 text-sm mb-1'>From</p>
                                <p className='text-white font-medium text-lg'>{booking.from_location}</p>
                                <p className='text-blue-100 text-sm'>{formatTime(booking.departure_time)} • {formatDate(booking.departure_time)}</p>
                            </div>
                            
                            <div>
                                <p className='text-blue-200 text-sm mb-1'>To</p>
                                <p className='text-white font-medium text-lg'>{booking.to_location}</p>
                                <p className='text-blue-100 text-sm'>{formatTime(booking.arrival_time)} • {formatDate(booking.arrival_time)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className='bg-yellow-500 bg-opacity-10 border border-yellow-400 border-opacity-30 rounded-lg p-4 mb-6'>
                        <h4 className='text-yellow-200 font-semibold mb-2'>Important Information</h4>
                        <ul className='text-yellow-100 text-sm space-y-1'>
                            <li>• Please arrive at the bus stop 15 minutes before departure</li>
                            <li>• Carry a valid ID proof for verification</li>
                            <li>• Show this booking confirmation to the bus conductor</li>
                            <li>• Keep your booking ID handy for any queries</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Link 
                            to="/my-bookings"
                            className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 text-center'
                        >
                            View All Bookings
                        </Link>
                        
                        <Link 
                            to="/bus-search"
                            className='flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-center'
                        >
                            Book Another Journey
                        </Link>
                    </div>
                </div>

                {/* Navigation */}
                <div className='text-center'>
                    <Link to="/dashboard" className="text-blue-300 hover:text-white font-medium transition-colors duration-200">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation; 