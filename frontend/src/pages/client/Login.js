import React, { useState } from 'react';
import { loginCustomer } from '../../services/api';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginCustomer(formData)
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                window.location.href = '/account';
            })
            .catch((error) => alert('Login failed'));
    };

    return (
        <div className="container">
            <h1 className="my-4">Customer Login</h1>
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;