import api from "../services/api";


export function updateUserSettings(userId, settingsPayload) {
    return api.put(`/api/users/${userId}/update/settings`, settingsPayload)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating user settings:", error);
            throw error;
        });
}


export function updateUserProfile(userId, formData) {
    return api.post(`/api/users/${userId}/update/profile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => response.data)
    .catch(error => {
        console.error("Error updating user profile:", error);
        throw error;
    });
}