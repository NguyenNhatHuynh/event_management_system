// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/App.css';
import ClientNavbar from './components/ClientNavbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/client/Home';
import About from './pages/client/About';
import EventTypes from './pages/client/EventTypes';
import Portfolio from './pages/client/Portfolio';
import ProjectDetail from './pages/client/ProjectDetail';
import Contact from './pages/client/Contact';
import Blog from './pages/client/Blog';
import Login from './pages/client/Login';
import CustomerAccount from './pages/client/CustomerAccount';
import Dashboard from './pages/admin/Dashboard';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventTypes from './pages/admin/AdminEventTypes';
import AdminBlogs from './pages/admin/Blogs';
import AdminContacts from './pages/admin/Contacts';
import AdminBookings from './pages/admin/Bookings';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

function App() {
    return (
        <Router>
            <Routes>
                {/* Các route cho client */}
                <Route
                    element={
                        <>
                            <ClientNavbar />
                            <Outlet />
                            <Footer />
                        </>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/event-types" element={<EventTypes />} />
                    <Route path="/event-types/:typeCode" element={<EventTypes />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/:id" element={<ProjectDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/account"
                        element={
                            <PrivateRoute>
                                <CustomerAccount />
                            </PrivateRoute>
                        }
                    />
                </Route>

                {/* Các route cho admin */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute adminOnly={true}>
                            <AdminLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<CustomerManagement />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="event-types" element={<AdminEventTypes />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="contacts" element={<AdminContacts />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="profile" element={<AdminProfile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;