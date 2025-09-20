import api from "../services/api";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

export const useAuthStore = defineStore("auth", {
    state: () => ({
        userId: localStorage.getItem("user_id") || null,
        access: localStorage.getItem("access_token") || null,
        roles: JSON.parse(localStorage.getItem("roles") || "[]"),
        user: null,
        verificationStatus: null,
    }),
    
    getters: {
        isLoggedIn: (state) => !!state.access,
        isFullyVerified: (state) => state.verificationStatus?.verification_status?.fully_verified || false,
        isEmailVerified: (state) => state.verificationStatus?.verification_status?.email_verified || false,
        isDocumentoVerified: (state) => state.verificationStatus?.verification_status?.documento_verified || false,
    },
    
    actions: {
        hasRole(role) {
            return this.roles.some(roleObj => roleObj.nombre_rol === role);
        },
        
        setAuth({ user_id, access, roles }) {
            this.userId = user_id;
            this.access = access;
            this.roles = roles;
            
            localStorage.setItem("access_token", access);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("roles", JSON.stringify(roles));
        },
        
        clearAuth() {
            this.userId = null;
            this.access = null;
            this.roles = [];
            this.user = null;
            this.verificationStatus = null;

            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("roles");
        },
        
        async fetchUserInfo() {
            const userId = localStorage.getItem("user_id");
            if (!userId) return null;
            
            try {
                const res = await api.get(`/api/users/detail/${userId}`);
                this.user = res.data;
            } catch (err) {
                console.error("Failed to fetch user details:", err);

                if (err.response?.status === 401) {
                    console.log("Token expired or invalid, logging out user");
                    
                    this.clearAuth();
                    toast.warning("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");

                    router.push({ name: "Login" });
                }

                throw err;
            }
        },

        async fetchVerificationStatus() {
            const userId = this.userId || localStorage.getItem("user_id");
            if (!userId) {
                console.warn("No user ID available for verification status check");
                return null;
            }
            
            try {
                const res = await api.get(`/api/users/${userId}/verification-status`);
                this.verificationStatus = res.data;
                return res.data;
            } catch (err) {
                console.error("Failed to fetch verification status:", err);

                if (err.response?.status === 401) {
                    console.log("Token expired or invalid, logging out user");
                    this.clearAuth();
                    toast.warning("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                    router.push({ name: "Login" });
                }

                throw err;
            }
        },
    },
});
