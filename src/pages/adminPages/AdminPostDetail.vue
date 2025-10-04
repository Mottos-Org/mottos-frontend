<template>
    <div class="admin-post-detail">
        <!-- Back button and header -->
        <div class="header-section">
            <button class="back-btn" @click="$router.go(-1)">
                <i class="bi bi-arrow-left"></i>
                Volver
            </button>
            <div class="d-flex align-items-center justify-content-between mt-3 mb-2">
                <div class="d-flex align-items-center gap-3">
                    <h1 class="page-title mb-0">
                        <i class="bi bi-file-earmark-text me-2"></i>
                        Moderar Publicación
                    </h1>
                    <span v-if="postData && !postData.approved" class="status-badge status-pending">
                        <i class="bi bi-clock-history me-1"></i>
                        Pendiente de revisión
                    </span>
                    <span v-if="postData && postData.approved" class="status-badge status-approved">
                        <i class="bi bi-check-circle me-1"></i>
                        Aprobada
                    </span>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-outline-danger" @click="rejectPost">
                        <i class="bi bi-x-circle me-1"></i>
                        Rechazar
                    </button>
                    <button class="btn btn-success" @click="approvePost">
                        <i class="bi bi-check-circle me-1"></i>
                        Aprobar Publicación
                    </button>
                </div>
            </div>
            <p class="page-subtitle">
                Revisa los detalles de la publicación y los comentarios de moderación antes de tomar una decisión
            </p>
        </div>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else class="post-section">
            <PublicacionCard v-if="postData" :key="postData.publicacion_id" :publicacion="postData" />
            <div v-else class="alert alert-warning text-center" role="alert">
                No se encontraron detalles de la publicación.
            </div>
        </div>

        <div class="comments-section">
            <div class="comments-card">
                <div class="comments-header">
                    <i class="bi bi-chat-left-text"></i>
                    <div>
                        <h3 class="comments-title">Comentarios de Moderación</h3>
                        <p class="comments-subtitle">Comunicación interna entre administradores</p>
                    </div>
                </div>

                <!-- New Comment Form -->
                <form @submit.prevent="submitComment" class="new-comment-form">
                    <textarea
                        v-model="newComment"
                        class="comment-textarea"
                        rows="3"
                        placeholder="Escribe un comentario para otros administradores..."
                        :disabled="commentSubmitting"
                        maxlength="500"
                    ></textarea>
                    <div class="form-footer">
                        <select v-model="newCommentType" class="comment-type-select" :disabled="commentSubmitting">
                            <option value="general">General</option>
                            <option value="approval">Aprobación</option>
                            <option value="rejection">Rechazo</option>
                            <option value="documentation">Documentación</option>
                        </select>
                        <button
                            class="btn btn-send"
                            type="submit"
                            :disabled="commentSubmitting || !newComment.trim()"
                        >
                            <i class="bi bi-send me-2"></i>
                            Enviar Comentario
                        </button>
                    </div>
                </form>

                <!-- Comments counter -->
                <div v-if="comments.length > 0" class="comments-count">
                    {{ comments.length }} comentario{{ comments.length > 1 ? 's' : '' }}
                </div>

                <!-- Comments List -->
                <div v-if="comments.length === 0" class="no-comments">
                    No hay comentarios aún.
                </div>
                <ul v-else class="comments-list">
                    <li v-for="comment in comments" :key="comment.comment_id" class="comment-item">
                        <div class="comment-avatar">
                            <img
                                v-if="comment.admin?.profile?.foto_perfil_url"
                                :src="comment.admin.profile.foto_perfil_url"
                                :alt="`${comment.admin.nombres} ${comment.admin.apellidos}`"
                                class="avatar-img"
                                @error="onAvatarError($event, comment)"
                            />
                            <span v-else class="avatar-initials">
                                {{ getInitials(comment.admin.nombres, comment.admin.apellidos) }}
                            </span>
                        </div>
                        <div class="comment-content">
                            <div class="comment-meta">
                                <span class="comment-author">
                                    {{ comment.admin.nombres }} {{ comment.admin.apellidos }}
                                </span>
                                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                                <span
                                    class="comment-badge"
                                    :class="`badge-${comment.comment_type}`"
                                >
                                    {{ commentTypeLabel(comment.comment_type) }}
                                </span>
                            </div>
                            <p class="comment-text">{{ comment.comment }}</p>
                        </div>
                        <div v-if="comment.admin_user_id === currentAdminId" class="comment-actions">
                            <button class="action-btn edit-btn" @click="startEdit(comment)" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="action-btn delete-btn" @click="startDelete(comment)" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Edit/Delete Modal -->
        <teleport to="body">
            <transition name="fade-modal">
                <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
                    <div class="modal-box">
                        <div class="modal-icon">
                            <div class="icon-circle" :class="modalType === 'delete' ? 'icon-danger' : 'icon-primary'">
                                <i :class="modalType === 'edit' ? 'bi bi-pencil' : 'bi bi-trash'"></i>
                            </div>
                        </div>
                        <h4 class="modal-title">
                            {{ modalType === 'edit' ? 'Editar comentario' : 'Eliminar comentario' }}
                        </h4>
                        <div v-if="modalType === 'edit'" class="modal-body">
                            <textarea v-model="editCommentText" class="form-control mb-3" rows="3"></textarea>
                            <select v-model="editCommentType" class="form-select">
                                <option value="general">General</option>
                                <option value="approval">Aprobación</option>
                                <option value="rejection">Rechazo</option>
                                <option value="documentation">Documentación</option>
                            </select>
                        </div>
                        <p v-else class="modal-subtitle">
                            ¿Seguro que deseas eliminar este comentario? Esta acción no se puede deshacer.
                        </p>
                        <div class="modal-actions">
                            <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
                            <button
                                class="btn"
                                :class="modalType === 'edit' ? 'btn-primary' : 'btn-danger'"
                                @click="modalType === 'edit' ? saveEdit() : confirmDelete()"
                                :disabled="editSubmitting"
                            >
                                {{ modalType === 'edit' ? 'Guardar cambios' : 'Eliminar' }}
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>

        <teleport to="body">
    <transition name="fade-modal">
        <div v-if="showApprovalModal" class="modal-overlay" @click.self="closeApprovalModal">
            <div class="modal-box">
                <div class="modal-icon">
                    <div class="icon-circle" :class="approvalModalType === 'approve' ? 'icon-success' : 'icon-danger'">
                        <i :class="approvalModalType === 'approve' ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
                    </div>
                </div>
                <h4 class="modal-title">
                    {{ approvalModalType === 'approve' ? 'Aprobar Publicación' : 'Rechazar Publicación' }}
                </h4>
                <p class="modal-subtitle">
                    {{ approvalModalType === 'approve' 
                        ? 'Esta publicación será visible públicamente.' 
                        : 'Esta publicación será rechazada y no será visible.' 
                    }}
                </p>
                <div class="modal-body">
                    <label for="approval-comment" class="form-label fw-semibold mb-2">
                        Comentario de moderación <span class="text-danger">*</span>
                    </label>
                    <textarea 
                        id="approval-comment"
                        v-model="approvalComment" 
                        class="form-control" 
                        rows="4"
                        placeholder="Escribe el motivo de tu decisión..."
                        maxlength="500"
                    ></textarea>
                    <small class="text-muted d-block mt-1">
                        Este comentario quedará registrado en el historial de moderación.
                    </small>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="closeApprovalModal">Cancelar</button>
                    <button
                        class="btn"
                        :class="approvalModalType === 'approve' ? 'btn-success' : 'btn-danger'"
                        @click="confirmApproval"
                        :disabled="approvalSubmitting || !approvalComment.trim()"
                    >
                        <i :class="approvalModalType === 'approve' ? 'bi bi-check-circle me-2' : 'bi bi-x-circle me-2'"></i>
                        {{ approvalModalType === 'approve' ? 'Aprobar' : 'Rechazar' }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</teleport>
    </div>
</template>

<script setup>
import api from '@/services/api';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '../../utils/formatUtils';
import { useToast } from 'vue-toastification';
import PublicacionCard from '../../components/ui/posts/PublicacionCard.vue';

const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(false);
const postData = ref(null);
const postId = computed(() => route.params.id);
const currentAdminId = computed(() => Number(authStore.userId));

const comments = ref([]);
const loadingComments = ref(false);
const commentSubmitting = ref(false);
const newComment = ref('');
const newCommentType = ref('general');

const showModal = ref(false);
const modalType = ref('edit');
const editingComment = ref(null);
const editCommentText = ref('');
const editCommentType = ref('general');
const editSubmitting = ref(false);

const showApprovalModal = ref(false);
const approvalModalType = ref('approve'); // 'approve' or 'reject'
const approvalComment = ref('');
const approvalSubmitting = ref(false);

const fetchPostDetails = async () => {
    try {
        const response = await api.get(`/api/publicaciones/details/${route.params.id}`);
        postData.value = response.data.post;
    } catch (error) {
        console.error('Error fetching post details:', error);
        if (error.response?.status === 404) {
            toast.error('Publicación no encontrada');
        } else {
            toast.error('Error al cargar la publicación');
        }
    }
};

const fetchComments = async () => {
    loadingComments.value = true;
    try {
        const { data } = await api.get(`/api/publicaciones/${postId.value}/comments`);
        comments.value = data.data;
    } catch (e) {
        toast.error('Error al cargar los comentarios');
    } finally {
        loadingComments.value = false;
    }
};

const submitComment = async () => {
    if (!newComment.value.trim()) return;
    commentSubmitting.value = true;
    try {
        await api.post(`/api/publicaciones/${postId.value}/comments`, {
            comment: newComment.value,
            comment_type: newCommentType.value
        });
        newComment.value = '';
        newCommentType.value = 'general';
        await fetchComments();
        toast.success('Comentario agregado');
    } catch (e) {
        toast.error('Error al agregar el comentario');
    } finally {
        commentSubmitting.value = false;
    }
};

function startEdit(comment) {
    editingComment.value = comment;
    editCommentText.value = comment.comment;
    editCommentType.value = comment.comment_type;
    modalType.value = 'edit';
    showModal.value = true;
}

function startDelete(comment) {
    editingComment.value = comment;
    modalType.value = 'delete';
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    editingComment.value = null;
    editCommentText.value = '';
    editCommentType.value = 'general';
}

const saveEdit = async () => {
    if (!editingComment.value) return;
    editSubmitting.value = true;
    try {
        await api.put(`/api/publicaciones/approval-comments/${editingComment.value.comment_id}`, {
            comment: editCommentText.value,
            comment_type: editCommentType.value
        });
        await fetchComments();
        toast.success('Comentario actualizado');
        closeModal();
    } catch (e) {
        toast.error('Error al actualizar el comentario');
    } finally {
        editSubmitting.value = false;
    }
};

const confirmDelete = async () => {
    if (!editingComment.value) return;
    editSubmitting.value = true;
    try {
        await api.delete(`/api/publicaciones/approval-comments/${editingComment.value.comment_id}`);
        await fetchComments();
        toast.success('Comentario eliminado');
        closeModal();
    } catch (e) {
        toast.error('Error al eliminar el comentario');
    } finally {
        editSubmitting.value = false;
    }
};

const approvePost = () => {
    approvalModalType.value = 'approve';
    approvalComment.value = '';
    showApprovalModal.value = true;
};

const rejectPost = () => {
    approvalModalType.value = 'reject';
    approvalComment.value = '';
    showApprovalModal.value = true;
};

const closeApprovalModal = () => {
    showApprovalModal.value = false;
    approvalComment.value = '';
};

const confirmApproval = async () => {
    if (!approvalComment.value.trim()) {
        toast.error('Por favor, escribe un comentario de moderación');
        return;
    }

    approvalSubmitting.value = true;
    try {
        const isApproved = approvalModalType.value === 'approve';
        
        await api.put(`/api/publicaciones/${postId.value}/approve`, {
            approved: isApproved,
            comment: approvalComment.value
        });

        toast.success(
            isApproved 
                ? 'Publicación aprobada exitosamente' 
                : 'Publicación rechazada'
        );
        
        closeApprovalModal();
        
        // Refresh post details and comments
        await fetchPostDetails();
        await fetchComments(1, false);
        
        // Optionally navigate back to the moderation list
        // router.push('/auth/admin/publicaciones/pendientes');
    } catch (e) {
        console.error('Error updating approval status:', e);
        toast.error('Error al actualizar el estado de la publicación');
    } finally {
        approvalSubmitting.value = false;
    }
};

onMounted(async () => {
    try {
        loading.value = true;
        await fetchPostDetails();
        await fetchComments();
    } catch (error) {
        console.error('Error en onMounted:', error);
        toast.error('Error inesperado al cargar la publicación');
    } finally {
        loading.value = false;
    }
});

function getInitials(nombres, apellidos) {
    const first = nombres?.trim()?.charAt(0).toUpperCase() || '';
    const last = apellidos?.trim()?.charAt(0).toUpperCase() || '';
    return first + last;
}

function onAvatarError(event, comment) {
    event.target.style.display = 'none';
}

function commentTypeLabel(type) {
    switch (type) {
        case 'approval':
            return 'Aprobación';
        case 'rejection':
            return 'Rechazo';
        case 'documentation':
            return 'Documentación';
        default:
            return 'General';
    }
}
</script>

<style scoped>
.admin-post-detail {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1.5rem;
}

/* Header Section */
.header-section {
    margin-bottom: 2rem;
}

.back-btn {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 0.95rem;
    padding: 0.5rem 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
}

.back-btn:hover {
    color: #111827;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
}

.page-subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
    text-align: left;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
}

.status-pending {
    background: #fef3c7;
    color: #92400e;
}

.status-approved {
    background: #d1fae5;
    color: #065f46;
}

.action-buttons {
    display: flex;
    gap: 0.75rem;
}

.action-buttons .btn {
    font-weight: 600;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.post-section {
    margin-bottom: 2rem;
}

:deep(.publication-card) {
    max-width: 100% !important;
    width: 100% !important;
}

:deep(.publication-card .card-hero) {
    height: 480px;
}

.comments-section {
    background: #fef8f8;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-top: 2rem;
}

.comments-card {
    background: white;
    border-radius: 1rem;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comments-header {
    background: linear-gradient(135deg, #fef2f2 0%, #fff 100%);
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid #fee2e2;
}

.comments-header i {
    font-size: 1.75rem;
    color: #dc2626;
}

.comments-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
}

.comments-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
}

.new-comment-form {
    padding: 2rem;
    border-bottom: 1px solid #f3f4f6;
}

.comment-textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 0.95rem;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
    background: white;
    color: #374151;
}

.comment-textarea::placeholder {
    color: #9ca3af;
}

.comment-textarea:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    background: white;
}

.form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
}

.comment-type-select {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    min-width: 150px;
    color: black;
    background: white;
}

.btn-send {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    border: none;
    padding: 0.625rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-send:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(238, 90, 111, 0.3);
}

.btn-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.comments-count {
    padding: 1rem 2rem;
    font-size: 0.875rem;
    color: #6b7280;
    border-bottom: 1px solid #f3f4f6;
}

.no-comments {
    padding: 3rem 2rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.95rem;
}

.comments-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 450px;
    overflow-y: scroll;
}

.comment-item {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.2s;
}

.comment-item:hover {
    background: #fafafa;
}

.comment-item:last-child {
    border-bottom: none;
}

.comment-avatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    font-size: 1rem;
    font-weight: 700;
    color: #dc2626;
}

.comment-content {
    flex: 1;
    min-width: 0;
}

.comment-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}

.comment-author {
    font-weight: 600;
    color: #111827;
    font-size: 0.95rem;
}

.comment-date {
    font-size: 0.875rem;
    color: #9ca3af;
}

.comment-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-weight: 600;
}

.badge-general {
    background: #f3f4f6;
    color: #6b7280;
}

.badge-approval {
    background: #d1fae5;
    color: #065f46;
}

.badge-rejection {
    background: #fee2e2;
    color: #991b1b;
}

.badge-documentation {
    background: #dbeafe;
    color: #1e40af;
}

.comment-text {
    color: #374151;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
    word-wrap: break-word;
    text-align: left;
}

.comment-actions {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
}

.action-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.375rem;
    color: #6b7280;
    transition: background-color 0.2s, color 0.2s;
}

.action-btn:hover {
    background: #f3f4f6;
}

.edit-btn:hover {
    color: #2563eb;
}

.delete-btn:hover {
    color: #dc2626;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
}

.modal-box {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-icon {
    text-align: center;
    margin-bottom: 1rem;
}

.icon-circle {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.icon-primary {
    background: #dbeafe;
    color: #1e40af;
}

.icon-danger {
    background: #fee2e2;
    color: #dc2626;
}

.modal-title {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
}

.modal-subtitle {
    text-align: center;
    color: #6b7280;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
}

.modal-body {
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

.modal-actions .btn {
    padding: 0.625rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-secondary:hover {
    background: #f9fafb;
}

.btn-primary {
    background: #2563eb;
    border: none;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
}

.btn-danger {
    background: #dc2626;
    border: none;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #b91c1c;
}

.icon-success {
    background: #d1fae5;
    color: #065f46;
}

.btn-success {
    background: #10b981;
    border: none;
    color: white;
}

.btn-success:hover:not(:disabled) {
    background: #059669;
}

.form-label {
    font-size: 0.9rem;
    color: #374151;
}

/* Transitions */
.fade-modal-enter-active,
.fade-modal-leave-active {
    transition: opacity 0.3s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
    opacity: 0;
}

.fade-modal-enter-active .modal-box,
.fade-modal-leave-active .modal-box {
    transition: transform 0.3s ease;
}

.fade-modal-enter-from .modal-box,
.fade-modal-leave-to .modal-box {
    transform: scale(0.9);
}

@media (max-width: 768px) {
    .admin-post-detail {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .action-buttons {
        flex-direction: column;
        width: 100%;
    }

    .action-buttons .btn {
        width: 100%;
        justify-content: center;
    }

    .comments-section {
        padding: 1rem;
    }

    .comments-header,
    .new-comment-form,
    .comments-count,
    .comment-item {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .form-footer {
        flex-direction: column;
    }

    .comment-type-select,
    .btn-send {
        width: 100%;
    }

    .comment-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }
}
</style>