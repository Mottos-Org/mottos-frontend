<template>
    <div class="chat-main-layout">
        <div v-if="!selectedChatId" class="chat-list">
            <div v-if="loading" class="loader-container">
                <pulse-loader :loading="loading" color="#d63636" size="15px" />
            </div>

            <div v-else-if="conversations.length > 0" class="conversations-list">
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <h4 style="text-align: left;">Chats</h4>
                    <p class="text-muted" style="margin-top: -7.5px; text-align: left; margin-bottom: 0px;">Responde a
                        tus chats con otros usuarios...</p>
                </div>

                <div class="search-bar">
                    <input type="text" v-model="searchQuery" placeholder="Buscar chats..." class="search-input" />
                    <pulse-loader v-if="loadingSearch" color="#d63636" size="10px" />
                </div>

                <div v-if="filteredConversations.length > 0" class="conversations-list">
                    <div v-for="chat in filteredConversations" :key="chat.user_id" class="chat-item"
                        :class="{ active: selectedChatId === chat.user_id }" @click="selectChat(chat.user_id)">
                        <div class="avatar">
                            <img :src="chat.foto_perfil_url" alt="Profile" class="profile-pic" />
                        </div>
                        <div class="chat-info">
                            <div class="chat-header">
                                <span class="chat-name">{{ chat.nombres }}</span>
                                <span class="chat-time">{{ formatTimestamp(chat.timestamp) }}</span>
                            </div>
                            <div class="chat-preview">
                                <span class="last-message">{{ truncateMessage(chat.last_message) }}</span>
                                <span v-if="chat.unread_count > 0" class="unread-count">
                                    {{ chat.unread_count }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-conversations">
                    <p>No se encontraron chats con el parámetro de búsqueda asignado.</p>
                </div>
            </div>

            <div v-else class="empty-conversations">
                <p>No tienes conversaciones.</p>
            </div>
        </div>

        <div v-else class="chat-content">
            <div class="chat-header-selected">
                <button class="back-button" @click="selectedChatId = null">
                    <i class="fas fa-arrow-left"></i> Atrás
                </button>
                <div class="chat-user-details">
                    <h4>{{ getSelectedChatName() }}</h4>
                    <img v-if="conversations.find(c => c.user_id === selectedChatId)?.foto_perfil_url"
                        :src="conversations.find(c => c.user_id === selectedChatId)?.foto_perfil_url" alt="Profile"
                        class="profile-pic" style="height: 55px; width: 55px;" />
                </div>
            </div>

            <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 30 }"
                :transition="{ duration: 0.5 }">
                <ChatView :recipient-id="selectedChatId" :currentUserId="Number(authStore.userId)" :chat-user="conversations.find(c => c.user_id === selectedChatId)"
                    :key="selectedChatId" />
            </motion.div>
        </div>
    </div>
</template>

<script setup>
import { motion } from 'motion-v';
import { ref, onMounted, computed, watch } from 'vue';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import ChatView from './ChatView.vue';

const authStore = useAuthStore();
const conversations = ref([]);
const selectedChatId = ref(null);
const loading = ref(true);
const searchQuery = ref('');
const debouncedQuery = ref('');
const loadingSearch = ref(false);
const API_BASE_URL = import.meta.env.VITE_API_URL;

async function fetchChats() {
    loading.value = true;
    try {
        const response = await api.get(`${API_BASE_URL}/api/chat-users`);
        conversations.value = response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
    } finally {
        loading.value = false;
    }
}

const filteredConversations = computed(() => {
    if (!debouncedQuery.value) return conversations.value;
    return conversations.value.filter(chat =>
        chat.nombres.toLowerCase().includes(debouncedQuery.value.toLowerCase())
    );
});

// Debounce logic for search
watch(searchQuery, (newQuery) => {
    loadingSearch.value = true;
    clearTimeout(searchQuery._timeout);
    searchQuery._timeout = setTimeout(() => {
        debouncedQuery.value = newQuery;
        loadingSearch.value = false;
    }, 300); // 300ms debounce delay
});

function formatTimestamp(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

function truncateMessage(message) {
    if (!message) return '';
    return message.length > 30 ? message.substring(0, 27) + '...' : message;
}

function selectChat(chatId) {
    selectedChatId.value = chatId;
}

function getSelectedChatName() {
    if (!selectedChatId.value) return '';
    const chat = conversations.value.find(c => c.user_id === selectedChatId.value);
    return chat ? chat.nombres : '';
}

onMounted(() => {
    fetchChats();
});
</script>

<style scoped>
.chat-main-layout {
    display: flex;
    flex-direction: column;
    height: 850px;
    width: 100%;
    margin: 0 auto;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.chat-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #fff;
}

.search-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    background-color: white;
    color: #111827;
    font-size: 14px;
}

.chat-user-details {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 25px;
}

.conversations-list {
    /* flex: 1; */
    overflow-y: scroll;
    max-height: 825px;
}

.chat-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.3s;
    padding: 18px;
}

.chat-item:hover {
    background-color: #f3f4f6;
}

.chat-item.active {
    background-color: #e5e7eb;
}

.avatar {
    margin-right: 10px;
}

.profile-pic {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    object-fit: cover;
}

.chat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-left: 15px;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
}

.chat-name {
    font-weight: 600;
    font-size: 15px;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chat-time {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    margin-left: 10px;
}

.chat-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.last-message {
    font-size: 14px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.unread-count {
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #d63636;
    color: white;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    margin-left: 8px;
}

.chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: fit-content;
}

.chat-header-selected {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
    justify-content: space-between;
}

.back-button {
    background-color: white;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    padding: 10px 15px;
    color: #d63636;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
}

.back-button:hover {
    transform: scale(1.1);
    background-color: #f3f4f6;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.empty-conversations {
    padding: 20px;
    text-align: center;
    color: #6b7280;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>