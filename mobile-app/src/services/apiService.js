import axios from 'axios';

// For Android emulator, use 10.0.2.2. For iOS emulator, use localhost.
// Use the actual IP address of the development machine for physical device network testing
const API_BASE_URL = 'http://192.168.0.102:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

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
        const response = await api.get('/water');
        return response.data;
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
