export function showValidationErrors(toast, errorResponse) {
    if (errorResponse?.errors) {
        Object.values(errorResponse.errors).forEach((msgs) => {
            msgs.forEach((msg) => toast.error(msg));
        });
    } else if (errorResponse?.message) {
        toast.error(errorResponse.message);
    } else {
        toast.error('Ha ocurrido un error inesperado.');
    }
}
