import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusSearch = () => {
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: ''
    });
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const locations = [
        'VIT Vellore',
        'Chennai Central',
        'Bangalore',
        'Hyderabad',
        'Mumbai',
        'Delhi',
        'Pune',
        'Kolkata'
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchData.from || !searchData.to || !searchData.date) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/buses/search', searchData);
            setBuses(response.data.buses);
        } catch (err) {
            setError(err.response?.data?.message || 'Error searching buses');
        } finally {
            setLoading(false);
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
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleBookNow = (busId) => {
        navigate(`/bus/${busId}/book`);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
            </div>
            
            <div className='relative max-w-6xl mx-auto'>
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

                {/* Search Form */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-6 text-center'>Search Buses</h2>
                    
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
                    
                    <form onSubmit={handleSearch} className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">From</label>
                            <select 
                                value={searchData.from}
                                onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                                className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                required
                            >
                                <option value="">Select departure</option>
                                {locations.map(location => (
                                    <option key={location} value={location} className='text-gray-800'>{location}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">To</label>
                            <select 
                                value={searchData.to}
                                onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                                className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                required
                            >
                                <option value="">Select destination</option>
                                {locations.map(location => (
                                    <option key={location} value={location} className='text-gray-800'>{location}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Date</label>
                            <input 
                                type="date" 
                                value={searchData.date}
                                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                                className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        
                        <div className='flex items-end'>
                            <button 
                                type='submit' 
                                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                        </svg>
                                        Search Buses
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {buses.length > 0 && (
                    <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                        <h3 className='text-xl font-bold text-white mb-6'>Available Buses ({buses.length})</h3>
                        <div className='space-y-4'>
                            {buses.map((bus) => (
                                <div key={bus.id} className='bg-white bg-opacity-5 rounded-lg p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-200'>
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                                        <div className='flex-1'>
                                            <div className='flex items-center mb-2'>
                                                <h4 className='text-lg font-semibold text-white'>{bus.bus_number}</h4>
                                                <span className='ml-2 px-2 py-1 bg-green-500 bg-opacity-20 text-green-200 text-xs rounded-full'>Available</span>
                                            </div>
                                            
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                                <div>
                                                    <p className='text-blue-200 text-sm'>From</p>
                                                    <p className='text-white font-medium'>{bus.from_location}</p>
                                                    <p className='text-blue-100 text-sm'>{formatTime(bus.departure_time)} • {formatDate(bus.departure_time)}</p>
                                                </div>
                                                
                                                <div className='text-center'>
                                                    <div className='w-full h-px bg-white bg-opacity-20 my-2'></div>
                                                    <svg className='w-6 h-6 text-blue-200 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                                    </svg>
                                                </div>
                                                
                                                <div>
                                                    <p className='text-blue-200 text-sm'>To</p>
                                                    <p className='text-white font-medium'>{bus.to_location}</p>
                                                    <p className='text-blue-100 text-sm'>{formatTime(bus.arrival_time)} • {formatDate(bus.arrival_time)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className='flex items-center text-sm text-blue-200'>
                                                <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                                </svg>
                                                {bus.available_seats} seats available
                                            </div>
                                        </div>
                                        
                                        <div className='mt-4 md:mt-0 md:ml-6 text-center'>
                                            <div className='text-2xl font-bold text-white mb-2'>₹{bus.price}</div>
                                            <button 
                                                onClick={() => handleBookNow(bus.id)}
                                                className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200'
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className='text-center mt-8'>
                    <Link to="/dashboard" className="text-blue-300 hover:text-white font-medium transition-colors duration-200">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusSearch; 