export function useBikePayloadCleaner() {
    const isTireEmpty = (tire) => {
        return !tire.tire_make_id && !tire.size && !tire.tire_description;
    };

    const isBrakeEmpty = (brake) => {
        return !brake.brake_maker_id && !brake.brake_description;
    };

    const isSuspensionEmpty = (suspension) => {
        return !suspension.suspension_maker_id && !suspension.suspension_description;
    };

    const isFuelSystemEmpty = (fuelSystem) => {
        return !fuelSystem.fuel_capacity && !fuelSystem.fuel_control && !fuelSystem.fuel_system;
    };

    const cleanPayload = (data) => {
        const payload = {
            marca_id: data.marca_id,
            modelo_id: data.modelo_id,
            bike_type_id: data.bike_type_id,
            year: data.year,
            displacement: data.displacement,
            engine: data.engine || '',
            power: data.power || '',
            torque: data.torque || '',
            en_venta: data.en_venta,
            fuel_system: {},
            tires: [],
            brakes: [],
            suspensions: []
        };

        // Only include fuel_system if it has data
        if (!isFuelSystemEmpty(data.fuel_system)) {
            payload.fuel_system = {
                fuel_capacity: data.fuel_system.fuel_capacity || '',
                fuel_control: data.fuel_system.fuel_control || '',
                fuel_system: data.fuel_system.fuel_system || ''
            };
        }

        // Only include tires that have data
        data.tires.forEach(tire => {
            if (!isTireEmpty(tire)) {
                payload.tires.push({
                    tire_make_id: tire.tire_make_id,
                    front: tire.front,
                    size: tire.size || '',
                    tire_description: tire.tire_description || ''
                });
            }
        });

        // Only include brakes that have data
        data.brakes.forEach(brake => {
            if (!isBrakeEmpty(brake)) {
                payload.brakes.push({
                    brake_maker_id: brake.brake_maker_id,
                    front: brake.front,
                    brake_description: brake.brake_description || ''
                });
            }
        });

        // Only include suspensions that have data
        data.suspensions.forEach(suspension => {
            if (!isSuspensionEmpty(suspension)) {
                payload.suspensions.push({
                    suspension_maker_id: suspension.suspension_maker_id,
                    front: suspension.front,
                    suspension_description: suspension.suspension_description || ''
                });
            }
        });

        return payload;
    };

    return {
        cleanPayload
    };
}