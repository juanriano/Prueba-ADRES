const ServicioValidacion = {
    validarFormulario(formulario) {
        let esValido = true;
        const inputs = formulario.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.mostrarError(input, 'Este campo es requerido');
                esValido = false;
            } else {
                this.limpiarError(input);
            }

            if (input.type === 'number' && input.value && parseFloat(input.value) <= 0) {
                this.mostrarError(input, 'Debe ser un número positivo');
                esValido = false;
            }

            if (input.type === 'date' && input.value) {
                const fechaSeleccionada = new Date(input.value);
                const hoy = new Date();
                if (fechaSeleccionada > hoy) {
                    this.mostrarError(input, 'La fecha no puede ser futura');
                    esValido = false;
                }
            }
        });

        return esValido;
    },

    mostrarError(input, mensaje) {
        this.limpiarError(input);
        const elementoError = document.createElement('div');
        elementoError.className = 'error';
        elementoError.textContent = mensaje;
        input.parentNode.appendChild(elementoError);
        input.classList.add('input-error');
    },

    limpiarError(input) {
        const elementoError = input.parentNode.querySelector('.error');
        if (elementoError) {
            elementoError.remove();
        }
        input.classList.remove('input-error');
    }
};