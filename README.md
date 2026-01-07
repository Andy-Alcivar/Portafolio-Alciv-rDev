# 🚀 Portafolio Web & Sistema de Gestión - AlcivarDev

¡Bienvenido al repositorio oficial de mi portafolio profesional!
Este proyecto es una solución **Full Stack** que integra una Landing Page personal con un sistema administrativo privado para la gestión de clientes.

---

## 🌐 Demo en Vivo
Puedes visitar el sitio desplegado en producción aquí:
🔗 **[https://peachpuff-kudu-295561.hostingersite.com/]**

---

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando estándares modernos y desarrollo limpio:

* **Frontend:**
    * ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5 Semántico**
    * ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** (Diseño Responsivo, Flexbox, Grid & Animaciones)
    * ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript (Vanilla)**

* **Backend & Servicios:**
    * ![Airtable](https://img.shields.io/badge/Airtable-API-blue) **Airtable API** (Base de datos para formulario y gestión)
    * **Hostinger** (Despliegue y Hosting)

* **Control de Versiones:**
    * ![Git](https://img.shields.io/badge/GIT-E44C30?style=flat&logo=git&logoColor=white) **Git & GitHub**

---

## ✨ Características Principales

### 1. Portafolio Personal (Frontend)
* Diseño totalmente **Responsive** (Móvil, Tablet, Desktop).
* **Animaciones CSS** personalizadas (Efecto de flotación y transiciones).
* Formulario de contacto funcional integrado con API.
* Optimización de carga y SEO básico (Meta tags y Favicon).

### 2. Sistema de Gestión (Dashboard)
* Acceso independiente mediante ruta `/gestion`.
* Lectura de datos en tiempo real desde **Airtable**.
* Interfaz administrativa para revisar solicitudes de clientes.

---

## 📂 Estructura del Proyecto

El proyecto está organizado para separar la lógica pública de la privada:

```bash
/ (Raíz)
├── index.html          # Landing Page Principal (Portafolio)
├── css/                # Estilos globales y del portafolio
├── js/                 # Lógica del frontend
├── img/                # Recursos gráficos
│
└── gestion/            # MÓDULO ADMINISTRATIVO
    ├── index.html      # Dashboard de control
    ├── css/            # Estilos propios del dashboard
    └── js/             # Lógica de conexión para leer datos
