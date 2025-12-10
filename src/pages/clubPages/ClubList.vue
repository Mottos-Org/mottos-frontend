<template>
    <div class="club-list-page">
        <div class="container-lg">
            <ClubList
                :per-page="15"
                @join-club="onJoinClub"
                @view-details="onViewDetails"
            />
        </div>
    </div>
</template>

<script setup>
import ClubList from '@/components/ui/clubs/ClubList.vue';

const onJoinClub = (club) => {
    // TODO: Implement join club logic
    console.log('User wants to join club:', club);
};

const onViewDetails = (club) => {
    // TODO: Navigate to club detail page
    console.log('User wants to view club details:', club);
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

@media (max-width: 768px) {
    .club-list-page {
        padding: 1rem 0.5rem;
    }
}
</style>