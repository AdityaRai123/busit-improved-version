# 🚌 BUSIT - Bus Ticketing System

A modern, full-stack bus ticketing system built with **React + Node.js + MySQL** (MERN Stack), featuring beautiful UI design and comprehensive booking functionality.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Password Reset** via email with secure tokens
- **User Profile Management** with editable information
- **Protected Routes** with automatic redirects

### 🚌 Bus Booking System
- **Bus Search** with location-based filtering
- **Real-time Seat Selection** with visual seat map
- **Booking Management** with confirmation emails
- **Booking History** with status tracking
- **Booking Cancellation** functionality

### 🎨 Modern UI/UX
- **Beautiful Gradient Design** with glassmorphism effects
- **Responsive Layout** for all device sizes
- **Loading States** and error handling
- **Interactive Components** with smooth animations
- **Consistent Branding** throughout the application

### 🛠 Technical Features
- **MySQL Database** with optimized schema
- **RESTful API** with proper error handling
- **Input Validation** and security measures
- **Email Notifications** for password reset
- **JWT Token Management** for secure sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd full-stack
   ```

2. **Set up the database**
   ```bash
   # Import the database schema
   mysql -u your_username -p < server/database.sql
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=authentication
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

6. **Start the servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
full-stack/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # React components
│   │   │   ├── login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BusSearch.jsx
│   │   │   ├── BusBooking.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── BookingConfirmation.jsx
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
├── server/                   # Node.js backend
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication routes
│   │   └── busRoutes.js     # Bus booking routes
│   ├── lib/
│   │   └── db.js           # Database connection
│   ├── database.sql        # Database schema
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token

### Bus Management
- `GET /buses` - Get all buses
- `POST /buses/search` - Search buses by criteria
- `GET /buses/:id` - Get bus details
- `GET /buses/:id/seats` - Get available seats

### Booking Management
- `POST /buses/:id/book` - Create booking
- `GET /buses/my-bookings` - Get user's bookings
- `GET /buses/bookings/:id` - Get booking details
- `POST /buses/bookings/:id/cancel` - Cancel booking

## 🎨 UI Design Features

### Color Scheme
- **Primary Gradient**: Blue to Purple to Indigo
- **Success Colors**: Green tones
- **Error Colors**: Red tones
- **Warning Colors**: Yellow tones

### Design Elements
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adapts to different screen sizes
- **Icon Integration**: SVG icons throughout the interface
- **Typography**: Clean, modern font hierarchy

## 🔄 Changes from Original Repository

### Conversion from MongoDB to MySQL
- **Database Schema**: Converted MongoDB collections to MySQL tables
- **Query Language**: Changed from MongoDB queries to SQL
- **Relationships**: Implemented proper foreign key relationships
- **Indexing**: Added database indexes for better performance

### Frontend Enhancements
- **React Components**: Converted HTML templates to React components
- **State Management**: Implemented React hooks for state management
- **Routing**: Added React Router for navigation
- **API Integration**: Connected frontend to backend APIs

### Backend Improvements
- **Authentication**: Enhanced JWT-based authentication
- **Validation**: Added input validation middleware
- **Error Handling**: Improved error responses
- **Email Service**: Integrated nodemailer for password reset

### New Features Added
- **User Profile Management**: Edit username and view account details
- **Booking Confirmation**: Detailed booking confirmation page
- **Seat Selection**: Interactive seat selection interface
- **Booking History**: Complete booking management system
- **Password Reset**: Email-based password reset functionality

## 🛡 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📧 Email Configuration

The system uses Gmail SMTP for sending password reset emails. To configure:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update the email credentials in the server configuration

## 🚀 Deployment

### Backend Deployment
1. Set up a MySQL database
2. Configure environment variables
3. Deploy to your preferred hosting service (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original bus-it repository for inspiration
- VIT University for the bus ticketing concept
- React and Node.js communities for excellent documentation

---

**Your Journey, Our Priority** 🚌✨ 