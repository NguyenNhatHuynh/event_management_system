import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getCustomers = () => axios.get(`${API_URL}/customers`);
export const createCustomer = (data) => axios.post(`${API_URL}/customers`, data);

export const getEventTypes = () => axios.get(`${API_URL}/event-types`);
export const createEventType = (data) => axios.post(`${API_URL}/event-types`, data);

export const getContracts = () => axios.get(`${API_URL}/contracts`);
export const createContract = (data) => axios.post(`${API_URL}/contracts`, data);

export const loginCustomer = (data) => axios.post(`${API_URL}/auth/customer/login`, data);
export const loginAdmin = (data) => axios.post(`${API_URL}/auth/admin/login`, data);