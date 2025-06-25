import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome to Our App</h1>
        
        <div className="space-y-4">
          <Link 
            to="/login" 
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </Link>
          
          <Link 
            to="/register" 
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Register
          </Link>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Choose an option to get started</p>
        </div>
      </div>
    </div>
  )
}

export default Home
