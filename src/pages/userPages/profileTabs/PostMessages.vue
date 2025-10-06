<template>
    <div class="chat-main-layout">
        <div v-if="!selectedChat" class="chat-list">
            <div v-if="loading" class="loader-container">
                <pulse-loader :loading="loading" color="#d63636" size="15px" />
            </div>

            <div v-else-if="conversations.length > 0">
                <div class="header-section">
                    <h4>Mensajes de Publicaciones</h4>
                    <p class="text-muted" style="color: white">
                        Conversaciones sobre tus anuncios
                    </p>
                </div>

                <div class="search-bar">
                    <i class="bi bi-search search-icon"></i>
                    <input type="text" v-model="searchQuery" placeholder="Buscar conversaciones..." class="search-input" />
                    <pulse-loader v-if="loadingSearch" color="#d63636" size="8px" />
                </div>

                <div v-if="filteredConversations.length > 0" class="conversations-list">
                    <div 
                        v-for="chat in filteredConversations" 
                        :key="`${chat.post_id}-${chat.user_id}`" 
                        class="chat-item"
                        :class="{ active: selectedChat && selectedChat.post_id === chat.post_id && selectedChat.user_id === chat.user_id }" 
                        @click="selectChat(chat)"
                    >
                        <div class="avatar-container">
                            <img 
                                :src="chat.foto_perfil_url || '/default_profile_pic.png'" 
                                alt="Profile" 
                                class="user-avatar" 
                                @error="(e) => e.target.src = '/default_profile_pic.png'"
                            />
                            <div v-if="chat.unread_count > 0" class="online-dot"></div>
                        </div>
                        
                        <div class="chat-content">
                            <div class="chat-top">
                                <div class="name-time">
                                    <span class="user-name">{{ chat.nombres }} {{ chat.apellidos }}</span>
                                    <span class="message-time">{{ formatTimestamp(chat.timestamp) }}</span>
                                </div>
                            </div>
                            
                            <div class="post-section">
                                <div v-if="chat.post_featured_image_url" class="post-image-wrapper">
                                    <img 
                                        :src="chat.post_featured_image_url" 
                                        alt="Post" 
                                        class="post-image"
                                        @error="(e) => e.target.style.display = 'none'"
                                    />
                                </div>
                                <div class="post-text">
                                    <span class="post-tag">Publicación</span>
                                    <p class="post-desc">{{ truncateMessage(chat.post_description, 50) }}</p>
                                </div>
                            </div>

                            <div class="message-preview">
                                <i v-if="chat.last_message_sender_id === currentUserId" class="bi bi-check-all message-icon sent"></i>
                                <i v-else class="bi bi-reply message-icon received"></i>
                                <span class="message-text">{{ truncateMessage(chat.last_message, 40) }}</span>
                                <span v-if="chat.unread_count > 0" class="badge-unread">{{ chat.unread_count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <i class="bi bi-search"></i>
                    <p>No se encontraron conversaciones</p>
                </div>
            </div>

            <div v-else class="empty-state">
                <i class="bi bi-chat-dots"></i>
                <p>No tienes conversaciones aún</p>
                <span class="empty-subtitle">Tus mensajes aparecerán aquí</span>
            </div>
        </div>

        <div v-else class="chat-content">
            <div class="chat-header-selected">
                <button class="back-button" @click="selectedChat = null">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <div class="header-info">
                    <img
                        :src="selectedChat.foto_perfil_url || '/default_profile_pic.png'" 
                        alt="Profile" 
                        class="header-avatar" 
                        @error="(e) => e.target.src = '/default_profile_pic.png'" 
                    />
                    <div class="header-text">
                        <h4>{{ selectedChat.nombres }} {{ selectedChat.apellidos }}</h4>
                        <p class="header-subtitle">
                            <i class="bi bi-box-seam"></i>
                            {{ truncateMessage(selectedChat.post_description, 35) }}
                        </p>
                    </div>
                </div>
                <img
                    v-if="selectedChat.post_featured_image_url"
                    :src="selectedChat.post_featured_image_url" 
                    alt="Post" 
                    class="header-post-thumb"
                    @error="(e) => e.target.style.display = 'none'"
                />
            </div>

            <PostChatView 
                :post-id="selectedChat.post_id"
                :recipient-id="selectedChat.user_id" 
                :current-user-id="currentUserId"
                :chat-data="selectedChat"
                :key="`${selectedChat.post_id}-${selectedChat.user_id}`" 
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import PostChatView from './PostChatView.vue';

const authStore = useAuthStore();
const conversations = ref([]);
const selectedChat = ref(null);
const loading = ref(true);
const searchQuery = ref('');
const debouncedQuery = ref('');
const loadingSearch = ref(false);
const API_BASE_URL = import.meta.env.VITE_API_URL;

const currentUserId = computed(() => Number(authStore.userId));

async function fetchChats() {
    loading.value = true;
    try {
        const response = await api.get(`${API_BASE_URL}/api/posts/messages/chats`);
        conversations.value = response.data;
    } catch (error) {
        console.error('Error fetching post chats:', error);
    } finally {
        loading.value = false;
    }
}

const filteredConversations = computed(() => {
    if (!debouncedQuery.value) return conversations.value;
    const query = debouncedQuery.value.toLowerCase();
    return conversations.value.filter(chat =>
        chat.nombres.toLowerCase().includes(query) ||
        chat.apellidos.toLowerCase().includes(query) ||
        chat.post_description.toLowerCase().includes(query)
    );
});

// Debounce logic for search
watch(searchQuery, (newQuery) => {
    loadingSearch.value = true;
    clearTimeout(searchQuery._timeout);
    searchQuery._timeout = setTimeout(() => {
        debouncedQuery.value = newQuery;
        loadingSearch.value = false;
    }, 300);
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
        return 'Ayer';
    } else {
        return date.toLocaleDateString('es-DO', { month: 'short', day: 'numeric' });
    }
}

function truncateMessage(message, length = 30) {
    if (!message) return '';
    return message.length > length ? message.substring(0, length - 3) + '...' : message;
}

function selectChat(chat) {
    selectedChat.value = chat;
}

function listenForNewMessages() {
    if (!window.Echo) {
        console.error('Echo is not initialized');
        return;
    }

    window.Echo.private(`user.${currentUserId.value}`).listen('.post.message.received', (event) => {
        console.log('New post message received:', event);
        
        const conversationIndex = conversations.value.findIndex(
            c => c.post_id === event.postId && c.user_id === event.fromUserId
        );
        
        if (conversationIndex !== -1) {
            conversations.value[conversationIndex].last_message = event.message;
            conversations.value[conversationIndex].timestamp = event.createdAt;
            conversations.value[conversationIndex].last_message_sender_id = event.fromUserId;
            
            if (!selectedChat.value || 
                selectedChat.value.post_id !== event.postId || 
                selectedChat.value.user_id !== event.fromUserId) {
                conversations.value[conversationIndex].unread_count++;
            }
            
            const updated = conversations.value.splice(conversationIndex, 1)[0];
            conversations.value.unshift(updated);
        } else {
            fetchChats();
        }
    });
}

onMounted(() => {
    fetchChats();
    listenForNewMessages();
});
</script>

<style scoped>
.chat-main-layout {
    display: flex;
    flex-direction: column;
    height: 850px;
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chat-list {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.header-section {
    padding: 20px;
    background: linear-gradient(135deg, #d63636 0%, #b82828 100%);
    color: white;
}

.header-section h4 {
    margin: 0 0 4px 0;
    font-size: 20px;
    font-weight: 700;
    text-align: left;
}

.header-section .text-muted {
    margin: 0;
    text-align: left;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9) !important;
}

.search-bar {
    position: relative;
    padding: 12px 16px;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-icon {
    color: #9ca3af;
    font-size: 16px;
}

.search-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: white;
    color: #111827;
    font-size: 14px;
    transition: border-color 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #d63636;
}

.conversations-list {
    overflow-y: auto;
    flex: 1;
}

.chat-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
}

.chat-item:hover {
    background-color: #f9fafb;
}

.chat-item.active {
    background-color: #fef2f2;
    border-left: 3px solid #d63636;
}

.avatar-container {
    position: relative;
    flex-shrink: 0;
}

.user-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.online-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background-color: #10b981;
    border-radius: 50%;
    border: 2px solid white;
}

.chat-content {
    flex: 1;
    min-width: 0;
}

.chat-top {
    margin-bottom: 8px;
}

.name-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.user-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    text-align: left;
}

.message-time {
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
}

.post-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 8px;
}

.post-image-wrapper {
    flex-shrink: 0;
    width: 70px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    background: #e5e7eb;
}

.post-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-text {
    flex: 1;
    min-width: 0;
    text-align: left;
}

.post-tag {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #d63636;
    background: #fee2e2;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
}

.post-desc {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.message-preview {
    display: flex;
    align-items: center;
    gap: 6px;
}

.message-icon {
    font-size: 14px;
    flex-shrink: 0;
}

.message-icon.sent {
    color: #10b981;
}

.message-icon.received {
    color: #6b7280;
}

.message-text {
    flex: 1;
    font-size: 14px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
}

.badge-unread {
    min-width: 24px;
    height: 24px;
    background: #d63636;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    flex-shrink: 0;
}

.chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chat-header-selected {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
}

.back-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #f3f4f6;
    color: #d63636;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.back-button:hover {
    background: #e5e7eb;
    transform: scale(1.05);
}

.header-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.header-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}

.header-text {
    flex: 1;
    min-width: 0;
    text-align: left;
}

.header-text h4 {
    margin: 0 0 2px 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
}

.header-subtitle {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
}

.header-subtitle i {
    font-size: 12px;
}

.header-post-thumb {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #9ca3af;
}

.empty-state i {
    font-size: 64px;
    margin-bottom: 16px;
    color: #d1d5db;
}

.empty-state p {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
}

.empty-subtitle {
    font-size: 14px;
    color: #9ca3af;
}
</style>