<template>
    <div class="content">
        <h4>Perfil</h4>
        <p class="text-muted" style="margin-top: -7.5px">Actualiza tu información aquí...</p>

        <form @submit.prevent="saveProfile" class="w-100">
            <div class="section" style="margin-top: 15px;">
                <h6>Información Personal</h6>

                <div class="form-group">
                    <label for="nombres">Nombres</label>
                    <input id="nombres" v-model="profileData.nombres" type="text" class="form-control" placeholder="Tu nombre" />
                </div>

                <div class="form-group">
                    <label for="apellidos">Apellidos</label>
                    <input id="apellidos" v-model="profileData.apellidos" type="text" class="form-control" placeholder="Tus apellidos" />
                </div>

                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input id="email" v-model="profileData.email" type="email" class="form-control" placeholder="tu@email.com" />
                </div>

                <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input id="telefono" v-model="profileData.telefono" type="text" class="form-control" placeholder="Número de teléfono" />
                </div>
            </div>

            <hr class="my-4" style="border: 1px solid grey;" />

            <div class="section">
                <h6>Documentación</h6>

                <div class="form-group">
                    <label for="documento_de_identidad">Documento de Identidad</label>
                    <input id="documento_de_identidad" v-model="profileData.documento_de_identidad" type="text" class="form-control" placeholder="Documento de identidad" />
                </div>

                <div class="form-group">
                    <label for="tipo_documento_identidad">Tipo de Documento</label>
                    <v-select
                        v-model="profileData.tipo_documento_identidad"
                        :options="tipoDocumentoOptions"
                        placeholder="Seleccionar tipo de documento"
                        class="w-100"
                    />
                </div>

                <div class="form-group">
                    <label for="foto_perfil">Cambiar Foto de Perfil</label>
                    <input id="foto_perfil" type="file" @change="handleFileUpload" class="form-control" accept="image/*" />
                </div>

                <div v-if="previewImage" class="preview">
                    <img :src="previewImage" alt="Vista previa de la imagen" class="img-preview" />
                </div>
            </div>

            <div class="btn-wrapper">
                <button type="submit" class="save-btn" :disabled="loading">
                    <div class="button-content">
                        <template v-if="loading">
                            <pulse-loader :loading="loading" color="#ffffff" size="15px" />
                        </template>
                        <template v-else>
                            <i class="bi bi-save me-2"></i>Guardar cambios
                        </template>
                    </div>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import vSelect from 'vue-select';
import { ref, onMounted } from 'vue';
import 'vue-select/dist/vue-select.css';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../../stores/authStore';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { showValidationErrors } from '../../../utils/formatUtils';
import { updateUserProfile } from '../../../controllers/userController';

const toast = useToast();
const auth = useAuthStore();
const loading = ref(false);
const tipoDocumentoOptions = ['Cédula', 'Pasaporte'];
const previewImage = ref(null);

const profileData = ref({
    user_id: null,
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    documento_de_identidad: '',
    tipo_documento_identidad: '',
    foto_perfil: null,
});

onMounted(() => {
    const user = auth.user;
    if (user && user.user && user.profile) {
        profileData.value = {
            user_id: user.user.user_id,
            nombres: user.user.nombres,
            apellidos: user.user.apellidos,
            email: user.user.email,
            telefono: user.user.telefono,
            documento_de_identidad: user.profile.documento_de_identidad,
            tipo_documento_identidad: user.profile.tipo_documento_identidad,
            foto_perfil: null,
        };
    }
});

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        profileData.value.foto_perfil = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

const saveProfile = async () => {
    loading.value = true;

    const formData = new FormData();

    // Si no se selecciona un tipo de documento, pedir al usuario que lo seleccione
    if (!profileData.value.tipo_documento_identidad && profileData.value.documento_de_identidad) {
        toast.error('Por favor, selecciona un tipo de documento.');
        loading.value = false;
        return;
    }

    formData.append('nombres', profileData.value.nombres ?? '');
    formData.append('apellidos', profileData.value.apellidos ?? '');
    formData.append('email', profileData.value.email ?? '');
    formData.append('telefono', profileData.value.telefono ?? '');
    formData.append('documento_de_identidad', profileData.value.documento_de_identidad ?? '');
    formData.append('tipo_documento_identidad', profileData.value.tipo_documento_identidad ?? '');
    
    if (profileData.value.foto_perfil) {
        formData.append('foto_perfil', profileData.value.foto_perfil);
    }

    try {
        const updated = await updateUserProfile(profileData.value.user_id, formData);
        await auth.fetchUserInfo();

        loading.value = false;
        toast.success('Perfil actualizado correctamente.');
    } catch (error) {
        loading.value = false;
        const responseData = error.response?.data || {};
        showValidationErrors(toast, responseData);
    }
};

</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.content h4 {
    font-weight: 850;
}

label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-align: left;
    width: 100%;
    display: block;
}

.section {
    margin-top: 2rem;
    width: 100%;
}

.section h6 {
    font-weight: 850;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: left;
}

.form-group {
    margin-bottom: 1.5rem;
    width: 100%;
}

input[type="text"],
input[type="email"],
input[type="file"],
.v-select {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
}

.v-select .vs__selected-options {
    padding-left: 0.5rem;
}

.preview {
    margin-top: 1rem;
}

.img-preview {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #ccc;
}

.btn-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
}

.save-btn {
    background-color: #B70000;
    color: white;
    padding: 0.65rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.save-btn:hover {
    background-color: #8e1216;
    transform: scale(1.05);
}

.button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
