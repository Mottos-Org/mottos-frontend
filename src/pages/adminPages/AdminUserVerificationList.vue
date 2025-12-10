<template>
    <div class="admin-verification-page">
        <!-- Header -->
        <div class="page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="fw-bold text-danger mb-2">
                        <i class="bi bi-shield-check me-2"></i>
                        Autorización de Documentos
                    </h1>
                    <p class="text-muted mb-0">Revisa y aprueba/rechaza verificaciones de identidad</p>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats-row mb-4">
            <div class="stat-card">
                <div class="stat-icon pending">
                    <i class="bi bi-hourglass-split"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ stats.total_pending }}</div>
                    <div class="stat-label">Pendientes</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon verified">
                    <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ stats.total_with_email_verified }}</div>
                    <div class="stat-label">Email Verificado</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon unverified">
                    <i class="bi bi-exclamation-circle"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value">{{ stats.total_without_email_verified }}</div>
                    <div class="stat-label">Email No Verificado</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters-section mb-4">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control"
                            placeholder="Buscar por nombre o email..."
                            @input="debouncedSearch"
                        />
                    </div>
                </div>
                <div class="col-md-4">
                    <select v-model="emailVerifiedFilter" class="form-select">
                        <option value="">Estado de Email</option>
                        <option value="true">Email Verificado</option>
                        <option value="false">Email No Verificado</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <button @click="loadVerifications" class="btn btn-outline-secondary w-100">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Recargar
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && verifications.length === 0" class="text-center py-5">
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted mt-3">Cargando verificaciones...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && verifications.length === 0" class="empty-state">
            <div class="empty-icon mb-3">
                <i class="bi bi-shield-check"></i>
            </div>
            <h5>No hay verificaciones pendientes</h5>
            <p class="text-muted">¡Excelente! Todas las verificaciones han sido procesadas.</p>
        </div>

        <!-- Verifications List -->
        <div v-else class="verifications-container">
            <transition-group name="fade" tag="div" class="verifications-grid">
                <div
                    v-for="verification in verifications"
                    :key="verification.verification_id"
                    class="verification-card"
                    @click="selectVerification(verification)"
                    :class="{ active: selectedVerificationId === verification.verification_id }"
                >
                    <div class="card-header">
                        <div class="user-info">
                            <div class="avatar">
                                <span>{{ getInitials(verification.user_info.nombres, verification.user_info.apellidos) }}</span>
                            </div>
                            <div class="user-details">
                                <h6>{{ verification.user_info.full_name }}</h6>
                                <small class="text-muted">{{ verification.user_info.email }}</small>
                            </div>
                        </div>
                        <span
                            v-if="verification.verification_info.email_verified"
                            class="badge bg-success"
                        >
                            <i class="bi bi-check-circle me-1"></i>
                            Email Verificado
                        </span>
                        <span v-else class="badge bg-warning">
                            <i class="bi bi-exclamation-circle me-1"></i>
                            Email Pendiente
                        </span>
                    </div>

                    <div class="card-body">
                        <div class="document-type">
                            <span class="badge bg-light text-dark">
                                <i class="bi bi-card-text me-1"></i>
                                {{ verification.user_info.tipo_documento_identidad || 'Documento' }}
                            </span>
                        </div>
                        <div class="verification-date">
                            <small class="text-muted">
                                <i class="bi bi-calendar-event me-1"></i>
                                {{ verification.verification_info.uploaded_at_formatted }}
                            </small>
                        </div>
                    </div>

                    <div class="card-action">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Pagination -->
        <div v-if="verifications.length > 0 && pagination.total > pagination.per_page" class="pagination-container mt-4">
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="currentPage--">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    <li
                        v-for="page in visiblePages"
                        :key="page"
                        class="page-item"
                        :class="{ active: page === currentPage }"
                    >
                        <button class="page-link" @click="currentPage = page">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: !pagination.has_more_pages }">
                        <button class="page-link" @click="currentPage++">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Detail Modal/Drawer -->
        <div
            v-if="selectedVerification"
            class="verification-detail-panel"
            :class="{ show: showDetailPanel }"
        >
            <AdminUserVerificationDetail
                :verification="selectedVerification"
                @close="showDetailPanel = false"
                @approve="handleApprove"
                @reject="handleReject"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import AdminUserVerificationDetail from './AdminUserVerificationDetail.vue';

const toast = useToast();

const verifications = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const searchQuery = ref('');
const emailVerifiedFilter = ref('');
const pagination = ref({});
const stats = ref({});
const selectedVerificationId = ref(null);
const selectedVerification = ref(null);
const showDetailPanel = ref(false);
let searchTimeout;

const visiblePages = computed(() => {
    const total = pagination.value.last_page || 1;
    const current = currentPage.value;
    const pages = [];
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
        pages.push(i);
    }
    return pages;
});

const getInitials = (nombres, apellidos) => {
    const first = nombres?.[0] || '';
    const last = apellidos?.[0] || '';
    return (first + last).toUpperCase();
};

const debouncedSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        loadVerifications();
    }, 500);
};

const loadVerifications = async () => {
    try {
        loading.value = true;
        const params = {
            page: currentPage.value,
            search: searchQuery.value || undefined,
            email_verified: emailVerifiedFilter.value || undefined
        };

        const response = await api.get('/api/admin/documento/pending/', { params });
        verifications.value = response.data.pending_verifications;
        pagination.value = response.data.pagination;
        stats.value = response.data.summary_stats;
    } catch (error) {
        console.error('Error loading verifications:', error);
        toast.error('Error al cargar las verificaciones');
    } finally {
        loading.value = false;
    }
};

const selectVerification = (verification) => {
    selectedVerificationId.value = verification.verification_id;
    selectedVerification.value = verification;
    showDetailPanel.value = true;
};

const handleApprove = async (verificationId) => {
    try {
        console.log('Approving verification ID:', verificationId);
        const verification = verifications.value.find(v => v.verification_id === verificationId);
        if (!verification) return;

        await api.post('/api/admin/documento/approve/', {
            user_id: verification.user_id,
            approved: true
        });

        toast.success('Documento aprobado exitosamente');
        showDetailPanel.value = false;
        selectedVerification.value = null;
        selectedVerificationId.value = null;
        await loadVerifications();
    } catch (error) {
        console.error('Error approving verification:', error);
        toast.error('Error al aprobar el documento');
    }
};

const handleReject = async (payload) => {
    try {
        const { verificationId, reason } = payload;
        const verification = verifications.value.find(v => v.verification_id === verificationId);
        if (!verification) return;

        await api.post('/api/admin/documento/approve/', {
            user_id: verification.user_id,
            approved: false,
            rejection_reason: reason
        });

        toast.success('Documento rechazado');
        showDetailPanel.value = false;
        selectedVerification.value = null;
        selectedVerificationId.value = null;
        await loadVerifications();
    } catch (error) {
        console.error('Error rejecting verification:', error);
        toast.error('Error al rechazar el documento');
    }
};

watch(currentPage, () => {
    loadVerifications();
});

watch(() => emailVerifiedFilter.value, () => {
    currentPage.value = 1;
    loadVerifications();
});

onMounted(() => {
    loadVerifications();
});
</script>

<style scoped>
.admin-verification-page {
    padding: 2rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 2rem;
    color: #212529;
}

/* Stats */
.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.stat-icon.pending {
    background: linear-gradient(135deg, #ff9500 0%, #ff6b6b 100%);
}

.stat-icon.verified {
    background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
}

.stat-icon.unverified {
    background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #212529;
}

.stat-label {
    font-size: 0.85rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

/* Filters */
.filters-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.input-group-text {
    background: transparent;
    border-color: #dee2e6;
    color: #6c757d;
}

.form-control,
.form-select {
    border-color: #dee2e6;
}

.form-control:focus,
.form-select:focus {
    border-color: #B70000;
    box-shadow: 0 0 0 0.2rem rgba(183, 0, 0, 0.25);
}

/* Verifications Grid */
.verifications-container {
    margin-top: 2rem;
}

.verifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.verification-card {
    background: white;
    border-radius: 8px;
    border: 2px solid #e9ecef;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.verification-card:hover {
    border-color: #B70000;
    box-shadow: 0 4px 12px rgba(183, 0, 0, 0.15);
    transform: translateY(-4px);
}

.verification-card.active {
    border-color: #B70000;
    background: #fff5f5;
}

.card-header {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
}

.user-details h6 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #212529;
}

.user-details small {
    display: block;
    font-size: 0.8rem;
}

.card-body {
    padding: 1rem;
    flex: 1;
}

.document-type {
    margin-bottom: 0.75rem;
}

.document-type .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
}

.verification-date {
    margin-top: 0.75rem;
}

.card-action {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    color: #B70000;
    opacity: 0;
    transition: all 0.3s ease;
}

.verification-card:hover .card-action {
    opacity: 1;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 3rem;
    color: #dee2e6;
}

.empty-state h5 {
    color: #212529;
    margin: 1rem 0 0.5rem 0;
}

.empty-state p {
    margin: 0;
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: center;
}

.pagination .page-link {
    color: #B70000;
    border-color: #dee2e6;
}

.pagination .page-link:hover:not(.disabled) {
    color: #fff;
    background-color: #B70000;
    border-color: #B70000;
}

.pagination .page-item.active .page-link {
    background-color: #B70000;
    border-color: #B70000;
}

/* Detail Panel */
.verification-detail-panel {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    max-width: 500px;
    height: 100vh;
    background: white;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
    transition: right 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
}

.verification-detail-panel.show {
    right: 0;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

@media (max-width: 768px) {
    .admin-verification-page {
        padding: 1rem 0.5rem;
    }

    .stats-row {
        grid-template-columns: 1fr;
    }

    .verifications-grid {
        grid-template-columns: 1fr;
    }

    .verification-detail-panel {
        max-width: 100%;
    }

    .filters-section .row {
        flex-direction: column;
    }
}
</style>