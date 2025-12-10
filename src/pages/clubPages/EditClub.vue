<template>
    <div class="edit-club-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div v-if="loading" class="text-center my-5">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                    <div v-else class="card">
                        <div class="card-header">
                            <h2>
                                <i class="bi bi-pencil-square"></i>
                                Editar Club
                            </h2>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit">
                                <div class="mb-3">
                                    <label for="clubName" class="form-label">
                                        Nombre del Club
                                        <span class="required">*</span>
                                    </label>
                                    <input
                                        id="clubName"
                                        v-model="formData.club_name"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.club_name }"
                                        placeholder="Ej. Riders de Santo Domingo"
                                        maxlength="255"
                                    />
                                    <div v-if="errors.club_name" class="invalid-feedback">
                                        {{ errors.club_name }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="description" class="form-label">
                                        Descripción
                                        <span class="text-muted">(Opcional)</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        v-model="formData.description"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.description }"
                                        placeholder="Describe tu club..."
                                        rows="4"
                                        maxlength="1000"
                                    ></textarea>
                                    <small class="text-muted d-block mt-1">
                                        {{ formData.description.length }} / 1000 caracteres
                                    </small>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        {{ errors.description }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="clubLogo" class="form-label">
                                        Logo del Club
                                        <span class="text-muted">(Opcional)</span>
                                    </label>
                                    <div class="logo-upload-area">
                                        <div v-if="logoPreview" class="logo-preview">
                                            <img :src="logoPreview" alt="Club Logo" />
                                            <button
                                                @click="removeLogo"
                                                type="button"
                                                class="btn btn-sm btn-danger btn-remove-logo"
                                            >
                                                <i class="bi bi-x-circle"></i>
                                            </button>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <i class="bi bi-image"></i>
                                            <p>Arrastra tu logo o haz clic para seleccionar</p>
                                            <small class="text-muted">JPG, PNG, WEBP - Máx 5MB</small>
                                        </div>
                                        <input
                                            id="clubLogo"
                                            type="file"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.club_logo }"
                                            accept=".jpg,.jpeg,.png,.webp"
                                            @change="handleLogoUpload"
                                        />
                                    </div>
                                    <div v-if="errors.club_logo" class="invalid-feedback d-block">
                                        {{ errors.club_logo }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="form-check form-switch" style="gap: 5px; display: flex; align-items: center;">
                                        <input
                                            id="anyoneCanJoin"
                                            v-model="formData.anyone_can_join"
                                            type="checkbox"
                                            class="form-check-input"
                                        />
                                        <label for="anyoneCanJoin" class="form-check-label">
                                            Cualquiera puede unirse al club
                                        </label>
                                    </div>
                                    <small class="text-muted d-block mt-2">
                                        Si está deshabilitado, solo el administrador podrá aprobar miembros
                                    </small>
                                </div>

                                <div class="d-flex gap-2 mt-4">
                                    <router-link :to="{ name: 'ClubDetail', params: { id: clubId } }" class="btn btn-outline-secondary">
                                        <i class="bi bi-arrow-left"></i>
                                        Volver
                                    </router-link>
                                    <button type="submit" class="btn btn-primary mottos-btn" :disabled="submitting">
                                        <div v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></div>
                                        <i v-else class="bi bi-check-circle"></i>
                                        {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const clubId = ref(route.params.id);
const submitting = ref(false);
const loading = ref(false);
const logoPreview = ref(null);
const logoFile = ref(null);

const formData = reactive({
    club_name: '',
    description: '',
    anyone_can_join: true
});

const errors = reactive({});

const loadClubData = async () => {
    try {
        loading.value = true;
        const response = await api.get(`/api/clubs/${clubId.value}`);
        const club = response.data.club;

        formData.club_name = club.club_name;
        formData.description = club.description || '';
        formData.anyone_can_join = club.anyone_can_join;

        if (club.logo_url) {
            logoPreview.value = club.logo_url;
        }
    } catch (error) {
        console.error('Error loading club:', error);
        toast.error('Error al cargar los datos del club');
        router.push({ name: 'ClubList' });
    } finally {
        loading.value = false;
    }
};

const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            errors.club_logo = 'El archivo no puede superar 5MB';
            return;
        }

        logoFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            logoPreview.value = e.target?.result;
        };
        reader.readAsDataURL(file);
        errors.club_logo = '';
    }
};

const removeLogo = () => {
    logoFile.value = null;
    logoPreview.value = null;
    errors.club_logo = '';
};

const handleSubmit = async () => {
    try {
        submitting.value = true;
        errors.value = {};

        const payload = new FormData();
        payload.append('club_name', formData.club_name);
        payload.append('description', formData.description);
        payload.append('anyone_can_join', formData.anyone_can_join ? 'true' : 'false');
        
        if (logoFile.value) {
            payload.append('club_logo', logoFile.value);
        }

        await api.put(`/api/clubs/${clubId.value}`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success('¡Club actualizado exitosamente!');
        router.push({ name: 'ClubDetail', params: { id: clubId.value } });
    } catch (error) {
        console.error('Error updating club:', error);

        if (error.response?.data?.errors) {
            Object.assign(errors, error.response.data.errors);
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('Error al actualizar el club');
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    loadClubData();
});
</script>

<style scoped>
.edit-club-page {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

.card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: none;
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    padding: 1.5rem;
}

.card-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #212529;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.required {
    color: #dc3545;
}

.logo-upload-area {
    position: relative;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.logo-upload-area:hover {
    border-color: #B70000;
    background-color: #fff5f5;
}

.logo-preview {
    position: relative;
    display: inline-block;
}

.logo-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
}

.btn-remove-logo {
    position: absolute;
    top: -10px;
    right: -10px;
}

.upload-placeholder {
    color: #6c757d;
}

.upload-placeholder i {
    font-size: 2.5rem;
    color: #dee2e6;
    display: block;
    margin-bottom: 0.5rem;
}

.upload-placeholder p {
    margin: 0.5rem 0 0 0;
    font-weight: 500;
}

.logo-upload-area input[type="file"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.form-switch .form-check-input {
    width: 3rem;
    height: 1.5rem;
    cursor: pointer;
}

.form-switch .form-check-input:checked {
    background-color: #B70000;
    border-color: #B70000;
}

.d-flex {
    display: flex;
}

.gap-2 {
    gap: 0.5rem;
}

.mt-4 {
    margin-top: 1.5rem;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
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
    .edit-club-page {
        padding: 1rem 0.5rem;
    }

    .card-header h2 {
        font-size: 1.25rem;
    }
}
</style>