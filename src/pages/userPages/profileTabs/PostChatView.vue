<template>
    <div class="chat-view-container">
        <div v-if="loading" class="loader-container" style="margin-top: 25px;">
            <pulse-loader :loading="loading" color="#d63636" size="15px" />
        </div>

        <div v-else class="messages-wrapper">
            <div class="messages-container" ref="messagesContainer">
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    class="message-group"
                    :class="messageClass(msg)"
                >
                    <div class="message">
                        <div class="message-content">
                            {{ msg.content }}
                        </div>
                        <div class="message-time">
                            {{ formatMessageTime(msg.created_at) }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="message-input-container">
                <div class="message-input-wrapper">
                    <input
                        v-model="newMessage"
                        placeholder="Enviar un mensaje"
                        class="message-input"
                        @keyup.enter="sendMessage"
                    />
                    <button class="send-button" @click="sendMessage">
                        <span v-if="!sending">✓</span>
                        <pulse-loader v-else :loading="sending" color="#fff" size="5px" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '../../../services/api';
import { ref, onMounted, nextTick, computed } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const props = defineProps({
    postId: {
        type: Number,
        required: true
    },
    recipientId: {
        type: Number,
        required: true
    },
    currentUserId: {
        type: Number,
        required: true
    },
    chatData: {
        type: Object,
        required: true
    }
});

const messages = ref([]);
const newMessage = ref('');
const loading = ref(true);
const sending = ref(false);
const messagesContainer = ref(null);
const API_BASE_URL = import.meta.env.VITE_API_URL;

async function fetchMessages() {
    if (!props.currentUserId) return;

    loading.value = true;
    try {
        const response = await api.get(
            `${API_BASE_URL}/api/posts/${props.postId}/messages/${props.recipientId}`
        );
        messages.value = response.data.messages;
        await scrollToBottom();
        
        // Mark messages as read
        await markAsRead();
    } catch (error) {
        console.error('Error fetching post messages:', error);
    } finally {
        loading.value = false;
    }
}

async function sendMessage() {
    if (!newMessage.value.trim()) return;

    sending.value = true;

    const tempMessage = {
        id: Date.now(),
        sender_id: props.currentUserId,
        receiver_id: props.recipientId,
        post_id: props.postId,
        content: newMessage.value,
        created_at: new Date().toISOString(),
    };

    messages.value.push(tempMessage);
    await scrollToBottom();

    try {
        await api.post(`${API_BASE_URL}/api/posts/${props.postId}/messages`, {
            to_user_id: props.recipientId,
            message: newMessage.value,
        });
        newMessage.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        messages.value = messages.value.filter(msg => msg.id !== tempMessage.id);
    } finally {
        sending.value = false;
    }
}

async function markAsRead() {
    try {
        await api.put(`${API_BASE_URL}/api/posts/${props.postId}/messages/read/`, {
            sender_id: props.recipientId
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

function listenForMessages() {
    if (!window.Echo) {
        console.error('Echo is not initialized');
        return;
    }

    window.Echo.private(`user.${props.currentUserId}`).listen('.post.message.received', (event) => {
        // Only add message if it's for this specific conversation
        if (event.postId === props.postId && event.fromUserId === props.recipientId) {
            const formattedMessage = {
                id: Date.now(),
                content: event.message,
                sender_id: event.fromUserId,
                receiver_id: event.toUserId,
                post_id: event.postId,
                created_at: event.createdAt,
                read_at: event.readAt,
            };

            messages.value.push(formattedMessage);
            scrollToBottom();
            
            // Mark as read since we're viewing the conversation
            markAsRead();
        }
    });
}

function formatMessageTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    return nextTick(() => {
        requestAnimationFrame(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        });
    });
}

const messageClass = computed(() => {
    return (msg) => {
        return msg.sender_id === props.currentUserId ? 'user-messages' : 'other-messages';
    };
});

onMounted(async () => {
    loading.value = true;

    scrollToBottom();

    while (!props.currentUserId) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    await fetchMessages();
    listenForMessages();
    loading.value = false;
});
</script>

<style scoped>
.chat-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 700px;
}

.messages-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #f9fafb;
    width: 100%;
    height: fit-content;
    min-height: 650px;
    max-height: 680px;
}

.message-group {
    display: flex;
    flex-direction: column;
    max-width: 70%;
}

.user-messages {
    align-self: flex-end;
}

.other-messages {
    align-self: flex-start;
}

.message {
    position: relative;
    min-width: 60px;
}

.user-messages .message-content {
    background-color: #d63636;
    color: white;
    border-radius: 18px 18px 4px 18px;
}

.other-messages .message-content {
    background-color: #e5e7eb;
    color: #111827;
    border-radius: 18px 18px 18px 4px;
}

.message-content {
    padding: 12px 16px;
    word-wrap: break-word;
}

.user-messages .message-time {
    text-align: right;
}

.other-messages .message-time {
    text-align: left;
}

.message-time {
    font-size: 11px;
    color: #6b7280;
    margin-top: 4px;
}

.message-input-container {
    padding: 15px;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    width: 100%;
}

.message-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.message-input {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    width: 100%;
    background-color: white;
    color: #111827;
}

.send-button {
    background-color: #d63636;
    color: white;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    transition: all 0.3s ease;
}

.send-button:hover {
    background-color: #8e1216;
    transform: scale(1.05);
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

@media (max-width: 480px) {
    .message-group {
        max-width: 85%;
    }
    
    .message-input-wrapper {
        gap: 5px;
    }
}
</style>