const ServicioAdquisicion = {
    async cargarAdquisiciones() {
        try {
            const respuesta = await fetch('/api/adquisiciones');
            if (!respuesta.ok) {
                throw new Error('Error al cargar adquisiciones');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    },

    async agregarAdquisicion(adquisicion) {
        adquisicion.presupuesto = parseFloat(adquisicion.presupuesto);
        adquisicion.cantidad = parseInt(adquisicion.cantidad);
        adquisicion.valor_unitario = parseFloat(adquisicion.valor_unitario);

        try {
            const respuesta = await fetch('/api/adquisiciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adquisicion),
            });
            if (!respuesta.ok) {
                throw new Error('Error al agregar adquisición');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async actualizarAdquisicion(id, adquisicionActualizada) {
        adquisicionActualizada.presupuesto = parseFloat(adquisicionActualizada.presupuesto);
        adquisicionActualizada.cantidad = parseInt(adquisicionActualizada.cantidad);
        adquisicionActualizada.valor_unitario = parseFloat(adquisicionActualizada.valor_unitario);

        try {
            const respuesta = await fetch(`/api/adquisiciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adquisicionActualizada),
            });
            if (!respuesta.ok) {
                throw new Error('Error al actualizar adquisición');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async alternarAdquisicion(id) {
        try {
            const respuesta = await fetch(`/api/adquisiciones/${id}/alternar`, {
                method: 'PUT',
            });
            if (!respuesta.ok) {
                throw new Error('Error al alternar estado de adquisición');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async obtenerHistorialAdquisicion(id) {
        try {
            const respuesta = await fetch(`/api/adquisiciones/${id}/historial`);
            if (!respuesta.ok) {
                throw new Error('Error al obtener historial de adquisición');
            }
            return await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};