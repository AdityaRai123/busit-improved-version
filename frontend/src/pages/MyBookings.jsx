import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:3000/buses/my-bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBookings(response.data.bookings);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Error fetching bookings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/buses/bookings/${bookingId}/cancel`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Refresh bookings
            fetchBookings();
        } catch (err) {
            setError('Error cancelling booking');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500 bg-opacity-20 text-green-200';
            case 'cancelled':
                return 'bg-red-500 bg-opacity-20 text-red-200';
            case 'completed':
                return 'bg-blue-500 bg-opacity-20 text-blue-200';
            default:
                return 'bg-gray-500 bg-opacity-20 text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4'></div>
                    <p className='text-white text-lg'>Loading bookings...</p>
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
            
            <div className='relative max-w-6xl mx-auto'>
                {/* Header */}
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mr-4 backdrop-blur-sm'>
                            <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                                <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z' />
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-white'>BUSIT</h1>
                            <p className='text-blue-100 text-sm'>Your Journey, Our Priority</p>
                        </div>
                    </div>
                    
                    <Link 
                        to="/dashboard"
                        className='bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200'
                    >
                        ← Back to Dashboard
                    </Link>
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

                {/* Bookings List */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-white'>My Bookings</h2>
                        <Link 
                            to="/bus-search"
                            className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200'
                        >
                            Book New Journey
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-8 h-8 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <h3 className='text-white text-lg font-semibold mb-2'>No bookings found</h3>
                            <p className='text-blue-200 mb-6'>Start your journey by booking a bus</p>
                            <Link 
                                to="/bus-search"
                                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 inline-flex items-center'
                            >
                                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                                Search Buses
                            </Link>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {bookings.map((booking) => (
                                <div key={booking.id} className='bg-white bg-opacity-5 rounded-lg p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-200'>
                                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                                        <div className='flex-1'>
                                            <div className='flex items-center mb-2'>
                                                <h4 className='text-lg font-semibold text-white'>{booking.bus_number}</h4>
                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                            
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-2'>
                                                <div>
                                                    <p className='text-blue-200 text-sm'>From</p>
                                                    <p className='text-white font-medium'>{booking.from_location}</p>
                                                </div>
                                                
                                                <div className='text-center'>
                                                    <div className='w-full h-px bg-white bg-opacity-20 my-2'></div>
                                                    <svg className='w-4 h-4 text-blue-200 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                                    </svg>
                                                </div>
                                                
                                                <div>
                                                    <p className='text-blue-200 text-sm'>To</p>
                                                    <p className='text-white font-medium'>{booking.to_location}</p>
                                                </div>
                                            </div>
                                            
                                            <div className='flex flex-wrap items-center gap-6 text-sm text-blue-200'>
                                                <div className='flex items-center'>
                                                    <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                                    </svg>
                                                    Seat {booking.seat_number}
                                                </div>
                                                <div className='flex items-center'>
                                                    <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                    </svg>
                                                    {formatTime(booking.departure_time)}
                                                </div>
                                                <div className='flex items-center'>
                                                    <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                                    </svg>
                                                    {formatDate(booking.departure_time)}
                                                </div>
                                                <div className='flex items-center'>
                                                    <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                                    </svg>
                                                    {booking.passenger_name}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='mt-4 lg:mt-0 lg:ml-6 text-center'>
                                            <div className='text-xl font-bold text-white mb-2'>₹{booking.amount}</div>
                                            <div className='text-blue-200 text-sm mb-3'>Booking ID: #{booking.id}</div>
                                            {booking.status === 'confirmed' && (
                                                <button 
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className='bg-red-500 bg-opacity-20 text-red-200 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm'
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings; 