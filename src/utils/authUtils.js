import api from '../services/api';

async function fetchUserDetails(userId) {
    if (!userId) return null;

    try {
        const response = await api.get(`/api/users/detail/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}

async function fetchUserVerificationStatus(userId) {
    if (!userId) return null;

    try {
        const response = await api.get(`/api/users/${userId}/verification-status`);
        return response.data;
    } catch (error) {
        console.error('Error fetching verification status:', error);
        throw error;
    }
}

export default {
    fetchUserDetails,
    fetchUserVerificationStatus
};