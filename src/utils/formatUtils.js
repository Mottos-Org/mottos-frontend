/**
 * Display validation errors from an API response using toast notifications
 * @param {Object} toast - Toast notification instance
 * @param {Object} errorResponse - Error response object from API
 */
export function showValidationErrors(toast, errorResponse) {
    if (errorResponse?.errors) {
        Object.values(errorResponse.errors).forEach((msgs) => {
            msgs.forEach((msg) => toast.error(msg));
        });
    } else if (errorResponse?.message) {
        toast.error(errorResponse.message);
    } else {
        toast.error('Ha ocurrido un error, por favor intenta de nuevo más tarde.');
    }
}

/**
 * Format a phone number to (XXX) XXX-XXXX
 * @param {string} phone - Raw phone number string
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');

    if (cleaned.length === 10) {
        const part1 = cleaned.slice(0, 3);
        const part2 = cleaned.slice(3, 6);
        const part3 = cleaned.slice(6);
        return `(${part1}) ${part2}-${part3}`;
    }

    return phone;
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format a join date to show only month and year
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long'
    });
};

/**
 * Format a location address object into a readable string
 * @param {Object} address - Address object with sector, municipio, provincia, pais
 * @returns {string} Formatted location string
 */
export const formatLocation = (address) => {
  const parts = [];

  if (address.sector) parts.push(address.sector.nombre_sector);
  if (address.municipio) parts.push(address.municipio.nombre_municipio);
  if (address.provincia) parts.push(address.provincia.nombre_provincia);
  if (address.pais) parts.push(address.pais.nombre_pais);

  return parts.length > 0 ? parts.join(', ') : 'República Dominicana';
};