<template>
    <div class="form-section">
        <h3>
            <i class="bi bi-file-text"></i>
            Contenido del Artículo
        </h3>
        
        <div class="markdown-editor-container">
            <div class="editor-toolbar">
                <div class="toolbar-group">
                    <button type="button" @click="insertMarkdown('**', '**')" class="btn btn-sm btn-outline-secondary" title="Negrita">
                        <i class="bi bi-type-bold"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('*', '*')" class="btn btn-sm btn-outline-secondary" title="Cursiva">
                        <i class="bi bi-type-italic"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('# ', '')" class="btn btn-sm btn-outline-secondary" title="Título">
                        <i class="bi bi-type-h1"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('## ', '')" class="btn btn-sm btn-outline-secondary" title="Subtítulo">
                        <i class="bi bi-type-h2"></i>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button type="button" @click="insertMarkdown('- ', '')" class="btn btn-sm btn-outline-secondary" title="Lista">
                        <i class="bi bi-list-ul"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('1. ', '')" class="btn btn-sm btn-outline-secondary" title="Lista numerada">
                        <i class="bi bi-list-ol"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('[', '](url)')" class="btn btn-sm btn-outline-secondary" title="Enlace">
                        <i class="bi bi-link-45deg"></i>
                    </button>
                    <button type="button" @click="insertMarkdown('> ', '')" class="btn btn-sm btn-outline-secondary" title="Cita">
                        <i class="bi bi-quote"></i>
                    </button>
                </div>
                <div class="toolbar-group">
                    <button type="button" @click="showPreview = !showPreview" class="btn btn-sm" :class="showPreview ? 'btn-primary' : 'btn-outline-primary'">
                        <i class="bi bi-eye"></i>
                        {{ showPreview ? 'Ocultar' : 'Vista Previa' }}
                    </button>
                </div>
            </div>
            
            <div class="editor-content" :class="{ 'split-view': showPreview }">
                <div class="editor-pane">
                    <textarea
                        ref="contentTextarea"
                        :value="content"
                        @input="updateContent($event.target.value)"
                        class="form-control markdown-editor"
                        :class="{ 'is-invalid': error }"
                        rows="20"
                        placeholder="Escribe el contenido de tu artículo usando Markdown...

# Título Principal

## Subtítulo

**Texto en negrita** y *texto en cursiva*

- Lista con viñetas
- Otro elemento

1. Lista numerada
2. Segundo elemento

> Cita o nota importante

[Enlace de ejemplo](https://ejemplo.com)"
                        required
                    ></textarea>
                    <div v-if="error" class="invalid-feedback">
                        {{ error }}
                    </div>
                </div>
                
                <div v-if="showPreview" class="preview-pane">
                    <div class="preview-content" v-html="renderedPreview"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
    content: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:content']);

const showPreview = ref(false);
const contentTextarea = ref(null);

const renderedPreview = computed(() => {
    if (!props.content) return '<p class="text-muted">El contenido aparecerá aquí...</p>';
    return marked(props.content);
});

const updateContent = (value) => {
    emit('update:content', value);
};

const insertMarkdown = (before, after) => {
    const textarea = contentTextarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = props.content.substring(start, end);
    
    const newText = before + selectedText + after;
    const updatedContent = props.content.substring(0, start) + newText + props.content.substring(end);
    
    emit('update:content', updatedContent);
    
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
};
</script>

<style scoped>
.form-section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
}

.form-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.form-section h3 i {
    color: #dc3545;
}

.markdown-editor-container {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
}

.editor-toolbar {
    background: #f8f9fa;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.toolbar-group {
    display: flex;
    gap: 0.25rem;
}

.btn {
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.editor-content {
    display: flex;
    min-height: 400px;
}

.editor-content.split-view .editor-pane {
    width: 50%;
    border-right: 1px solid #e9ecef;
}

.editor-pane {
    width: 100%;
}

.markdown-editor {
    border: none;
    border-radius: 0;
    resize: vertical;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    padding: 1.5rem;
}

.markdown-editor:focus {
    box-shadow: none;
}

.preview-pane {
    width: 50%;
    background: #fafafa;
    overflow-y: auto;
}

.preview-content {
    padding: 1.5rem;
    line-height: 1.6;
    text-align: left;
}

.preview-content h1, .preview-content h2, .preview-content h3 {
    color: #1a1a1a;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.preview-content h1 {
    font-size: 2rem;
}

.preview-content h2 {
    font-size: 1.5rem;
}

.preview-content h3 {
    font-size: 1.25rem;
}

.preview-content blockquote {
    border-left: 4px solid #dc3545;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #6c757d;
}

.preview-content code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

@media (max-width: 768px) {
    .form-section {
        padding: 1.5rem;
    }
    
    .editor-toolbar {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .editor-content.split-view {
        flex-direction: column;
    }
    
    .editor-content.split-view .editor-pane {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e9ecef;
    }
    
    .preview-pane {
        width: 100%;
        max-height: 300px;
    }
}
</style>