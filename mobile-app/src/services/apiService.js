import axios from 'axios';

// For Android emulator, use 10.0.2.2. For iOS emulator, use localhost.
// Use the actual IP address of the development machine for physical device network testing
const API_BASE_URL = 'http://192.168.0.101:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const getParkingStatus = async () => {
    try {
        const response = await api.get('/parking');
        return response.data;
    } catch (error) {
        console.error('Error fetching parking status:', error);
        throw error;
    }
};

export const getWaterLevels = async () => {
    try {
        const response = await api.get('/admin/infra');
        return response.data.water;
    } catch (error) {
        console.error('Error fetching water levels:', error);
        throw error;
    }
};

export const getEnergyData = async () => {
    try {
        const response = await api.get('/energy');
        return response.data;
    } catch (error) {
        console.error('Error fetching energy data:', error);
        throw error;
    }
};

export const getSustainabilityData = async () => {
    try {
        const response = await api.get('/sustainability');
        return response.data;
    } catch (error) {
        console.error('Error fetching sustainability data:', error);
        throw error;
    }
};

export const getInfraStatus = async () => {
    try {
        const response = await api.get('/admin/infra');
        return response.data;
    } catch (error) {
        console.error('Error fetching infra status:', error);
        throw error;
    }
};
