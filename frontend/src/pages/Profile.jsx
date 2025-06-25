import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
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
            setFormData({ username: response.data.user.username });
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError('Error fetching profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (!formData.username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        setUpdating(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:3000/auth/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSuccess(response.data.message);
            setUser({ ...user, username: formData.username });
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
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
                    <p className='text-white text-lg'>Loading profile...</p>
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

                {success && (
                    <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-400 border-opacity-50 text-green-100 rounded-lg backdrop-blur-sm">
                        <div className='flex items-center'>
                            <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                            </svg>
                            {success}
                        </div>
                    </div>
                )}

                {/* Profile Card */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-2xl font-bold text-white'>Profile Information</h2>
                        {!editMode && (
                            <button 
                                onClick={() => setEditMode(true)}
                                className='bg-blue-500 bg-opacity-20 text-blue-200 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200'
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {editMode ? (
                        <form onSubmit={handleUpdateProfile} className='space-y-6'>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Username</label>
                                <input 
                                    type="text" 
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200'
                                    placeholder="Enter username"
                                    required
                                    disabled={updating}
                                />
                            </div>
                            
                            <div className='flex space-x-4'>
                                <button 
                                    type='submit' 
                                    className='bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : 'Save Changes'}
                                </button>
                                <button 
                                    type='button'
                                    onClick={() => {
                                        setEditMode(false);
                                        setFormData({ username: user.username });
                                        setError('');
                                    }}
                                    className='bg-gray-500 bg-opacity-20 text-gray-200 py-2 px-6 rounded-lg font-semibold hover:bg-opacity-30 transition-all duration-200'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <p className='text-blue-200 text-sm mb-1'>Username</p>
                                    <p className='text-white font-medium text-lg'>{user?.username}</p>
                                </div>
                                
                                <div>
                                    <p className='text-blue-200 text-sm mb-1'>Email</p>
                                    <p className='text-white font-medium text-lg'>{user?.email}</p>
                                </div>
                                
                                <div>
                                    <p className='text-blue-200 text-sm mb-1'>Member Since</p>
                                    <p className='text-white font-medium'>{formatDate(user?.created_at)}</p>
                                </div>
                                
                                <div>
                                    <p className='text-blue-200 text-sm mb-1'>Account Status</p>
                                    <span className='px-2 py-1 bg-green-500 bg-opacity-20 text-green-200 text-sm rounded-full'>
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Actions */}
                <div className='mt-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                    <h3 className='text-xl font-bold text-white mb-6'>Account Actions</h3>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Link 
                            to="/my-bookings"
                            className='bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group'
                        >
                            <div className='flex items-center'>
                                <div className='w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200'>
                                    <svg className='w-5 h-5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className='text-white font-semibold'>View Bookings</h4>
                                    <p className='text-blue-200 text-sm'>Check your booking history</p>
                                </div>
                            </div>
                        </Link>

                        <Link 
                            to="/bus-search"
                            className='bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group'
                        >
                            <div className='flex items-center'>
                                <div className='w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200'>
                                    <svg className='w-5 h-5 text-green-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className='text-white font-semibold'>Book New Journey</h4>
                                    <p className='text-blue-200 text-sm'>Search and book buses</p>
                                </div>
                            </div>
                        </Link>

                        <button 
                            onClick={handleLogout}
                            className='bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 group text-left'
                        >
                            <div className='flex items-center'>
                                <div className='w-10 h-10 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200'>
                                    <svg className='w-5 h-5 text-red-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className='text-white font-semibold'>Logout</h4>
                                    <p className='text-blue-200 text-sm'>Sign out of your account</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 