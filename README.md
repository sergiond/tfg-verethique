# Verethique

Verethique es una plataforma web para consultar, evaluar y administrar establecimientos de moda de cercania con criterios ASG: ambiental, social y gobernanza.

La aplicacion permite:

- Consultar un directorio publico de marcas y establecimientos.
- Ver una ficha individual por marca.
- Revisar puntuaciones ASG por dimension.
- Consultar las evidencias marcadas en cada ficha.
- Enviar solicitudes de revision documental.
- Gestionar marcas y solicitudes desde el panel de administracion.

## Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS

## Requisitos

- Node.js 20 o superior
- npm
- Proyecto de Supabase con las tablas indicadas en este documento

Comprueba la instalacion de Node y npm:

```bash
node -v
npm -v
```

## Instalacion

Entra en la carpeta del proyecto web:

```bash
cd web
```

Instala dependencias:

```bash
npm install
```

Crea el archivo de entorno:

```powershell
Copy-Item .env.example .env.local
```

En macOS o Linux:

```bash
cp .env.example .env.local
```

Configura `.env.local` con los datos de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE
```

Los valores se encuentran en Supabase, dentro de `Project Settings` -> `API`.

## Base de datos

Ejecuta este SQL en el editor SQL de Supabase:

```sql
create extension if not exists pgcrypto;

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  eslogan text,
  descripcion text,
  calificacion_general text not null default 'Evitar',
  ambiental int2 not null default 0,
  social int2 not null default 0,
  gobernanza int2 not null default 0,
  ambiental_indicadores text[] not null default '{}',
  social_indicadores text[] not null default '{}',
  gobernanza_indicadores text[] not null default '{}',
  asg_metodologia_version text not null default 'asg-v1',
  categorias text[] not null default '{}',
  tipo_tienda text[] not null default '{}',
  pais text,
  ciudad text,
  web text,
  instagram text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  applicant_name text,
  applicant_email text,
  brand_name text,
  reason text,
  message text,
  evidence_url text,
  evidence_files text[] not null default '{}',
  status text not null default 'pendiente',
  admin_notes text,
  reviewed_at timestamptz
);
```

Si la tabla `brands` ya existia antes de incorporar los indicadores ASG, aplica esta migracion:

```sql
alter table public.brands
  alter column calificacion_general set default 'Evitar',
  alter column ambiental set default 0,
  alter column social set default 0,
  alter column gobernanza set default 0;

alter table public.brands
  add column if not exists ambiental_indicadores text[] not null default '{}',
  add column if not exists social_indicadores text[] not null default '{}',
  add column if not exists gobernanza_indicadores text[] not null default '{}',
  add column if not exists asg_metodologia_version text not null default 'asg-v1';
```

Las columnas `ambiental`, `social`, `gobernanza` y `calificacion_general` se calculan a partir de los indicadores ASG marcados en el panel de administracion.

## Permisos de Supabase

La aplicacion usa la clave publica `anon` desde el cliente. Las politicas de Supabase deben permitir las operaciones que usa cada pantalla.

Para trabajar en local con las tablas abiertas:

```sql
alter table public.brands disable row level security;
alter table public.review_requests disable row level security;
```

Si se usa RLS, las politicas deben cubrir:

- Lectura publica de marcas con `published = true`.
- Insercion de solicitudes en `review_requests`.
- Lectura y escritura de marcas desde el panel de administracion.
- Lectura y actualizacion de solicitudes desde el panel de administracion.

## Sistema ASG

Cada marca se evalua con 15 indicadores:

- 5 ambientales
- 5 sociales
- 5 de gobernanza

Cada indicador marcado suma 1 punto dentro de su dimension. Por eso cada dimension se puntua de `0` a `5`.

La valoracion general se calcula con la media de las tres dimensiones y tiene en cuenta la dimension mas baja:

- `Genial`: media alta y ninguna dimension por debajo de 3.
- `Bueno`: media positiva y ninguna dimension por debajo de 2.
- `Regular`: evidencia parcial.
- `Evitar`: evidencia insuficiente.

Los indicadores marcados se muestran en la ficha de marca dentro de `Archivo de Evidencia`. Los indicadores no marcados aparecen como brechas documentales.

Los indicadores disponibles estan definidos en:

```text
src/lib/asg-indicators.ts
```

La normalizacion de datos, los calculos y los fallbacks de marca estan en:

```text
src/lib/brand-data.ts
```

## Panel de administracion

Ruta:

```text
/admin
```

Credenciales configuradas en el codigo:

```text
Usuario: admin
Contrasena: modaetica2025
```

Desde el panel se pueden:

- Revisar solicitudes.
- Crear establecimientos.
- Editar establecimientos.
- Publicar o despublicar marcas.
- Marcar indicadores ASG.
- Guardar puntuaciones derivadas de los indicadores.

Al guardar una marca, el sistema actualiza:

- Indicadores ambientales, sociales y de gobernanza.
- Puntuaciones `ambiental`, `social` y `gobernanza`.
- Valoracion general.
- Datos publicos usados por el directorio y la ficha.

## Rutas principales

- `/` -> inicio
- `/metodologia` -> metodologia de evaluacion
- `/directorio` -> listado de marcas publicadas
- `/marca/[id]` -> ficha publica de marca
- `/contacto` -> formulario de revision
- `/admin` -> panel de administracion

## Ejecutar en local

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Build estatico

El proyecto esta configurado con `output: "export"`.

Genera la version estatica:

```bash
npm run build
```

El resultado se genera en:

```text
out/
```

Para probar la version estatica en local:

```bash
npx serve out -l 3000
```

Abre:

```text
http://localhost:3000
```

## Publicacion en hosting estatico

Sube el contenido de `out/` al directorio publico del hosting.

En hostings que no resuelven rutas limpias de Next, usa las rutas `.html` generadas. Por ejemplo:

```text
/admin.html
/directorio.html
/contacto.html
```

Para rutas limpias como `/admin`, configura reglas de reescritura en el hosting.

## Estructura del proyecto

```text
web/
  src/
    app/
      page.tsx
      metodologia/page.tsx
      directorio/page.tsx
      marca/[id]/page.tsx
      contacto/page.tsx
      admin/page.tsx
    components/
    lib/
      asg-indicators.ts
      brand-data.ts
      data.ts
      ratings.ts
      types.ts
  public/
  next.config.ts
  package.json
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run start
```

Uso habitual:

- `npm run dev` para desarrollo local.
- `npm run lint` para revisar el codigo.
- `npm run build` para generar `out/`.

## Comprobaciones habituales

Si el directorio no muestra marcas:

1. Comprueba que existen filas en `brands`.
2. Comprueba que las marcas tienen `published = true`.
3. Revisa las politicas RLS de Supabase.
4. Revisa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Si los indicadores ASG no se guardan:

1. Comprueba que existen las columnas `ambiental_indicadores`, `social_indicadores` y `gobernanza_indicadores`.
2. Revisa permisos de escritura sobre `brands`.
3. Guarda una marca desde `/admin`.
4. Recarga `/directorio` y la ficha correspondiente.

Si una ficha no existe:

1. Comprueba que la marca esta publicada.
2. Ejecuta `npm run build` para regenerar las rutas estaticas.
3. Revisa que la ruta use el `id` de la marca.

## Enlaces

- Next.js: `https://nextjs.org/docs`
- Supabase: `https://supabase.com/docs`
- Node.js: `https://nodejs.org/`
