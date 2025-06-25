import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        
        // Clear error when user starts typing
        setError('');
        
        // Check password match when either password field changes
        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password' && values.confirmPassword) {
                setPasswordError(value === values.confirmPassword ? '' : 'Passwords do not match');
            } else if (name === 'confirmPassword') {
                setPasswordError(value === values.password ? '' : 'Passwords do not match');
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (values.password !== values.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/auth/register', {
                username: values.username,
                email: values.email,
                password: values.password
            })
            if(response.status === 201) {
                navigate('/login')
            }
        } catch(err) {
            if (err.response) {
                setError(err.response.data.message || 'Registration failed');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl'></div>
            </div>
            
            <div className='relative w-full max-w-md'>
                {/* Logo/Brand Section */}
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

                {/* Register Card */}
                <div className='bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8'>
                    <div className='text-center mb-6'>
                        <h2 className='text-2xl font-bold text-white mb-2'>Create Account</h2>
                        <p className='text-blue-100 text-sm'>Join BUSIT for seamless travel</p>
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
                    
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2">Username</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <svg className='h-5 w-5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder='Enter your username' 
                                    className='w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200' 
                                    name="username" 
                                    onChange={handleChanges}
                                    required
                                    pattern="^[a-zA-Z0-9_]{3,20}$"
                                    title="Username must be 3-20 characters long and can only contain letters, numbers, and underscores"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <svg className='h-5 w-5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                                    </svg>
                                </div>
                                <input 
                                    type="email" 
                                    placeholder='Enter your email' 
                                    className='w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200' 
                                    name="email" 
                                    onChange={handleChanges}
                                    required
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    title="Please enter a valid email address"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <svg className='h-5 w-5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    placeholder='Enter your password' 
                                    className='w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200' 
                                    name="password" 
                                    onChange={handleChanges}
                                    required
                                    minLength="6"
                                    title="Password must be at least 6 characters long"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100 mb-2">Confirm Password</label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <svg className='h-5 w-5 text-blue-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    placeholder='Confirm your password' 
                                    className={`w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 ${passwordError ? 'border-red-400' : ''}`}
                                    name="confirmPassword" 
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            {passwordError && (
                                <p className="text-red-300 text-sm mt-2 flex items-center">
                                    <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                    </svg>
                                    {passwordError}
                                </p>
                            )}
                        </div>
                        
                        <button 
                            type='submit' 
                            className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                            disabled={!!passwordError}
                        >
                            Create Account
                        </button>
                    </form>
                    
                    <div className='text-center mt-6'>
                        <p className='text-blue-100 text-sm'>
                            Already have an account? 
                            <Link to="/login" className="text-blue-300 hover:text-white font-medium ml-1 transition-colors duration-200">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
