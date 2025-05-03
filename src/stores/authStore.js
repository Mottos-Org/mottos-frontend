import api from "../services/api";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        userId: localStorage.getItem("user_id") || null,
        access: localStorage.getItem("access_token") || null,
        // refresh: localStorage.getItem("refresh_token") || null,
        roles: JSON.parse(localStorage.getItem("roles") || "[]"),
        user: null,
    }),
    
    getters: {
        isLoggedIn: (state) => !!state.access,
    },
    
    actions: {
        setAuth({ user_id, access, roles }) {
            this.userId = user_id;
            this.access = access;
            // this.refresh = refresh;
            this.roles = roles;
            
            localStorage.setItem("access_token", access);
            // localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("roles", JSON.stringify(roles));
        },
        
        clearAuth() {
            this.userId = null;
            this.access = null;
            // this.refresh = null;
            this.roles = [];
            this.user = null;
            
            localStorage.removeItem("access_token");
            // localStorage.removeItem("refresh_token");
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
                throw err;
            }
        }
    },
});
