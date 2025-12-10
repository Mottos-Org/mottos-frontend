<template>
    <div class="club-list-page">
        <div class="container-lg">
            <div class="list-header">
                <h1>Clubes de Mottos</h1>
                <router-link to="/clubes/crear" class="btn btn-primary mottos-btn">
                    <i class="bi bi-plus-circle"></i>
                    Crear Club
                </router-link>
            </div>
            <ClubList
                :per-page="15"
                @join-club="onJoinClub"
                @view-details="onViewDetails"
            />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ClubList from '@/components/ui/clubs/ClubList.vue';

const router = useRouter();

const onJoinClub = (club) => {
    console.log('User wants to join club:', club);
};

const onViewDetails = (club) => {
    router.push({ name: 'ClubDetail', params: { id: club.club_id } });
};
</script>

<style scoped>
.club-list-page {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.container-lg {
    max-width: 1400px;
    margin: 0 auto;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.list-header h1 {
    margin: 0;
    font-size: 2rem;
    color: #212529;
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

@media (max-width: 768px) {
    .club-list-page {
        padding: 1rem 0.5rem;
    }

    .list-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .list-header h1 {
        font-size: 1.5rem;
    }
}
</style>