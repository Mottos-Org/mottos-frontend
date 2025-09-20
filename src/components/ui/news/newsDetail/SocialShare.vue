<template>
    <div class="social-share-section">
        <h4>Compartir Artículo</h4>
        <div class="share-buttons">
            <button class="btn-share facebook" @click="shareOnFacebook">
                <i class="bi bi-facebook"></i>
                Facebook
            </button>
            <button class="btn-share twitter" @click="shareOnTwitter">
                <i class="bi bi-twitter-x"></i>
                Twitter
            </button>
            <button class="btn-share whatsapp" @click="shareOnWhatsApp">
                <i class="bi bi-whatsapp"></i>
                WhatsApp
            </button>
            <button class="btn-share copy" @click="copyLink">
                <i class="bi bi-link-45deg"></i>
                Copiar Link
            </button>
        </div>
    </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';

const props = defineProps({
    title: {
        type: String,
        required: true
    }
});

const toast = useToast();

const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(props.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
};

const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${props.title} - ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
    } catch (error) {
        console.error('Error copying link:', error);
        toast.error('Error al copiar enlace');
    }
};
</script>

<style scoped>
.social-share-section {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.social-share-section h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
}

.share-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn-share {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    color: white;
}

.btn-share:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn-share.facebook { background: #4267B2; }
.btn-share.twitter { background: #000; }
.btn-share.whatsapp { background: #25D366; }
.btn-share.copy { background: #6c757d; }

@media (max-width: 768px) {
    .share-buttons {
        justify-content: center;
    }
    
    .btn-share {
        flex: 1;
        justify-content: center;
        min-width: 120px;
    }
}

@media (max-width: 480px) {
    .share-buttons {
        flex-direction: column;
    }
}
</style>