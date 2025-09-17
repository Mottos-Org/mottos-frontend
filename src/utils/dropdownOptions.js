import api from '../services/api';

const optionsCache = {
    general: null,
    marcas: new Map(),
    modelos: new Map()
};

export const getDropdownOptions = async () => {
    if (optionsCache.general) {
        return optionsCache.general;
    }

    try {
        const response = await api.get('/api/dropdown-options');
        optionsCache.general = response.data;
        return response.data;
    } catch (error) {
        console.error('Error fetching dropdown options:', error);
        throw error;
    }
};

export const searchMarcas = async (query = '', page = 1, perPage = 15) => {
    const cacheKey = `${query}_${page}_${perPage}`;
    
    if (optionsCache.marcas.has(cacheKey)) {
        return optionsCache.marcas.get(cacheKey);
    }

    try {
        const params = new URLSearchParams({
            per_page: perPage.toString(),
            page: page.toString(),
            sort_by: 'nombre_marca',
            sort_order: 'asc'
        });

        if (query) {
            params.append('search', query);
        }

        const response = await api.get(`/api/bike-makers/marcas?${params.toString()}`);
        optionsCache.marcas.set(cacheKey, response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error searching marcas:', error);
        throw error;
    }
};

export const getModelosByMarca = async (marcaId) => {
    if (!marcaId) return [];
    
    const cacheKey = `marca_${marcaId}`;
    
    if (optionsCache.modelos.has(cacheKey)) {
        return optionsCache.modelos.get(cacheKey);
    }

    try {
        const response = await api.get(`/api/bike-makers/models/${marcaId}`);
        
        // Cache the result
        optionsCache.modelos.set(cacheKey, response.data);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching modelos:', error);
        throw error;
    }
};

export const filterModelos = (modelos, query) => {
    if (!query) return modelos;
    
    const lowercaseQuery = query.toLowerCase();
    return modelos.filter(modelo => 
        modelo.nombre_modelo.toLowerCase().includes(lowercaseQuery)
    );
};

export const clearCache = (type = 'all') => {
    switch (type) {
        case 'marcas':
            optionsCache.marcas.clear();
            break;
        case 'modelos':
            optionsCache.modelos.clear();
            break;
        case 'general':
            optionsCache.general = null;
            break;
        default:
            optionsCache.general = null;
            optionsCache.marcas.clear();
            optionsCache.modelos.clear();
    }
};