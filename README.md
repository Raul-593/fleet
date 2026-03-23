# 🚚 Fleet System v1

Un moderno sistema de gestión de flotas diseñado para simplificar la asignación de rutas, el monitoreo de vehículos y la logística de transporte. Construido con tecnología de punta para garantizar rendimiento, escalabilidad y una excelente experiencia de usuario.

## 🚀 Características Principales

- **Dashboard Interactivo:** Vista general del estado de la flota con métricas clave.
- **Asignación de Rutas:** Formulario avanzado para seleccionar camiones, remolques y rutas predefinidas de la empresa para asignar nuevos viajes.
- **Cálculos Automáticos:** Cálculo automático del tiempo estimado de llegada (ETA) con base en la hora de salida.
- **Monitoreo en Mapa:** Integración con mapas interactivos para visualizar ubicaciones y trayectos (Leaflet).
- **Autenticación Segura:** Sistema de acceso protegido utilizando Supabase Auth.
- **Interfaz Moderna:** Componentes responsivos, limpios y accesibles.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza un stack moderno basado en el ecosistema de React y está preparado para altas exigencias operativas:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Lenguaje principal:** [TypeScript](https://www.typescriptlang.org/)
- **Estilación:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Validación y Formularios:** [React Hook Form](https://react-hook-form.com/) junto con [Zod](https://zod.dev/) para manejo de esquemas.
- **Backend como Servicio / Base de Datos:** [Supabase](https://supabase.com/) (`@supabase/ssr`)

## Visión General de la Estructura

La lógica de visualización descansa sobre el enrutador de Next.js (`App Router`) alojado en `src/app/`.

- `/src/app/auth`: Rutas de la API e interfaces de inicio/cierre de sesión administradas por Supabase.
- `/src/app/dashboard`: Panel de administración principal donde se encuentra la lógica de operación como el form de asignaciones y las métricas.
- Componentes modulares, configuración de validadores con Zod y Hooks de estado se distribuyen por la estructura para maximizar la reutilización del código.


*Desarrollado para optimizar el control del transporte y brindar la mejor experiencia en la gestión de flotas vehiculares.*
