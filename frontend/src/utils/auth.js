import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const loginUser = async (credentials) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };
        
        const response = await axios.post(`${API_URL}/login`, credentials, config);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error.response?.data || { message: 'Network error occurred' };
    }
};