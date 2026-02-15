# React + Sockets: Aplicaciones en tiempo real con Bun

Colección de proyectos prácticos desarrollados durante el curso de aplicaciones en tiempo real usando WebSockets nativos en Bun junto con React. Desde conceptos básicos hasta aplicaciones completas con bases de datos y autenticación.

## ¿Qué hay en este repo?

- Implementación nativa de WebSockets con Bun
- Integración de sockets con React y TypeScript
- Visualización de datos en tiempo real (Chart.js, Mapbox)
- Gestión de estado con sockets
- Autenticación JWT y persistencia con Prisma

## Proyectos desarrollados

| Proyecto | Descripción | Tecnologías | Carpeta |
| :--- | :--- | :--- | :--- |
| **WebSockets Bases** | Servidor WebSocket básico con canales de suscripción y broadcasting | Bun, TypeScript | [01-websockets-bases](./01-websockets-bases/) |
| **Votación Partidos Políticos** | Sistema de votación en tiempo real con gráficos interactivos | Bun, React, Chart.js | [02-political-parties](./02-political-parties/) |
| **Mapa de Ubicaciones** | Rastreo de ubicaciones en tiempo real en mapa interactivo | Bun, React, Mapbox GL | [03-sockets-map](./03-sockets-map/) / [03-sockets-react](./03-sockets-react/) |
| **Sistema de Tickets** | Gestión de cola de tickets con actualizaciones en tiempo real | Bun, React, Tailwind | [04-ticket-app](./04-ticket-app/) / [04-react-ticket-app](./04-react-ticket-app/) |
| **Chat Completo** | Aplicación de chat con mensajería directa, canales, autenticación JWT y base de datos | Bun, React, Prisma, PostgreSQL | [05-chat-app](./05-chat-app/) |

## Características implementadas

### Servidor (Bun)
- ✅ WebSockets nativos con `Bun.serve`
- ✅ Manejo de conexiones y desconexiones
- ✅ Broadcasting a múltiples clientes
- ✅ Canales y salas de chat
- ✅ Mensajería directa entre usuarios
- ✅ Integración con Prisma ORM
- ✅ Autenticación JWT
- ✅ API REST + WebSockets

### Cliente (React)
- ✅ Hooks personalizados para WebSockets
- ✅ Gestión de estado con sockets
- ✅ Visualización de datos en tiempo real
- ✅ Mapas interactivos (Mapbox GL)
- ✅ Gráficos dinámicos (Chart.js)
- ✅ UI con Tailwind CSS

## Stack tecnológico

- **Runtime**: [Bun](https://bun.sh) - WebSockets nativos y rendimiento superior
- **Frontend**: React + TypeScript + Vite
- **Visualización**: Chart.js, Mapbox GL
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT

## Progreso del curso

- [x] Configuración inicial con Bun
- [x] Bases de WebSockets (Servidor y Cliente)
- [x] Integración de Sockets en React
- [x] Visualización de datos en tiempo real
- [x] Manejo de múltiples canales y salas
- [x] Sistema de mensajería directa
- [x] Gestión de usuarios conectados
- [x] Persistencia con base de datos
- [x] Autenticación y seguridad

## Estado del curso

**✅ COMPLETADO** - Febrero 2026

---

**Cristian** - [GitHub](https://github.com/cristianemek)
