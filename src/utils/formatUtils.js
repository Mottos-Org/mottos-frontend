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
