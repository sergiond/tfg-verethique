# Verethiqué – TFG

Trabajo Final de Grado (TFG) desarrollado en la UOC.
El proyecto consiste en una plataforma web orientada a la consulta y revisión documental de prácticas sostenibles en moda de cercanía.

La aplicación permite visualizar un directorio de marcas, gestionar solicitudes de revisión y trabajar con criterios ASG (ambiental, social y gobernanza), aunque en esta versión se trata de un MVP con funcionalidades limitadas.

## Tecnologías utilizadas

- Next.js (framework principal)
- React
- Supabase (base de datos y backend)
- TypeScript
- CSS / estilos propios

## Getting Started

Para ejecutar el proyecto en local:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Después, abrir en el navegador:

👉 http://localhost:3000

La aplicación se actualizará automáticamente al modificar los archivos del proyecto (por ejemplo app/page.tsx).

## Estructura del proyecto (simplificada)

/app → páginas y rutas principales
/components → componentes reutilizables
/lib → conexión con Supabase y utilidades
/admin → panel de administración (acceso limitado / simulado)

## Funcionalidades principales

Directorio de marcas y comercios textiles
Filtros y búsqueda por distintas variables
Sistema de valoración basado en criterios ASG
Envío de solicitudes de revisión documental
Panel de administración básico para gestión de datos

## Notas

Se trata de una primera versión (MVP), por lo que algunas funcionalidades están simplificadas o en desarrollo.
El acceso al panel de administración está simulado y no incluye autenticación completa.
La base de datos se gestiona mediante Supabase.

## Learn More

Para más información sobre las tecnologías utilizadas:

https://nextjs.org/docs
https://supabase.com/docs

## Deploy

El despliegue puede realizarse fácilmente en Vercel, aunque también es posible utilizar otros servicios compatibles con Next.js.

Más info:
https://nextjs.org/docs/deployment
