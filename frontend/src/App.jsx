import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './components/Notification'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import CustomerDashboard from './pages/customer/Dashboard'
import OrderService from './pages/customer/OrderService'
import CustomerHistory from './pages/customer/History'
import CustomerWarranty from './pages/customer/Warranty'

import TechnicianDashboard from './pages/technician/Dashboard'
import TechnicianOrders from './pages/technician/Orders'
import TechnicianProfile from './pages/technician/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import OrderManagement from './pages/admin/OrderManagement'
import AdminComplaints from './pages/admin/Complaints'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/order" element={<ProtectedRoute allowedRoles={['customer']}><OrderService /></ProtectedRoute>} />
            <Route path="/customer/history" element={<ProtectedRoute allowedRoles={['customer']}><CustomerHistory /></ProtectedRoute>} />
            <Route path="/customer/warranty" element={<ProtectedRoute allowedRoles={['customer']}><CustomerWarranty /></ProtectedRoute>} />

            <Route path="/technician/dashboard" element={<ProtectedRoute allowedRoles={['technician']}><TechnicianDashboard /></ProtectedRoute>} />
            <Route path="/technician/orders" element={<ProtectedRoute allowedRoles={['technician']}><TechnicianOrders /></ProtectedRoute>} />
            <Route path="/technician/profile" element={<ProtectedRoute allowedRoles={['technician']}><TechnicianProfile /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><OrderManagement /></ProtectedRoute>} />
            <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><AdminComplaints /></ProtectedRoute>} />

            <Route path="*" element={<Home />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
