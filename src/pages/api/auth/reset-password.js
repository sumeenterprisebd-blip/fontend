import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://your-backend-url/api/auth/reset-password';
        const response = await axios.post(apiUrl, req.body, {
            headers: { 'Content-Type': 'application/json' },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'Server error' });
    }
}
