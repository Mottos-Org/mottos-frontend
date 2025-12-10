<template>
    <div class="club-detail-page">
        <div class="container-lg">
            <div v-if="loading" class="text-center my-5">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
            <div v-else-if="club" class="content">
                <div class="club-header">
                    <div class="header-top">
                        <div class="club-logo">
                            <img v-if="club.logo_url" :src="club.logo_url" :alt="club.club_name" />
                            <div v-else class="logo-placeholder">
                                <i class="bi bi-people-fill"></i>
                            </div>
                        </div>
                        <div class="club-info">
                            <h1>{{ club.club_name }}</h1>
                            <p class="club-handle">@{{ club.username || generateHandle(club.club_name) }}</p>
                            <p v-if="club.description" class="description">{{ club.description }}</p>
                        </div>
                        <div class="club-actions">
                            <router-link
                                v-if="club.is_admin"
                                :to="{ name: 'EditClub', params: { id: club.club_id } }"
                                class="btn btn-primary btn-edit mottos-btn"
                            >
                                Editar
                            </router-link>
                            <button
                                v-else-if="!club.is_member"
                                @click="joinClub"
                                class="btn btn-primary btn-join"
                                :disabled="joiningClub"
                            >
                                <div v-if="joiningClub" class="spinner-border spinner-border-sm me-2" role="status"></div>
                                <i v-else class="bi bi-plus-circle"></i>
                                Unirse
                            </button>
                        </div>
                    </div>

                    <div class="club-stats-row">
                        <div class="stat-item">
                            <strong>{{ club.member_count }}</strong>
                            <span>Miembros</span>
                        </div>
                        <div class="stat-item">
                            <strong>{{ club.founder.name }}</strong>
                            <span>Fundador</span>
                        </div>
                        <div class="stat-item">
                            <strong>{{ formatDate(club.founded_at) }}</strong>
                            <span>Fundado</span>
                        </div>
                    </div>
                </div>

                <div class="members-section">
                    <h3>
                        <i class="bi bi-people"></i>
                        Miembros del Club
                    </h3>
                    <div class="members-list">
                        <div v-for="member in club.members" :key="member.user_id" class="member-card">
                            <div class="member-avatar">
                                <img v-if="member.profile_pic" :src="member.profile_pic" :alt="member.name" />
                                <img v-else src="/default_profile_pic.png" :alt="member.name" />
                            </div>
                            <div class="member-info">
                                <h5>{{ member.name }}</h5>
                                <small v-if="member.is_admin" class="admin-badge">
                                    <i class="bi bi-shield-check"></i>
                                    Administrador
                                </small>
                                <small class="text-muted d-block">Miembro desde</small>
                                <small class="text-muted">{{ formatDate(member.joined_at) }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center my-5">
                <p class="text-muted">Club no encontrado</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const club = ref(null);
const loading = ref(false);
const joiningClub = ref(false);
const clubId = ref(route.params.id);

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const generateHandle = (clubName) => {
    return clubName.toLowerCase().replace(/\s+/g, '').substring(0, 20);
};

const loadClubData = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/clubs/${clubId.value}`);
        club.value = response.data.club;
    } catch (error) {
        console.error('Error loading club:', error);
        toast.error('Error al cargar el club');
        router.push({ name: 'ClubList' });
    } finally {
        loading.value = false;
    }
};

const joinClub = async () => {
    try {
        joiningClub.value = true;
        // TODO: Implement join club API call
        toast.success('¡Te has unido al club!');
        loadClubData();
    } catch (error) {
        console.error('Error joining club:', error);
        toast.error('Error al unirse al club');
    } finally {
        joiningClub.value = false;
    }
};

onMounted(() => {
    loadClubData();
});
</script>

<style scoped>
.club-detail-page {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: #f8f9fa;
}

.container-lg {
    max-width: 1200px;
    margin: 0 auto;
}

/* Header Section */
.club-header {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    margin-bottom: 2rem;
}

.header-top {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e9ecef;
}

.club-logo {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
}

.club-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
}

.logo-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
}

.club-info {
    flex: 1;
}

.club-info h1 {
    margin: 0 0 0.25rem 0;
    font-size: 2rem;
    font-weight: 700;
    color: #212529;
}

.club-handle {
    margin: 0 0 0.75rem 0;
    color: #6c757d;
    font-size: 0.95rem;
}

.club-info .description {
    color: #495057;
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
}

.club-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-edit,
.btn-join {
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: 500;
    white-space: nowrap;
}

/* Stats Row */
.club-stats-row {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-item strong {
    font-size: 1.1rem;
    color: #212529;
    font-weight: 600;
}

.stat-item span {
    font-size: 0.85rem;
    color: #6c757d;
}

/* Members Section */
.members-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 2rem;
}

.members-section h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    color: #212529;
}

.members-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.member-card {
    text-align: left;
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.member-card:hover {
    border-color: #B70000;
    box-shadow: 0 4px 12px rgba(183, 0, 0, 0.1);
}

.member-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
    background: #e9ecef;
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.member-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.member-info h5 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #212529;
}

.admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: #fff3cd;
    color: #856404;
    padding: 0.35rem 0.65rem;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    width: fit-content;
}

.member-info .text-muted {
    font-size: 0.8rem;
    color: #6c757d !important;
    margin: 0;
}

@media (max-width: 1024px) {
    .header-top {
        flex-direction: column;
        gap: 1.5rem;
    }

    .club-actions {
        width: 100%;
    }

    .btn-edit,
    .btn-join {
        flex: 1;
        text-align: center;
    }

    .members-list {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .club-detail-page {
        padding: 1rem 0.5rem;
    }

    .club-header {
        padding: 1.5rem;
    }

    .club-logo {
        width: 100px;
        height: 100px;
    }

    .club-info h1 {
        font-size: 1.5rem;
    }

    .club-stats-row {
        gap: 2rem;
    }

    .members-list {
        grid-template-columns: 1fr;
    }

    .members-section {
        padding: 1.5rem;
    }
}


.mottos-btn {
    background-color: #B70000;
    outline-color: #B70000;
    border-color: #B70000;
}

.mottos-btn:hover {
    background-color: #930000;
    outline-color: #930000;
    border-color: #930000;
}
</style>