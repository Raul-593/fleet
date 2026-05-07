# 🚚 Fleet System

Un moderno sistema de gestión de flotas diseñado para simplificar la asignación de rutas, el monitoreo de vehículos y la logística de transporte. Construido con tecnología de punta para garantizar rendimiento, escalabilidad y una excelente experiencia de usuario.

> Sistema de gestión de flotas — digita rutas, viajes, gestión de personal y de vehículos. 

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=flat-square) ![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-yellow?style=flat-square) ![Licencia](https://img.shields.io/badge/Licencia-MIT-blue?style=flat-square)

---

## 📸 Vista Previa

<div align="center">
  <img src="./public/1_dashboard.png" alt="Pantalla Principal" width="80%" />
</div>
<br>
<div align="center">
  <img src="./public/3_gestion_flota.png" alt="Funcionalidad 1" width="45%" />
  &nbsp;&nbsp;
  <img src="./public/4_gestion_rutas.png" alt="Funcionalidad 2" width="45%" />
</div>

## Visión General de la Estructura

La lógica de visualización descansa sobre el enrutador de Next.js (`App Router`) alojado en `src/app/`.

- `/src/app/auth`: Rutas de la API e interfaces de inicio/cierre de sesión administradas por Supabase.
- `/src/app/dashboard`: Panel de administración principal donde se encuentra la lógica de operación como el form de asignaciones y las métricas.
- Componentes modulares, configuración de validadores con Zod y Hooks de estado se distribuyen por la estructura para maximizar la reutilización del código.


## 🚀 Características Principales

- **Dashboard Interactivo:** Vista general del estado de la flota con métricas clave.
- **Asignación de Rutas:** Formulario avanzado para seleccionar camiones, remolques y rutas predefinidas de la empresa para asignar nuevos viajes.
- **Cálculos Automáticos:** Cálculo automático del tiempo estimado de llegada (ETA) con base en la hora de salida.
- **Monitoreo en Mapa:** Integración con mapas interactivos para visualizar ubicaciones y trayectos (Leaflet).
- **Autenticación Segura:** Sistema de acceso protegido utilizando Supabase Auth.
- **Interfaz Moderna:** Componentes responsivos, limpios y accesibles.

## 🛠️ Tecnologías

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

### Base de Datos

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 

### Deploy

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

---

## 🚀 Cómo correrlo localmente

### Prerequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Raul-593/fleet.git
cd fleet

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Correr migraciones
npm run db:migrate

# 5. Iniciar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# App
PORT=3000
NODE_ENV=development

# Base de Datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db

# Auth
JWT_SECRET=tu_jwt_secret_aqui
JWT_EXPIRES_IN=7d

# (Opcional) Redis
REDIS_URL=redis://localhost:6379
```

---

## 📁 Estructura del Proyecto

```
nombre-proyecto/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas / rutas
│   ├── hooks/          # Custom hooks
│   ├── services/       # Llamadas a la API
│   ├── store/          # Estado global
│   └── utils/          # Helpers y utilidades
├── public/             # Imágenes para el README
├── .env.example
└── README.md
```

---

## 🔗 Links

[![Demo en Vivo](https://img.shields.io/badge/%F0%9F%8C%90_Demo_en_Vivo-Ver_App-brightgreen?style=for-the-badge)](https://fleet-sistem-presentation.netlify.app/dashboard) [![Documentación](https://img.shields.io/badge/%F0%9F%93%84_Docs-Ver_Docs-blue?style=for-the-badge)](https://github.com/Raul-593/fleet)

---

## 📬 Contacto

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/Raul-593) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/raul-viteri-b4a9052aa/)

---

<div align="center"> <sub>Hecho por <a href="https://github.com/Raul-593">Raul-593</a></sub> </div>