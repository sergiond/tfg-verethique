# Verethique

Verethique es una plataforma web para consultar, evaluar y administrar establecimientos de moda de cercania con criterios ASG: ambiental, social y gobernanza.

Este repositorio forma parte de un Trabajo Final de Grado. El panel de administracion y sus credenciales se documentan dentro del README para facilitar la evaluacion academica y la reproduccion del proyecto.

La aplicacion permite:

- Consultar un directorio publico de marcas y establecimientos.
- Ver una ficha individual por marca.
- Revisar puntuaciones ASG por dimension.
- Consultar las evidencias marcadas en cada ficha.
- Enviar solicitudes de revision documental.
- Gestionar marcas y solicitudes desde el panel de administracion.

## Stack

- Next.js 16.2
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

alter table public.brands
  drop constraint if exists brands_ambiental_check,
  drop constraint if exists brands_social_check,
  drop constraint if exists brands_gobernanza_check;

alter table public.brands
  add constraint brands_ambiental_check check (ambiental >= 0 and ambiental <= 5),
  add constraint brands_social_check check (social >= 0 and social <= 5),
  add constraint brands_gobernanza_check check (gobernanza >= 0 and gobernanza <= 5);
```

Las columnas `ambiental`, `social`, `gobernanza` y `calificacion_general` se calculan a partir de los indicadores ASG marcados en el panel de administracion.

La escala ASG permite `0` porque una marca recien creada desde una solicitud aprobada puede empezar sin indicadores marcados. Si Supabase muestra un error como `brands_ambiental_check`, significa que la tabla conserva una restriccion antigua que no permite el valor `0`; ejecuta la migracion anterior y vuelve a aprobar la solicitud.

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

Credenciales del panel:

```text
Usuario: admin
Contrasena: modaetica2025
```

Estas credenciales se mantienen visibles porque el proyecto tiene finalidad academica. El acceso permite revisar el funcionamiento completo del CRUD, las solicitudes y los indicadores ASG durante la evaluacion.

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
- `/marca?id=ID_DE_MARCA` -> ficha publica de marca
- `/contacto` -> formulario de revision
- `/admin` -> panel de administracion

La ficha de marca usa una unica pagina estatica (`/marca`) y recibe el identificador mediante `?id=...`. De esta forma, un establecimiento nuevo creado desde `/admin` puede abrir su ficha sin generar una pagina fisica nueva por cada marca.

## Formas de prueba y despliegue

El proyecto esta preparado para funcionar como sitio estatico. La configuracion `output: "export"` genera una carpeta `out/` con HTML, CSS, JavaScript y recursos listos para servir.

Hay dos formas principales de probarlo o publicarlo.

### Opcion 1: usar directamente la carpeta `out/`

Esta opcion sirve cuando ya existe una carpeta `out/` generada. Es la forma mas sencilla para revisar el sitio sin montar todo el entorno de desarrollo.

Usando el contenido del `out/` puede hacer dos cosas:

- Probarlo en su equipo desde un IDE o terminal.
- Subirlo directamente a un hosting estatico.

Para probarlo en local, copia la carpeta `out/` completa y sirvela con un servidor estatico:

```bash
npx serve out -l 3000
```

Despues abre:

```text
http://localhost:3000
```

No es recomendable abrir `index.html` directamente con doble clic, porque algunas rutas, scripts y llamadas al navegador pueden comportarse de forma distinta. La prueba correcta es servir la carpeta con un servidor local.

Para subirlo a un hosting, copia el contenido de `out/` al directorio publico del alojamiento, por ejemplo `public_html`,`httpdocs`, `www` o el nombre equivalente que use el proveedor.

El contenido de `out/` ofrece la experiencia real del sitio publicado: directorio, fichas, contacto, metodologia y panel de administracion. Las conexiones con Supabase usan los valores publicos configurados en el momento del build. Si se quiere usar otro proyecto de Supabase, hay que generar de nuevo `out/` con las nuevas variables de entorno.

### Opcion 2: despliegue completo desde el proyecto

Esta opcion sirve cuando se parte del codigo completo y se quiere reproducir todo el proceso: instalar dependencias, configurar Supabase, generar el build y publicar el sitio.

Entra en la carpeta del proyecto web:

```bash
cd web
```

Instala dependencias:

```bash
npm install
```

Crea y configura `.env.local` con los datos publicos de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE
```

Comprueba el codigo:

```bash
npm run lint
```

Genera la version estatica:

```bash
npm run build
```

El resultado se genera en:

```text
out/
```

Para probar esa version antes de subirla:

```bash
npx serve out -l 3000
```

Abre:

```text
http://localhost:3000
```

Cuando la prueba sea correcta, sube el contenido de `out/` al directorio publico del hosting.

El archivo `public/.htaccess` se copia automaticamente a `out/.htaccess` durante el build. Este archivo permite que un hosting Apache como Hostalia resuelva rutas limpias:

```text
/admin
/directorio
/marca?id=ID_DE_MARCA
/contacto
```

En hostings que no resuelven rutas limpias de Next, usa las rutas `.html` generadas. Por ejemplo:

```text
/admin.html
/directorio.html
/contacto.html
/marca.html?id=ID_DE_MARCA
```

Si las rutas limpias no funcionan, comprueba que `.htaccess` se haya subido junto con el resto de archivos de `out/`.

## Desarrollo local

Para trabajar sobre el codigo durante el desarrollo, usa el servidor de Next:

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Estructura del proyecto

```text
web/
  src/
    app/
      page.tsx
      metodologia/page.tsx
      directorio/page.tsx
      marca/page.tsx
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
    .htaccess
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
2. Comprueba que las restricciones `brands_ambiental_check`, `brands_social_check` y `brands_gobernanza_check` permiten valores de `0` a `5`.
3. Revisa permisos de escritura sobre `brands`.
4. Guarda una marca desde `/admin`.
5. Recarga `/directorio` y la ficha correspondiente.

Si al aprobar una solicitud aparece un error de puntuaciones ASG a `0`, ejecuta la migracion del apartado de base de datos y vuelve a pulsar `Aprobar solicitud`. La solicitud ya puede estar marcada como aprobada, pero el panel volvera a intentar crear el establecimiento.

Si una ficha no existe:

1. Comprueba que la marca esta publicada.
2. Revisa que la URL incluya `?id=ID_DE_MARCA`.
3. Revisa permisos de lectura sobre `brands`.

## Enlaces

- Next.js: `https://nextjs.org/docs`
- Supabase: `https://supabase.com/docs`
- Node.js: `https://nodejs.org/`
