const UI = {
    inicializarEventListeners() {
        document.getElementById('lista-adquisiciones').addEventListener('click', async function(e) {
            if (e.target.classList.contains('btn-editar')) {
                const id = parseInt(e.target.dataset.id);
                await UI.mostrarModalEdicion(id);
            } else if (e.target.classList.contains('btn-alternar')) {
                const id = parseInt(e.target.dataset.id);
                await ServicioAdquisicion.alternarAdquisicion(id);
                await UI.actualizarListaAdquisiciones();
            }
        });

        document.querySelector('.cerrar').addEventListener('click', UI.cerrarModal);
        window.addEventListener('click', function(e) {
            if (e.target === document.getElementById('modal')) {
                UI.cerrarModal();
            }
        });

        document.getElementById('nav-crear').addEventListener('click', function(e) {
            e.preventDefault();
            UI.mostrarSeccion('seccion-formulario');
        });

        document.getElementById('nav-listar').addEventListener('click', function(e) {
            e.preventDefault();
            UI.mostrarSeccion('seccion-lista');
        });

        document.getElementById('formulario-adquisicion').addEventListener('submit', async function(e) {
            e.preventDefault();
            if (ServicioValidacion.validarFormulario(this)) {
                const formData = new FormData(this);
                const adquisicion = Object.fromEntries(formData.entries());
                await ServicioAdquisicion.agregarAdquisicion(adquisicion);
                await UI.actualizarListaAdquisiciones();
                this.reset();
                UI.mostrarSeccion('seccion-lista');
            }
        });

        document.getElementById('busqueda').addEventListener('input', UI.actualizarListaAdquisiciones);
        document.getElementById('filtro-estado').addEventListener('change', UI.actualizarListaAdquisiciones);
    },

    mostrarSeccion(seccionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('oculto');
        });
        document.getElementById(seccionId).classList.remove('oculto');
    },

    async actualizarListaAdquisiciones() {
        const tbody = document.getElementById('lista-adquisiciones');
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const estado = document.getElementById('filtro-estado').value;
        const adquisiciones = await ServicioAdquisicion.cargarAdquisiciones();
        
        tbody.innerHTML = '';
        adquisiciones.forEach(adq => {
            if ((estado === 'todos' || 
                (estado === 'activos' && adq.activo) || 
                (estado === 'inactivos' && !adq.activo)) &&
                Object.values(adq).some(valor => String(valor).toLowerCase().includes(busqueda))) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${adq.tipo}</td>
                    <td>$${adq.presupuesto}</td>
                    <td>${adq.unidad}</td>
                    <td>${adq.cantidad}</td>
                    <td>$${adq.valor_total}</td>
                    <td>${adq.fecha_adquisicion}</td>
                    <td>${adq.proveedor}</td>
                    <td>
                        <button class="btn-editar" data-id="${adq.id}">Editar</button>
                        <button class="btn-alternar" data-id="${adq.id}">${adq.activo ? 'Desactivar' : 'Activar'}</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });
    },

    async mostrarModalEdicion(id) {
        const adquisiciones = await ServicioAdquisicion.cargarAdquisiciones();
        const adquisicion = adquisiciones.find(a => a.id === id);
        if (adquisicion) {
            document.getElementById('titulo-modal').textContent = 'Editar Adquisición';
            document.getElementById('cuerpo-modal').innerHTML = `
                <form id="formulario-edicion">
                    <input type="hidden" name="id" value="${adquisicion.id}">
                    <div class="grupo-formulario">
                        <label for="editar-presupuesto">Presupuesto:</label>
                        <input type="number" id="editar-presupuesto" name="presupuesto" value="${adquisicion.presupuesto}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-unidad">Unidad Administrativa:</label>
                        <input type="text" id="editar-unidad" name="unidad" value="${adquisicion.unidad}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-tipo">Tipo de Bien o Servicio:</label>
                        <input type="text" id="editar-tipo" name="tipo" value="${adquisicion.tipo}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-cantidad">Cantidad:</label>
                        <input type="number" id="editar-cantidad" name="cantidad" value="${adquisicion.cantidad}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-valor-unitario">Valor Unitario:</label>
                        <input type="number" id="editar-valor-unitario" name="valor_unitario" value="${adquisicion.valor_unitario}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-fecha-adquisicion">Fecha de Adquisición:</label>
                        <input type="date" id="editar-fecha-adquisicion" name="fecha_adquisicion" value="${adquisicion.fecha_adquisicion}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-proveedor">Proveedor:</label>
                        <input type="text" id="editar-proveedor" name="proveedor" value="${adquisicion.proveedor}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="editar-documentacion">Documentación:</label>
                        <textarea id="editar-documentacion" name="documentacion">${adquisicion.documentacion}</textarea>
                    </div>
                    <button type="submit">Actualizar</button>
                </form>
                <h3>Historial de Cambios</h3>
                <ul id="lista-historial"></ul>
            `;
            document.getElementById('modal').style.display = 'block';
            document.getElementById('formulario-edicion').addEventListener('submit', UI.manejarEnvioEdicion);
            await UI.actualizarListaHistorial(id);
        }
    },

    async actualizarListaHistorial(id) {
        const listaHistorial = document.getElementById('lista-historial');
        const historial = await ServicioAdquisicion.obtenerHistorialAdquisicion(id);
        listaHistorial.innerHTML = '';
        historial.forEach(entrada => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${new Date(entrada.fecha).toLocaleString()}</strong> - ${entrada.accion}<br>
                <em>${entrada.cambios}</em>
            `;
            listaHistorial.appendChild(li);
        });
    },

    async manejarEnvioEdicion(e) {
        e.preventDefault();
        if (ServicioValidacion.validarFormulario(e.target)) {
            const formData = new FormData(e.target);
            const adquisicionActualizada = Object.fromEntries(formData.entries());
            await ServicioAdquisicion.actualizarAdquisicion(adquisicionActualizada.id, adquisicionActualizada);
            UI.cerrarModal();
            await UI.actualizarListaAdquisiciones();
        }
    },

    cerrarModal() {
        document.getElementById('modal').style.display = 'none';
    }
};