import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bus, setBus] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [bookingData, setBookingData] = useState({
        passengerName: '',
        passengerPhone: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBusDetails();
        fetchAvailableSeats();
    }, [id]);

    const fetchBusDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/buses/${id}`);
            setBus(response.data.bus);
        } catch (err) {
            setError('Error fetching bus details');
        }
    };

    const fetchAvailableSeats = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/buses/${id}/seats`);
            setAvailableSeats(response.data.availableSeats);
        } catch (err) {
            setError('Error fetching available seats');
        } finally {
            setLoading(false);
        }
    };

    const handleSeatSelection = (seatNumber) => {
        setSelectedSeat(seatNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSeat) {
            setError('Please select a seat');
            return;
        }

        if (!bookingData.passengerName || !bookingData.passengerPhone) {
            setError('Please fill all passenger details');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `http://localhost:3000/buses/${id}/book`,
                {
                    seatNumber: selectedSeat,
                    passengerName: bookingData.passengerName,
                    passengerPhone: bookingData.passengerPhone
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Redirect to booking confirmation
            navigate(`/booking-confirmation/${response.data.bookingId}`);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Error creating booking');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4'></div>
                    <p className='text-white text-lg'>Loading bus details...</p>
                </div>
            </div>
        );
    }

    if (!bus) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-white text-lg'>Bus not found</p>
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
            
            <div className='relative max-w-4xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm'>
                        <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                            <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z' />
                        </svg>
                    </div>
                    <h1 className='text-4xl font-bold text-white mb-2'>BUSIT</h1>
                    <p className='text-blue-100 text-lg'>Your Journey, Our Priority</p>
                </div>

                {/* Bus Details */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-6 text-center'>Book Your Seat</h2>
                    
                    <div className='bg-white bg-opacity-5 rounded-lg p-6 mb-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-xl font-semibold text-white'>{bus.bus_number}</h3>
                            <span className='px-3 py-1 bg-green-500 bg-opacity-20 text-green-200 text-sm rounded-full'>Available</span>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <p className='text-blue-200 text-sm mb-1'>From</p>
                                <p className='text-white font-medium text-lg'>{bus.from_location}</p>
                                <p className='text-blue-100'>{formatTime(bus.departure_time)} • {formatDate(bus.departure_time)}</p>
                            </div>
                            
                            <div>
                                <p className='text-blue-200 text-sm mb-1'>To</p>
                                <p className='text-white font-medium text-lg'>{bus.to_location}</p>
                                <p className='text-blue-100'>{formatTime(bus.arrival_time)} • {formatDate(bus.arrival_time)}</p>
                            </div>
                        </div>
                        
                        <div className='mt-4 pt-4 border-t border-white border-opacity-20'>
                            <div className='flex justify-between items-center'>
                                <span className='text-blue-200'>Price per seat:</span>
                                <span className='text-2xl font-bold text-white'>₹{bus.price}</span>
                            </div>
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

                    <form onSubmit={handleSubmit}>
                        {/* Seat Selection */}
                        <div className='mb-8'>
                            <h3 className='text-lg font-semibold text-white mb-4'>Select Your Seat</h3>
                            <div className='grid grid-cols-10 gap-2 max-w-2xl mx-auto'>
                                {Array.from({ length: bus.total_seats }, (_, i) => i + 1).map((seatNumber) => {
                                    const isAvailable = availableSeats.includes(seatNumber);
                                    const isSelected = selectedSeat === seatNumber;
                                    
                                    return (
                                        <button
                                            key={seatNumber}
                                            type='button'
                                            onClick={() => isAvailable && handleSeatSelection(seatNumber)}
                                            disabled={!isAvailable}
                                            className={`
                                                w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-200
                                                ${isSelected 
                                                    ? 'bg-green-500 text-white shadow-lg scale-110' 
                                                    : isAvailable 
                                                        ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 hover:scale-105' 
                                                        : 'bg-red-500 bg-opacity-50 text-red-200 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {seatNumber}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className='flex justify-center mt-4 space-x-6 text-sm'>
                                <div className='flex items-center'>
                                    <div className='w-4 h-4 bg-white bg-opacity-20 rounded mr-2'></div>
                                    <span className='text-blue-200'>Available</span>
                                </div>
                                <div className='flex items-center'>
                                    <div className='w-4 h-4 bg-green-500 rounded mr-2'></div>
                                    <span className='text-blue-200'>Selected</span>
                                </div>
                                <div className='flex items-center'>
                                    <div className='w-4 h-4 bg-red-500 bg-opacity-50 rounded mr-2'></div>
                                    <span className='text-blue-200'>Booked</span>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className='mb-8'>
                            <h3 className='text-lg font-semibold text-white mb-4'>Passenger Details</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Passenger Name</label>
                                    <input 
                                        type="text" 
                                        value={bookingData.passengerName}
                                        onChange={(e) => setBookingData({...bookingData, passengerName: e.target.value})}
                                        className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                        placeholder="Enter passenger name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={bookingData.passengerPhone}
                                        onChange={(e) => setBookingData({...bookingData, passengerPhone: e.target.value})}
                                        className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        {selectedSeat && (
                            <div className='bg-white bg-opacity-5 rounded-lg p-6 mb-8'>
                                <h3 className='text-lg font-semibold text-white mb-4'>Booking Summary</h3>
                                <div className='space-y-2 text-blue-100'>
                                    <div className='flex justify-between'>
                                        <span>Selected Seat:</span>
                                        <span className='text-white font-medium'>{selectedSeat}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Passenger:</span>
                                        <span className='text-white font-medium'>{bookingData.passengerName || 'Not specified'}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Phone:</span>
                                        <span className='text-white font-medium'>{bookingData.passengerPhone || 'Not specified'}</span>
                                    </div>
                                    <div className='border-t border-white border-opacity-20 pt-2 mt-4'>
                                        <div className='flex justify-between text-lg'>
                                            <span className='text-white font-semibold'>Total Amount:</span>
                                            <span className='text-white font-bold'>₹{bus.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className='text-center'>
                            <button 
                                type='submit' 
                                className='bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto'
                                disabled={submitting || !selectedSeat}
                            >
                                {submitting ? (
                                    <>
                                        <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                        </svg>
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BusBooking; 