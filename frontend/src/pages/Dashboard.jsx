import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchUserBookings();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:3000/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data.user);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError('Error fetching profile');
            }
        }
    };

    const fetchUserBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/buses/my-bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBookings(response.data.bookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
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
                    <p className='text-white text-lg'>Loading dashboard...</p>
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
            
            <div className='relative max-w-7xl mx-auto'>
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
                    
                    <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                            <p className='text-white font-medium'>Welcome, {user?.username}</p>
                            <p className='text-blue-200 text-sm'>{user?.email}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className='bg-red-500 bg-opacity-20 text-red-200 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200'
                        >
                            Logout
                        </button>
                    </div>
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

                {/* Quick Actions */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <Link to="/bus-search" className='bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200'>
                                <svg className='w-6 h-6 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-white font-semibold text-lg'>Search Buses</h3>
                                <p className='text-blue-200 text-sm'>Find and book your journey</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/my-bookings" className='bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200'>
                                <svg className='w-6 h-6 text-green-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-white font-semibold text-lg'>My Bookings</h3>
                                <p className='text-blue-200 text-sm'>View booking history</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/profile" className='bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200'>
                                <svg className='w-6 h-6 text-purple-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-white font-semibold text-lg'>Profile</h3>
                                <p className='text-blue-200 text-sm'>Manage your account</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Bookings */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-white'>Recent Bookings</h2>
                        <Link to="/my-bookings" className='text-blue-300 hover:text-white font-medium transition-colors duration-200'>
                            View All →
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-8 h-8 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <h3 className='text-white text-lg font-semibold mb-2'>No bookings yet</h3>
                            <p className='text-blue-200 mb-6'>Start your journey by searching for buses</p>
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
                            {bookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className='bg-white bg-opacity-5 rounded-lg p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-200'>
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
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
                                            
                                            <div className='flex items-center space-x-6 text-sm text-blue-200'>
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
                                            </div>
                                        </div>
                                        
                                        <div className='mt-4 md:mt-0 md:ml-6 text-center'>
                                            <div className='text-xl font-bold text-white mb-2'>₹{booking.amount}</div>
                                            <div className='text-blue-200 text-sm'>Booking ID: #{booking.id}</div>
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

export default Dashboard; 