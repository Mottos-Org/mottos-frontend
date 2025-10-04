<template>
    <div class="admin-pending-posts">
        <!-- Recent Activity Section -->
        <div class="recent-activity-section mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="fw-bold text-danger mb-0">
                    <i class="bi bi-clock-history me-2"></i>
                    Actividad Reciente
                </h2>
                <span class="badge bg-primary">{{ recentApprovals.length }} acciones</span>
            </div>
            
            <div v-if="loadingRecent" class="text-center py-4">
                <span class="spinner-border spinner-border-sm text-primary"></span>
                <span class="ms-2 text-muted">Cargando actividad...</span>
            </div>

            <div v-else-if="recentApprovals.length === 0" class="empty-state-small">
                <i class="bi bi-inbox text-muted"></i>
                <p class="text-muted mb-0">No hay actividad reciente</p>
            </div>

            <div v-else class="activity-list">
                <div 
                    v-for="activity in recentApprovals" 
                    :key="activity.comment_id" 
                    class="activity-item"
                    @click="goToPost(activity.publicacion_id)"
                >
                    <div class="activity-avatar">
                        <img
                            v-if="activity.admin?.profile?.foto_perfil_url"
                            :src="activity.admin.profile.foto_perfil_url"
                            :alt="`${activity.admin.nombres} ${activity.admin.apellidos}`"
                            class="avatar-img"
                        />
                        <span v-else class="avatar-initials">
                            {{ getInitials(activity.admin.nombres, activity.admin.apellidos) }}
                        </span>
                    </div>
                    <div class="activity-content">
                        <div class="activity-header">
                            <span class="activity-author">{{ activity.admin.nombres }} {{ activity.admin.apellidos }}</span>
                            <span class="activity-action" :class="`action-${activity.comment_type}`">
                                <i :class="getActionIcon(activity.comment_type)"></i>
                                {{ getActionLabel(activity.comment_type) }}
                            </span>
                        </div>
                        <p class="activity-comment">{{ activity.comment }}</p>
                        <span class="activity-date">{{ formatDate(activity.created_at) }}</span>
                    </div>
                    <i class="bi bi-chevron-right activity-arrow"></i>
                </div>
            </div>
        </div>

        <!-- Pending Posts Section -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-danger mb-0">
                <i class="bi bi-hourglass-split me-2"></i>
                Publicaciones Pendientes de Aprobación
            </h2>
            <span class="badge bg-danger fs-6">{{ paginationData?.total || 0 }} pendientes</span>
        </div>

        <LoadingStates v-if="loading && publicaciones.length === 0" type="initial" />

        <div v-if="!loading && publicaciones.length === 0" class="empty-state">
            <div class="empty-icon mb-3">
                <i class="bi bi-hourglass-split"></i>
            </div>
            <h5>No hay publicaciones pendientes</h5>
            <p class="text-muted">¡Buen trabajo! No hay publicaciones esperando aprobación.</p>
        </div>

        <div v-if="publicaciones.length > 0" class="publications-list-horizontal" ref="scrollContainer"
            @scroll="handleScroll">
            <transition-group name="fade" tag="div" class="d-flex flex-row gap-3">
                <AdminPublicacionCard v-for="publicacion in publicaciones" :key="publicacion.publicacion_id"
                    :publicacion="publicacion" />
            </transition-group>
            <div v-if="loadingMore" class="loading-more-indicator d-flex align-items-center justify-content-center">
                <span class="spinner-border text-danger" style="width: 2rem; height: 2rem;"></span>
            </div>
        </div>

        <!-- Approved Posts Section -->
        <div class="approved-section mt-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold text-danger mb-0">
                    <i class="bi bi-check-circle me-2"></i>
                    Publicaciones Aprobadas
                </h2>
                <span class="badge bg-success fs-6">{{ approvedPaginationData?.total || 0 }} aprobadas</span>
            </div>

            <LoadingStates v-if="loadingApproved && approvedPublicaciones.length === 0" type="initial" />

            <div v-if="!loadingApproved && approvedPublicaciones.length === 0" class="empty-state">
                <div class="empty-icon mb-3">
                    <i class="bi bi-check-circle"></i>
                </div>
                <h5>No hay publicaciones aprobadas</h5>
                <p class="text-muted">Las publicaciones aprobadas aparecerán aquí.</p>
            </div>

            <div v-if="approvedPublicaciones.length > 0" class="publications-list-horizontal" ref="approvedScrollContainer"
                @scroll="handleApprovedScroll">
                <transition-group name="fade" tag="div" class="d-flex flex-row gap-3">
                    <AdminPublicacionCard v-for="publicacion in approvedPublicaciones" :key="publicacion.publicacion_id"
                        :publicacion="publicacion" />
                </transition-group>
                <div v-if="loadingMoreApproved" class="loading-more-indicator d-flex align-items-center justify-content-center">
                    <span class="spinner-border text-success" style="width: 2rem; height: 2rem;"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import AdminPublicacionCard from '../../components/ui/posts/AdminPublicacionCard.vue';
import LoadingStates from '@/components/ui/posts/LoadingStates.vue';

const router = useRouter();

const publicaciones = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const paginationData = ref(null);

const approvedPublicaciones = ref([]);
const loadingApproved = ref(false);
const loadingMoreApproved = ref(false);
const approvedPaginationData = ref(null);

const recentApprovals = ref([]);
const loadingRecent = ref(false);

const filters = ref({
    exclude_approved: 1,
    per_page: 12,
    page: 1
});

const approvedFilters = ref({
    approved_only: 1,
    per_page: 12,
    page: 1
});

const scrollContainer = ref(null);
const approvedScrollContainer = ref(null);

const hasMorePages = computed(() => {
    return paginationData.value && paginationData.value.current_page < paginationData.value.last_page;
});

const hasMoreApprovedPages = computed(() => {
    return approvedPaginationData.value && approvedPaginationData.value.current_page < approvedPaginationData.value.last_page;
});

const fetchRecentApprovals = async () => {
    loadingRecent.value = true;
    try {
        const response = await api.get('/api/publicaciones/recent-approvals?comment_type=approval&per_page=5');
        recentApprovals.value = response.data.data;
    } catch (error) {
        console.error('Error fetching recent approvals:', error);
    } finally {
        loadingRecent.value = false;
    }
};

const fetchPublicaciones = async (append = false) => {
    try {
        if (!append) {
            loading.value = true;
            publicaciones.value = [];
        } else {
            loadingMore.value = true;
        }

        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params.append(key, value);
            }
        });
        console.log('Fetching publicaciones with params:', params.toString());

        const response = await api.get(`/api/publicaciones?${params.toString()}`);

        if (append) {
            publicaciones.value.push(...response.data.data);
        } else {
            publicaciones.value = response.data.data;
        }

        paginationData.value = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total,
            from: response.data.from,
            to: response.data.to
        };
    } catch (error) {
        console.error('Error fetching pending posts:', error);
    } finally {
        loading.value = false;
        loadingMore.value = false;
    }
};

const fetchApprovedPublicaciones = async (append = false) => {
    try {
        if (!append) {
            loadingApproved.value = true;
            approvedPublicaciones.value = [];
        } else {
            loadingMoreApproved.value = true;
        }

        const params = new URLSearchParams();
        Object.entries(approvedFilters.value).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        const response = await api.get(`/api/publicaciones?${params.toString()}`);

        if (append) {
            approvedPublicaciones.value.push(...response.data.data);
        } else {
            approvedPublicaciones.value = response.data.data;
        }

        approvedPaginationData.value = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total,
            from: response.data.from,
            to: response.data.to
        };
    } catch (error) {
        console.error('Error fetching approved posts:', error);
    } finally {
        loadingApproved.value = false;
        loadingMoreApproved.value = false;
    }
};

const loadMore = async () => {
    if (hasMorePages.value && !loadingMore.value) {
        filters.value.page++;
        await fetchPublicaciones(true);
    }
};

const loadMoreApproved = async () => {
    if (hasMoreApprovedPages.value && !loadingMoreApproved.value) {
        approvedFilters.value.page++;
        await fetchApprovedPublicaciones(true);
    }
};

function handleScroll() {
    const el = scrollContainer.value;
    if (!el || loadingMore.value || !hasMorePages.value) return;
    // If scrolled to within 200px of the right end, load more
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 200) {
        loadMore();
    }
}

function handleApprovedScroll() {
    const el = approvedScrollContainer.value;
    if (!el || loadingMoreApproved.value || !hasMoreApprovedPages.value) return;
    // If scrolled to within 200px of the right end, load more
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 200) {
        loadMoreApproved();
    }
}

function goToPost(publicacionId) {
    router.push(`/auth/admin/publicaciones/approve/${publicacionId}`);
}

function getInitials(nombres, apellidos) {
    const first = nombres?.trim()?.charAt(0).toUpperCase() || '';
    const last = apellidos?.trim()?.charAt(0).toUpperCase() || '';
    return first + last;
}

function getActionIcon(type) {
    switch (type) {
        case 'approval':
            return 'bi bi-check-circle-fill';
        case 'rejection':
            return 'bi bi-x-circle-fill';
        case 'documentation':
            return 'bi bi-file-text-fill';
        default:
            return 'bi bi-chat-fill';
    }
}

function getActionLabel(type) {
    switch (type) {
        case 'approval':
            return 'Aprobó';
        case 'rejection':
            return 'Rechazó';
        case 'documentation':
            return 'Documentó';
        default:
            return 'Comentó';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short' });
}

onMounted(async () => {
    await Promise.all([
        fetchRecentApprovals(),
        fetchPublicaciones(),
        fetchApprovedPublicaciones()
    ]);
    
    await nextTick();
    
    if (
        scrollContainer.value &&
        scrollContainer.value.scrollWidth <= scrollContainer.value.clientWidth &&
        hasMorePages.value
    ) {
        loadMore();
    }
    
    if (
        approvedScrollContainer.value &&
        approvedScrollContainer.value.scrollWidth <= approvedScrollContainer.value.clientWidth &&
        hasMoreApprovedPages.value
    ) {
        loadMoreApproved();
    }
});
</script>

<style scoped>
.admin-pending-posts {
    padding: 10px;
}

/* Recent Activity Section */
.recent-activity-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.activity-item:hover {
    background: #e9ecef;
    transform: translateX(4px);
}

.activity-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
}

.activity-content {
    flex: 1;
    min-width: 0;
    text-align: left;
}

.activity-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.activity-author {
    font-weight: 600;
    color: #212529;
    font-size: 0.95rem;
}

.activity-action {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-weight: 600;
}

.action-approval {
    background: #d1fae5;
    color: #065f46;
}

.action-rejection {
    background: #fee2e2;
    color: #991b1b;
}

.action-documentation {
    background: #dbeafe;
    color: #1e40af;
}

.activity-comment {
    font-size: 0.9rem;
    color: #6c757d;
    margin: 0.25rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.activity-date {
    font-size: 0.8rem;
    color: #adb5bd;
}

.activity-arrow {
    color: #adb5bd;
    font-size: 1.2rem;
}

.empty-state-small {
    text-align: center;
    padding: 2rem;
    color: #adb5bd;
}

.empty-state-small i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* Existing styles */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

.empty-icon i {
    font-size: 3rem;
    color: #e9ecef;
}

.publications-list-horizontal {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-x: auto;
    padding: 1rem 0;
    scroll-behavior: smooth;
    min-height: 260px;
}

.loading-more-indicator {
    min-width: 120px;
}

.approved-section {
    border-top: 2px solid #e9ecef;
    padding-top: 2rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>