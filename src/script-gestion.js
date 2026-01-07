// ==========================================
// CONFIGURACIÓN DE AIRTABLE
// ==========================================
const AIRTABLE_BASE_ID = 'appckusN5bsEHeJsT'; // El mismo ID que usaste en script.js
const AIRTABLE_TOKEN = 'patKYxH5l1PRPU9oD.52b62618df776c5a2b87ba0e35f796b161864a6a97c4eb6126d0c77c8641de36';     // El mismo Token que usaste en script.js
const TABLE_NAME = 'Solicitudes WEB';       // El nombre de tu tabla

let todasLasSolicitudes = [];

document.addEventListener('DOMContentLoaded', () => {
    const listaSolicitudesDiv = document.getElementById('lista-solicitudes');
    const filtroMotivoSelect = document.getElementById('filtro-motivo');
    const filtroEstadoSelect = document.getElementById('filtro-estado');
    const filtroFechaInput = document.getElementById('filtro-fecha');

    cargarSolicitudesIniciales();

    listaSolicitudesDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('enviar-respuesta-btn')) {
            const solicitudId = event.target.dataset.id;
            const respuestaTextarea = document.getElementById(`respuesta-${solicitudId}`);
            const respuesta = respuestaTextarea.value.trim();
            
            if (respuesta) {
                enviarRespuesta(solicitudId, respuesta);
            } else {
                alert('Por favor, escribe una respuesta antes de enviar.');
            }
        }
    });

    filtroMotivoSelect.addEventListener('change', filtrarSolicitudes);
    filtroEstadoSelect.addEventListener('change', filtrarSolicitudes);
    filtroFechaInput.addEventListener('change', filtrarSolicitudes);
});

// ==========================================
// LECTURA DE DATOS (GET)
// ==========================================
function cargarSolicitudesIniciales() {
    const listaSolicitudesDiv = document.getElementById('lista-solicitudes');
    
    // URL de Airtable para obtener registros
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?sort%5B0%5D%5Bfield%5D=CreatedTime&sort%5B0%5D%5Bdirection%5D=desc`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Airtable devuelve los datos en data.records
        // Mapeamos los registros de Airtable al formato que tu código espera
        const solicitudes = data.records.map(record => ({
            id: record.id, // ID interno de Airtable (necesario para updates)
            nombreCompleto: record.fields.NombreCompleto,
            correoElectronico: record.fields.CorreoElectronico,
            motivoContacto: record.fields.MotivoContacto,
            mensaje: record.fields.Mensaje,
            respondida: record.fields.Respondida || false, // Si es undefined, es false
            respuesta: record.fields.Respuesta || '',
            fechaEnvio: record.createdTime // Airtable tiene un campo automático de fecha de creación
        }));

        todasLasSolicitudes = solicitudes;
        cargarMotivosFiltrados(solicitudes);
        mostrarSolicitudesFiltradas(solicitudes);
    })
    .catch(error => {
        console.error('Error al cargar las solicitudes:', error);
        listaSolicitudesDiv.textContent = 'Error al cargar las solicitudes. Verifica tus credenciales.';
    });
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

// ==========================================
// ACTUALIZACIÓN DE DATOS (PATCH)
// ==========================================
async function enviarRespuesta(idSolicitud, respuestaTexto) {
    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}/${idSolicitud}`;
        
        // Objeto de actualización para Airtable (usamos "fields")
        const updateData = {
            "fields": {
                "Respuesta": respuestaTexto,
                "Respondida": true
            }
        };

        const response = await fetch(url, {
            method: 'PATCH', // Airtable usa PATCH para actualizaciones parciales
            headers: {
                'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            ('Respuesta actualizada en Airtable con éxito.');
            alert('Respuesta guardada correctamente en el sistema.');
            // Recargar para ver los cambios
            cargarSolicitudesIniciales();
            
            // NOTA: Como no tenemos backend de Java, aquí NO se envía el correo automáticamente.
            // Tendrías que responder manualmente desde tu correo o usar una automatización de Airtable.
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar:', response.status, errorData);
            alert(`Error al guardar respuesta: ${errorData.error?.message || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error de red al actualizar:', error);
        alert('Error de red al intentar guardar la respuesta.');
    }
}

// ==========================================
// FUNCIONES DE UI (Sin cambios mayores)
// ==========================================

function cargarMotivosFiltrados(solicitudes) {
    const filtroMotivoSelect = document.getElementById('filtro-motivo');
    filtroMotivoSelect.innerHTML = '<option value="">Todos</option>';
    // Filtramos nulos o indefinidos por seguridad
    const motivos = [...new Set(solicitudes.map(s => s.motivoContacto).filter(m => m))];
    
    motivos.forEach(motivo => {
        const option = document.createElement('option');
        option.value = motivo;
        option.textContent = motivo;
        filtroMotivoSelect.appendChild(option);
    });
}

function mostrarSolicitudesFiltradas(solicitudesFiltradas) {
    const listaSolicitudesDiv = document.getElementById('lista-solicitudes');
    listaSolicitudesDiv.innerHTML = '';

    if (solicitudesFiltradas && solicitudesFiltradas.length > 0) {
        solicitudesFiltradas.forEach(solicitud => {
            const solicitudDiv = document.createElement('div');
            solicitudDiv.classList.add('solicitud');

            // Formato de fecha simple
            const fechaEnvioFormatted = solicitud.fechaEnvio ? new Date(solicitud.fechaEnvio).toLocaleString() : 'N/A';

            // HTML de la tarjeta
            const infoPrincipalDiv = document.createElement('div');
            infoPrincipalDiv.classList.add('solicitud-info-main');
            infoPrincipalDiv.innerHTML = `
                <strong>Nombre:</strong> ${solicitud.nombreCompleto || 'N/A'}<br>
                <strong>Correo:</strong> ${solicitud.correoElectronico || 'N/A'}<br>
                <strong>Motivo:</strong> ${solicitud.motivoContacto || 'N/A'}<br>
                <strong>Mensaje:</strong> ${solicitud.mensaje || 'N/A'}<br>
                <strong>Fecha de Envío:</strong> ${fechaEnvioFormatted}<br>
                <strong>Estado:</strong> <span class="${solicitud.respondida ? 'respondida' : 'no-respondida'}">${solicitud.respondida ? 'Respondida' : 'Pendiente'}</span>
            `;
            solicitudDiv.appendChild(infoPrincipalDiv);

            const gestionActionsDiv = document.createElement('div');
            gestionActionsDiv.classList.add('solicitud-gestion-actions');

            if (solicitud.respondida) {
                gestionActionsDiv.innerHTML = `
                    <div class="respuesta-area">
                        <strong>Respuesta guardada:</strong><br>
                        <p>${solicitud.respuesta || 'Sin texto de respuesta'}</p>
                    </div>
                `;
            } else {
                gestionActionsDiv.innerHTML = `
                    <div class="respuesta-area">
                        <strong>Escribe tu respuesta (Solo guarda en sistema):</strong><br>
                        <textarea id="respuesta-${solicitud.id}" placeholder="Escribe tu respuesta aquí"></textarea><br>
                        <button class="enviar-respuesta-btn" data-id="${solicitud.id}">Guardar Respuesta</button>
                    </div>
                `;
            }
            solicitudDiv.appendChild(gestionActionsDiv);
            listaSolicitudesDiv.appendChild(solicitudDiv);

            // Listeners para textarea
            const textareaRespuesta = solicitudDiv.querySelector(`#respuesta-${solicitud.id}`);
            if (textareaRespuesta && !solicitud.respondida) {
                textareaRespuesta.addEventListener('input', autoResizeTextarea);
            }
        });
    } else {
        listaSolicitudesDiv.textContent = 'No se encontraron solicitudes con los criterios de búsqueda.';
    }
}

function filtrarSolicitudes() {
    const motivoSeleccionado = document.getElementById('filtro-motivo').value;
    const estadoSeleccionado = document.getElementById('filtro-estado').value;
    const fechaSeleccionada = document.getElementById('filtro-fecha').value;

    const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => {
        const motivoContacto = solicitud.motivoContacto;
        const estado = solicitud.respondida ? 'Respondida' : 'Pendiente';
        // Ajuste de fecha para coincidir formato YYYY-MM-DD
        const fechaEnvio = solicitud.fechaEnvio ? new Date(solicitud.fechaEnvio).toISOString().split('T')[0] : '';

        const motivoCoincide = !motivoSeleccionado || motivoContacto === motivoSeleccionado;
        const estadoCoincide = !estadoSeleccionado || estado === estadoSeleccionado;
        const fechaCoincide = !fechaSeleccionada || fechaEnvio === fechaSeleccionada;

        return motivoCoincide && estadoCoincide && fechaCoincide;
    });

    mostrarSolicitudesFiltradas(solicitudesFiltradas);
}