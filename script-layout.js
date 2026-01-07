// Este código se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- Observador para animaciones personalizadas (como div-skills) ---
    const animatables = document.querySelectorAll('.scroll-animar');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animation;
                entry.target.classList.add('animate__animated', animation);
                observer.unobserve(entry.target); // Solo se anima una vez
            }
        });
    }, {
        threshold: 0.2
    });

    animatables.forEach(el => animationObserver.observe(el));

    // --- Código para el efecto de las tarjetas (front/back flip) ---
    const cards = document.querySelectorAll('.card');

    // --- Lógica para el cambio de tema (claro/oscuro o modos) ---

    // ¡CAMBIO IMPORTANTE AQUÍ!
    // Ahora los botones de tema tienen IDs únicos para diferenciarlos.
    const themeToggleButtonMobile = document.getElementById('theme-toggle-mobile-btn');
    const themeToggleButtonDesktop = document.getElementById('theme-toggle-desktop-btn');

    const body = document.body;
    const modeMessage = document.getElementById('mode-message'); // Asegúrate de que este elemento <div id="mode-message"> existe en tu HTML


    // Cargar el tema preferido del almacenamiento local al inicio
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    // Función para cambiar el tema
    function toggleTheme() {
        let currentMode = '';

        if (body.classList.contains('hacker-mode')) {
            body.classList.remove('hacker-mode');
            body.classList.add('futuristic-mode');
            localStorage.setItem('theme', 'futuristic-mode');
            currentMode = 'Futuristic Mode';
        } else if (body.classList.contains('futuristic-mode')) {
            body.classList.remove('futuristic-mode');
            localStorage.removeItem('theme'); // Vuelve al modo normal (sin clase)
            currentMode = 'Normal Mode';
        } else { // Si no tiene ninguna de las dos clases, aplica 'hacker-mode'
            body.classList.add('hacker-mode');
            localStorage.setItem('theme', 'hacker-mode');
            currentMode = 'Hacker Mode';
        }

        // Mostrar mensaje de cambio de modo (solo si 'modeMessage' existe)
        if (modeMessage) { // Añadimos esta verificación por seguridad
            modeMessage.textContent = `Se cambió a ${currentMode}`;
            modeMessage.style.display = 'block';
            modeMessage.style.opacity = '1';

            // Ocultar el mensaje después de un tiempo
            setTimeout(() => {
                modeMessage.style.opacity = '0';
                setTimeout(() => {
                    modeMessage.style.display = 'none';
                }, 500); // Duración de la transición de opacidad
            }, 2000); // Mensaje visible por 2 segundos
        }
    }

    // Asignar el evento click a AMBOS botones de cambio de tema
    if (themeToggleButtonMobile) {
        themeToggleButtonMobile.addEventListener('click', toggleTheme);
    }

    if (themeToggleButtonDesktop) {
        themeToggleButtonDesktop.addEventListener('click', toggleTheme);
    }

    // --- Código para el envío del formulario ---
    // ¡CAMBIO AQUÍ! El selector del formulario debe ser '#contact-form'
    // porque le dimos ese ID en la estructura HTML.
    const form = document.querySelector('#contact-form'); // O document.getElementById('contact-form');
    const mensajeInput = document.getElementById('message');
    // Si 'message-error' se refiere a un <span> o <p> justo al lado del input de mensaje
    const mensajeError = document.querySelector('#message + .error-message') || document.getElementById('message-error');
    const emailError = document.querySelector('#email + .error-message') || document.getElementById('email-error');
    const quienEresError = document.querySelector('#quien-eres + .error-message') || document.getElementById('quien-eres-error');
    const motivoContactoError = document.querySelector('#motivo-contacto + .error-message') || document.getElementById('motivo-contacto-error');
    const mensajeExitoDiv = document.querySelector('.mensaje-exito'); // Selector de clase
    const mensajeErrorEnvioDiv = document.querySelector('.mensaje-error-envio'); // Selector de clase
    // Si 'name-error' se refiere a un <span> o <p> justo al lado del input de nombre
    const nombreCompletoError = document.querySelector('#name + .error-message') || document.getElementById('name-error');

    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto del formulario

            const nombreCompleto = document.getElementById('name').value;
            const correoElectronico = document.getElementById('email').value;
            const quienEres = document.getElementById('quien-eres').value;
            const motivoContacto = document.getElementById('motivo-contacto').value;
            const mensaje = mensajeInput.value;

        // ============================================================
        // 🛡️ INICIO DE CÓDIGO ANTI-SPAM (HONEYPOT)
        // ============================================================
        
        // Buscamos el input oculto por su atributo name="honeypot"
            const honeypotInput = document.querySelector('input[name="honeypot"]');

        // Verificamos si existe y si tiene algún valor escrito
        if (honeypotInput && honeypotInput.value !== "") {
            // Si tiene valor, es un bot que llenó todo automáticamente
            console.warn("Bot detectado 🤖. Se ha bloqueado el envío.");
            return; // 🛑 AQUÍ SE DETIENE TODO. No valida, no envía, no hace nada más.
        }

            let errores = [];
            let tieneErroresEspecificos = false;

            // Validación del Nombre Completo
            const soloLetrasYEspacios = /^[A-Za-z\s]*$/;
            const repeticionExcesiva = /(.)\1{3,}/;
            const nombreTrimmed = nombreCompleto.trim();

            // Muestra/oculta mensajes de error específicos
            function showError(element, message) {
                if (element) {
                    element.textContent = message;
                    element.style.display = message ? 'block' : 'none'; // Mostrar si hay mensaje, ocultar si no
                }
            }

            // Limpiar errores al inicio de la validación
            showError(nombreCompletoError, '');
            showError(mensajeError, '');
            showError(emailError, '');
            showError(quienEresError, '');
            showError(motivoContactoError, '');


            if (!nombreCompleto) {
                showError(nombreCompletoError, 'El nombre es obligatorio.');
                tieneErroresEspecificos = true;
            } else if (!soloLetrasYEspacios.test(nombreCompleto)) {
                showError(nombreCompletoError, 'El nombre solo puede contener letras y espacios.');
                tieneErroresEspecificos = true;
            } else if (nombreTrimmed.length < 3) {
                showError(nombreCompletoError, 'El nombre debe tener al menos 3 caracteres.');
                tieneErroresEspecificos = true;
            } else if (!/\s/.test(nombreTrimmed)) {
                showError(nombreCompletoError, 'Por favor, introduce tu nombre y apellido.');
                tieneErroresEspecificos = true;
            } else if (repeticionExcesiva.test(nombreTrimmed)) {
                showError(nombreCompletoError, 'Por favor, introduce un nombre coherente (evita repetir letras excesivamente).');
                tieneErroresEspecificos = true;
            }

            // Validación del Correo Electrónico
            if (!correoElectronico) {
                showError(emailError, 'El correo electrónico es obligatorio.');
                tieneErroresEspecificos = true;
            } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correoElectronico)) {
                showError(emailError, 'El correo electrónico no tiene un formato válido.');
                tieneErroresEspecificos = true;
            }
            // --- Validación de ¿Quién eres? (NUEVO) ---
            if (!quienEres) {
                showError(quienEresError, 'Por favor, selecciona quién eres.');
                tieneErroresEspecificos = true;
            }
            // --- Validación de Motivo de Contacto (NUEVO) ---
            if (!motivoContacto) {
                showError(motivoContactoError, 'Por favor, selecciona un motivo de contacto.');
                tieneErroresEspecificos = true;
            }
            // Validación específica para el mensaje
            if (!mensaje) {
                showError(mensajeError, 'El mensaje es obligatorio.');
                tieneErroresEspecificos = true;
            } else if (mensaje.trim().length < 10) {
                showError(mensajeError, 'Debes escribir al menos 10 caracteres o palabras en el mensaje.');
                tieneErroresEspecificos = true;
            }
            // SI la bandera está en TRUE, significa que al menos un error fue mostrado INLINE.
            if (tieneErroresEspecificos) {
                return; // Detiene el envío del formulario.
            }       

            // 1. Configuración de Airtable
            // REEMPLAZA ESTOS VALORES CON LOS TUYOS
            const AIRTABLE_BASE_ID = 'appckusN5bsEHeJsT'; // Ejemplo: app...
            const AIRTABLE_TOKEN = 'patKYxH5l1PRPU9oD.52b62618df776c5a2b87ba0e35f796b161864a6a97c4eb6126d0c77c8641de36';     // Ejemplo: pat...
            const TABLE_NAME = 'Solicitudes WEB';       // El nombre exacto de tu tabla en Airtable

            // 2. Crear el objeto de datos para Airtable
            // Nota: "fields" es obligatorio en la API de Airtable.
            // Los nombres de las claves (izquierda) deben coincidir EXACTAMENTE con tus columnas en Airtable.
            const airtableData = {
                "fields": {
                    "NombreCompleto": nombreCompleto,
                    "CorreoElectronico": correoElectronico,
                    "QuienEres": quienEres,
                    "MotivoContacto": motivoContacto,
                    "Mensaje": mensaje,
                    "Respondida": false // Marcamos como no respondida por defecto
                    // "Respuesta" se deja vacío intencionalmente
                }
            };

            // 3. Enviar a Airtable
            const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(airtableData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // Si hay error, intentamos leer el mensaje de Airtable para saber qué pasó
                    return response.json().then(errorData => {
                        throw new Error(errorData.error.message || 'Error desconocido en Airtable');
                    });
                }
            })
            .then(data => {
                ('Éxito guardando en Airtable:', data);
                
                // Mostrar mensaje de éxito en tu UI
                mensajeExitoDiv.style.display = 'block';
                mensajeErrorEnvioDiv.style.display = 'none';
                form.reset(); // Limpia el formulario

                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    mensajeExitoDiv.style.display = 'none';
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Mostrar mensaje de error en tu UI
                mensajeErrorEnvioDiv.style.display = 'block';
                // Mostramos un mensaje amigable al usuario, pero logueamos el error real en consola
                mensajeErrorEnvioDiv.textContent = 'Hubo un error al enviar la solicitud. Por favor intenta más tarde.';
                mensajeExitoDiv.style.display = 'none';

                setTimeout(() => {
                    mensajeErrorEnvioDiv.style.display = 'none';
                }, 5000);
            });
        });
    } // Fin del if (form)

    // --- Lógica para el video ---
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');

    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            loadVideo(thumbnail);
        });
    });

}); // Fin de DOMContentLoaded

// --- FUNCIONES DEL MENÚ (Fuera de DOMContentLoaded para que sean accesibles desde onclick en HTML) ---
// ¡CAMBIO IMPORTANTE AQUÍ!
// Tus funciones showSidebar y hideSidebar necesitan buscar el elemento .sidebar
// y aplicar/quitar la clase 'active' que el CSS usa para el desplazamiento.
// No uses 'display: flex' / 'display: none' para el sidebar principal, ya que
// el CSS controla su posición con 'right'.

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) { // Asegurarse de que el sidebar exista
        sidebar.classList.add('active'); // Añade la clase 'active' para que el CSS lo muestre
        ('Sidebar abierto.'); // Para depuración
    }
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) { // Asegurarse de que el sidebar exista
        sidebar.classList.remove('active'); // Elimina la clase 'active' para que el CSS lo oculte
        ('Sidebar cerrado.'); // Para depuración
    }
}

// Para cerrar el sidebar al hacer clic en un enlace dentro de él
// Estas líneas deben ir dentro de DOMContentLoaded si los listeners se añaden allí,
// o asegurarse de que se ejecuten después de que el DOM esté listo.
// Yo las moví dentro de DOMContentLoaded en el bloque principal.


// Función para cargar el video (fuera de DOMContentLoaded si se llama globalmente)
function loadVideo(thumbnail) {
    const videoWrapper = thumbnail.parentNode; // Obtenemos el contenedor padre

    // 🛡️ PROTECCIÓN ANTI-ECO:
    // Verificamos si ya existe un iframe dentro de este contenedor.
    // Si ya existe, detenemos la función aquí mismo para no crear un segundo video.
    if (videoWrapper.querySelector("iframe")) {
        return; 
    }

    const iframe = document.createElement("iframe");
    // Aquí es donde usas la URL de embed real que me proporcionaste.
    // Si quieres que el video se reproduzca automáticamente al cargar, añade &autoplay=1 al final de la URL.
    iframe.src = "https://www.youtube.com/embed/p8oVKqDyXSg?autoplay=1"; // Añadí autoplay=1
    iframe.title = "YouTube video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.frameBorder = "0";

    // Oculta la miniatura
    thumbnail.style.display = 'none';
    // Añade el iframe como un nuevo hijo de videoWrapper
    videoWrapper.appendChild(iframe);
}