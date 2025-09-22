import { ref, reactive } from 'vue';

export function useBikeFormData() {
    const formData = reactive({
        marca_id: null,
        modelo_id: null,
        bike_type_id: null,
        year: new Date().getFullYear(),
        displacement: '',
        engine: '',
        power: '',
        torque: '',
        en_venta: false,
        fuel_system: {
            fuel_capacity: '',
            fuel_control: '',
            fuel_system: ''
        },
        tires: [
            {
                tire_make_id: null,
                front: true,
                size: '',
                tire_description: ''
            },
            {
                tire_make_id: null,
                front: false,
                size: '',
                tire_description: ''
            }
        ],
        brakes: [
            {
                brake_maker_id: null,
                front: true,
                brake_description: ''
            },
            {
                brake_maker_id: null,
                front: false,
                brake_description: ''
            }
        ],
        suspensions: [
            {
                suspension_maker_id: null,
                front: true,
                suspension_description: ''
            },
            {
                suspension_maker_id: null,
                front: false,
                suspension_description: ''
            }
        ]
    });

    const errors = ref({});

    const sectionsExpanded = reactive({
        fuel: false,
        tires: false,
        brakes: false,
        suspension: false
    });

    const toggleSection = (section) => {
        sectionsExpanded[section] = !sectionsExpanded[section];
    };

    return {
        formData,
        errors,
        sectionsExpanded,
        toggleSection
    };
}