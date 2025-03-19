import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/App.css';
import ClientNavbar from './components/ClientNavbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Home from './pages/client/Home';
import About from './pages/client/About';
import EventTypes from './pages/client/EventTypes';
import Portfolio from './pages/client/Portfolio';
import Contact from './pages/client/Contact';
import Blog from './pages/client/Blog';
import Login from './pages/client/Login';
import CustomerAccount from './pages/client/CustomerAccount';
import Dashboard from './pages/admin/Dashboard';
import CustomerManagement from './pages/admin/CustomerManagement';

function App() {
    const isAdminRoute = window.location.pathname.startsWith('/admin');

    return (
        <Router>
            {isAdminRoute ? <AdminNavbar /> : <ClientNavbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/event-types" element={<EventTypes />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<CustomerAccount />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/customers" element={<CustomerManagement />} />
            </Routes>
            {!isAdminRoute && <Footer />}
        </Router>
    );
}

export default App;