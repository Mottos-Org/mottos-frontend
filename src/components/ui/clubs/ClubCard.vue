<template>
    <div class="club-card">
        <!-- Header with logo/avatar -->
        <div class="card-header">
            <div class="club-logo">
                <img 
                    v-if="club.logo_url" 
                    :src="club.logo_url" 
                    :alt="club.club_name"
                    class="logo-img"
                />
                <div v-else class="logo-placeholder">
                    <i class="bi bi-people-fill"></i>
                </div>
            </div>
            <div v-if="club.anyone_can_join" class="join-badge">
                <i class="bi bi-unlock-fill"></i>
                Abierto
            </div>
        </div>

        <!-- Club info -->
        <div class="card-body">
            <h3 class="club-name">{{ club.club_name }}</h3>
            
            <p class="club-description">{{ club.description }}</p>

            <div class="club-meta">
                <div class="meta-item">
                    <i class="bi bi-people"></i>
                    <span>{{ club.member_count }} {{ club.member_count === 1 ? 'miembro' : 'miembros' }}</span>
                </div>
                <div class="meta-item">
                    <i class="bi bi-person-check"></i>
                    <span>Fundador: {{ club.founder.name }}</span>
                </div>
            </div>

            <div class="club-dates">
                <small class="date-item">
                    <i class="bi bi-calendar-event"></i>
                    Creado: {{ formatDate(club.created_at) }}
                </small>
            </div>
        </div>

        <!-- Actions -->
        <div class="card-footer">
            <button class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-info-circle"></i>
                Ver detalles
            </button>
            <button 
                v-if="club.anyone_can_join"
                class="btn btn-primary btn-sm"
                @click="handleJoin"
            >
                <i class="bi bi-plus-circle"></i>
                Unirse
            </button>
            <button 
                v-else
                class="btn btn-outline-secondary btn-sm"
                disabled
            >
                <i class="bi bi-lock-fill"></i>
                Privado
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    club: {
        type: Object,
        required: true,
        validator: (club) => {
            return club.club_id && club.club_name && club.founder;
        }
    }
});

const emit = defineEmits(['join', 'view-details']);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-DO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

const handleJoin = () => {
    emit('join', props.club);
};
</script>

<style scoped>
.club-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.club-card:hover {
    border-color: #dc3545;
    box-shadow: 0 8px 30px rgba(220, 53, 69, 0.15);
    transform: translateY(-4px);
}

.card-header {
    position: relative;
    height: 160px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e9ecef;
    padding: 1.5rem;
}

.club-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: white;
    border: 3px solid #dc3545;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logo-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #dc3545, #ff6b7a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
}

.join-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.join-badge i {
    font-size: 0.9rem;
}

.card-body {
    flex: 1;
    padding: 1.5rem;
}

.club-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.75rem 0;
    line-height: 1.3;
}

.club-description {
    color: #6c757d;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.club-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
    border-top: 1px solid #f1f3f4;
    border-bottom: 1px solid #f1f3f4;
    margin-bottom: 1rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: #495057;
    font-weight: 500;
}

.meta-item i {
    color: #dc3545;
    width: 18px;
    flex-shrink: 0;
}

.club-dates {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.date-item {
    color: #adb5bd;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.date-item i {
    font-size: 0.8rem;
    color: #dc3545;
}

.card-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 0.5rem;
}

.btn {
    flex: 1;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
}

.btn-primary {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn-primary:hover:not(:disabled) {
    background: #c82333;
    border-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border-color: #e9ecef;
}

.btn-outline-secondary:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #6c757d;
    color: #1a1a1a;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .club-card {
        border-radius: 12px;
    }

    .card-header {
        height: 140px;
        padding: 1rem;
    }

    .club-logo {
        width: 80px;
        height: 80px;
    }

    .club-name {
        font-size: 1.1rem;
    }

    .card-body {
        padding: 1rem;
    }

    .card-footer {
        flex-direction: column;
        padding: 1rem;
    }

    .btn {
        width: 100%;
    }
}
</style>