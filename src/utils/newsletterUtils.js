import api from '../services/api';

/**
 * Get user details by user ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} User details
 */
export const getUserDetails = async (userId) => {
    try {
        const response = await api.get(`/api/users/detail/${userId}`);
        return response.data.user;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

/**
 * Check newsletter subscription status
 * @param {string} email - User email
 * @returns {Promise<Object>} Subscription status
 */
export const checkNewsletterStatus = async (email) => {
    try {
        const response = await api.post('/api/newsletter/status', { email });
        return response.data;
    } catch (error) {
        console.error('Error checking subscription status:', error);
        throw error;
    }
};

/**
 * Subscribe to newsletter
 * @param {string} email - User email
 * @returns {Promise<Object>} Subscription response
 */
export const subscribeToNewsletter = async (email) => {
    try {
        const response = await api.post('/api/newsletter/signup/', { email });
        return response.data;
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        throw error;
    }
};

/**
 * Opt out from newsletter
 * @param {string} email - User email
 * @returns {Promise<Object>} Opt out response
 */
export const optOutFromNewsletter = async (email) => {
    try {
        const response = await api.post('/api/newsletter/optout/', { email });
        return response.data;
    } catch (error) {
        console.error('Error opting out of newsletter:', error);
        throw error;
    }
};

/**
 * Format date string to localized format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatSubscriptionDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Newsletter error messages mapping
 */
export const NEWSLETTER_ERRORS = {
    INVALID_EMAIL: 'Por favor, ingresa un correo electrónico válido',
    SUBSCRIPTION_ERROR: 'Error al suscribirse. Inténtalo de nuevo.',
    UNSUBSCRIBE_ERROR: 'Error al desuscribirse. Inténtalo de nuevo.',
    FETCH_USER_ERROR: 'Error al obtener información del usuario',
    CHECK_STATUS_ERROR: 'Error al verificar el estado de suscripción'
};

/**
 * Newsletter success messages
 */
export const NEWSLETTER_SUCCESS = {
    SUBSCRIBED: '¡Te has suscrito exitosamente al boletín!',
    UNSUBSCRIBED: 'Te has desuscrito exitosamente del boletín.',
    ALREADY_SUBSCRIBED: 'Este correo ya está suscrito al boletín.'
};