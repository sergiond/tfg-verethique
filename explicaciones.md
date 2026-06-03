# Explicaciones completas de Verethique

## 1. Qué es Verethique

Verethique es un directorio web de establecimientos de moda de cercanía evaluados con criterios ASG:

- Ambiental
- Social
- Gobernanza

La idea principal del proyecto es muy simple: no basta con que una marca diga que es sostenible; tiene que poder demostrarlo con evidencias. Por eso el proyecto no funciona como una tienda ni como una revista, sino como un sistema de revisión documental y publicación de resultados.

La frase que resume el proyecto es esta:

> Si no hay evidencia, no se puede dar por válido.

Esa idea se repite en la home, en la metodología, en la ficha de marca, en el formulario de contacto y en el panel de administración.

---

## 2. Qué problema resuelve

En moda hay mucha comunicación de marca y mucha promesa, pero no siempre hay documentos, datos o trazabilidad. El proyecto intenta resolver eso con una propuesta concreta:

- crear un directorio público claro
- revisar marcas con una metodología fija
- registrar solicitudes de revisión
- permitir que un administrador publique solo la información que ya ha contrastado
- transformar indicadores en puntuaciones visibles

No se trata de “premiar” a una marca por parecer buena, sino de ordenar la información para que cualquier persona entienda qué está comprobado y qué no.

---

## 3. Objetivo académico del proyecto

Este proyecto está planteado como TFG. Eso influye en varias decisiones:

- se busca un sistema entendible y defendible, no una arquitectura enorme
- se prioriza que el flujo completo se vea funcionando
- se acepta una autenticación de admin sencilla porque el objetivo es académico y demostrativo
- se documentan las decisiones técnicas para que puedan explicarse en una defensa oral

En otras palabras: no es una plataforma empresarial con decenas de roles y microservicios. Es una aplicación web completa, pero acotada, con un alcance razonable para un proyecto académico bien terminado.

---

## 4. Por qué se eligió cada tecnología

## 4.1 HTML

Aunque no haya archivos `.html` escritos a mano, el proyecto genera HTML a través de React y Next.js. Se eligió este enfoque porque:

- el contenido final sigue siendo HTML semántico
- permite construir páginas grandes con componentes reutilizables
- facilita mantener la misma estructura visual en todo el sitio
- es la base natural para accesibilidad y SEO

## 4.2 CSS

El diseño se resuelve con Tailwind CSS, que al final genera CSS normal. Se eligió porque:

- agiliza mucho el maquetado
- ayuda a mantener coherencia visual
- evita escribir hojas CSS enormes para cada componente
- permite controlar muy bien espaciados, tipografías, bordes, colores y estados

Además, existe un `globals.css` donde se define el sistema visual completo:

- colores principales
- radios de borde
- tokens de interfaz
- anillos de foco
- utilidades como `glass`, `glass-white` y `glass-dark`

## 4.3 TypeScript

Se eligió TypeScript porque da seguridad estructural al proyecto. En un sistema con formularios, datos de base de datos, puntuaciones y varias pantallas conectadas, es muy fácil cometer errores si todo fueran strings y objetos sin tipo.

TypeScript ayuda a:

- definir qué forma tiene una marca
- asegurar qué datos llegan desde Supabase
- reducir errores al editar formularios
- evitar inconsistencias entre páginas

Ejemplo claro: la interfaz `Brand` y el tipo `BrandDetail` permiten que el directorio y la ficha trabajen con datos coherentes.

## 4.4 React

React se eligió porque la interfaz tiene bastante comportamiento dinámico:

- filtros en el directorio
- formulario de admin con estado
- checks ASG que recalculan puntuaciones
- carga de marca según el parámetro `?id=...`
- animaciones y visuales interactivos

React permite dividir todo eso en componentes pequeños y más fáciles de mantener.

## 4.5 Next.js

Next.js se eligió por varias razones a la vez:

- da estructura de proyecto clara
- permite usar App Router
- facilita la organización por páginas
- integra bien fuentes, imágenes y metadata
- permite exportar la web como sitio estático

La última razón es clave: el proyecto estaba pensado para poder desplegarse en un hosting sencillo, como Hostalia. Por eso en `next.config.ts` se usa:

```ts
output: "export"
```

Esto hace que el proyecto genere una carpeta `out/` lista para publicar.

## 4.6 Supabase

Supabase se eligió como backend porque resuelve de forma simple y razonable:

- base de datos PostgreSQL
- lectura y escritura desde el frontend
- estructura suficiente para un TFG
- facilidad para crear tablas y probar cambios

No era necesario montar un backend propio en Express o Nest para este alcance. La lógica principal del proyecto está en la evaluación, la interfaz y la normalización de datos, no en construir un servidor complejo.

## 4.7 PostgreSQL y SQL

Supabase usa PostgreSQL, así que el proyecto también se apoya en SQL. Esto es importante porque:

- permite modelar bien tablas relacionales
- facilita validar restricciones
- encaja bien con estructuras como arrays de indicadores
- es una tecnología madura y defendible académicamente

Además, el proyecto usa migraciones SQL sencillas y claras, algo que en un TFG suma porque se entiende bien qué se está persistiendo y por qué.

## 4.8 Tailwind + shadcn

El proyecto mezcla dos ideas:

- diseño propio muy editorial en las páginas públicas
- componentes utilitarios simples en admin y formularios

Tailwind resuelve el estilo general y los componentes de `src/components/ui` ayudan a no repetir siempre la misma base para botones, inputs o textareas.

## 4.9 GSAP

GSAP se usa en la home para animaciones concretas. Se eligió porque:

- da mucha precisión
- permite animaciones suaves y controladas
- funciona bien con entradas, scroll y secuencias

No se usa para “decorar por decorar”, sino para reforzar el tono editorial del proyecto.

## 4.10 Lucide React

Se eligió para iconos porque:

- tiene un estilo limpio
- es ligero
- funciona bien con React
- mantiene coherencia visual

## 4.11 Node.js y npm

Se usan porque son la base práctica del ecosistema Next.js:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## 4.12 `.htaccess`

Se incluye `public/.htaccess` porque el hosting objetivo es Apache. Sirve para:

- soportar rutas limpias
- hacer que páginas como `/admin` o `/directorio` funcionen aunque el resultado generado sea `.html`

Esto es una decisión de despliegue, no de interfaz, y es importante porque conecta el proyecto con un entorno real de publicación.

---

## 5. Idea técnica principal del proyecto

La arquitectura general es esta:

1. el frontend se desarrolla con Next.js, React y TypeScript
2. las páginas públicas y el panel de admin se exportan como sitio estático
3. el navegador consulta los datos en Supabase con la clave pública `anon`
4. las marcas se guardan en la tabla `brands`
5. las solicitudes se guardan en la tabla `review_requests`
6. el admin revisa solicitudes, edita marcas, marca indicadores y publica resultados

Esto significa que el hosting sirve el HTML, el CSS y el JavaScript, pero los datos reales vienen desde Supabase.

Es un modelo muy adecuado para este TFG porque:

- el despliegue es sencillo
- el coste técnico es razonable
- el sistema sigue siendo completo
- hay persistencia real
- el flujo CRUD existe de verdad

---

## 6. Por qué la web es estática pero sigue siendo “real”

Puede parecer contradictorio, pero no lo es.

La web es estática en el sentido de que:

- genera archivos `html`, `css` y `js`
- se puede subir a un hosting básico
- no necesita un servidor Node en producción

Pero a la vez es “real” porque:

- consulta Supabase en tiempo de ejecución
- lee marcas publicadas
- guarda solicitudes
- permite editar contenido desde admin

La parte estática resuelve la publicación del sitio. La parte dinámica real la aporta la base de datos.

---

## 7. Estructura general de carpetas

La estructura importante del proyecto es esta:

```text
web/
  src/
    app/
    components/
    lib/
  public/
  README.md
  explicaciones.md
  package.json
  next.config.ts
```

### `src/app`

Contiene las páginas de la aplicación.

### `src/components`

Contiene piezas reutilizables de interfaz.

### `src/lib`

Contiene lógica y modelos de datos.

### `public`

Contiene recursos estáticos como imágenes y `.htaccess`.

---

## 8. Qué hace cada página y por qué existe

## 8.1 `/`

Es la home. Existe para:

- presentar la idea del proyecto
- transmitir el tono editorial
- explicar de forma visual qué significa evaluar marcas
- llevar al usuario al directorio o a la metodología

No es una portada neutra. Está pensada como una declaración de intenciones.

## 8.2 `/metodologia`

Existe para explicar públicamente cómo se evalúa. Esto es muy importante porque si la web va a puntuar marcas, tiene que explicar con claridad de dónde sale esa puntuación.

Su función no es solo informativa. También da legitimidad al sistema.

## 8.3 `/directorio`

Existe para mostrar el listado público de marcas publicadas. Es la parte más operativa para el usuario final.

Permite:

- buscar
- filtrar
- ordenar
- entrar a una ficha concreta

## 8.4 `/marca?id=ID_DE_MARCA`

Existe para mostrar una ficha pública detallada de una sola marca.

Se eligió una única página con parámetro `id` en lugar de generar `/marca/[id]` por una razón clara: el proyecto se exporta como estático y debe poder vivir en un hosting sencillo. Con una sola página física `/marca.html` y un `?id=...`, la ficha se puede rellenar con datos reales sin generar cientos de archivos.

Es una solución pragmática y muy defendible.

Si un evaluador preguntara “¿cómo has hecho exactamente para que funcione `/marca?id=ID_DE_MARCA`?”, la explicación correcta sería esta:

### Paso 1. La ruta pública realmente existe como página estática

En el código existe la ruta:

```text
src/app/marca/page.tsx
```

Cuando se ejecuta el build, Next.js genera una página estática para esa ruta. En la carpeta final exportada eso se traduce en:

```text
out/marca.html
```

Es decir, no se genera una página distinta para cada marca. Solo existe una página base de ficha.

### Paso 2. El hosting convierte `/marca` en `marca.html`

Como el proyecto se despliega en estático, el servidor no “ejecuta” Next.js en producción. Lo que hace es servir archivos.

Para que una URL limpia como:

```text
/marca?id=ID_DE_MARCA
```

funcione en Apache, se usa el archivo:

```text
public/.htaccess
```

Ahí hay una regla de reescritura:

```apache
RewriteRule ^(admin|contacto|directorio|marca|metodologia|revista)/?$ $1.html [L,QSA]
```

Esta regla hace dos cosas:

- si el navegador pide `/marca`, Apache entrega `marca.html`
- el flag `QSA` conserva la query string, es decir, mantiene `?id=ID_DE_MARCA`

Por tanto, el navegador no pierde el identificador de la marca.

### Paso 3. La página de marca delega la carga real en un componente cliente

El archivo:

```text
src/app/marca/page.tsx
```

no contiene la lógica de negocio principal. Lo que hace es renderizar:

- un `Suspense`
- un estado visual de carga
- el componente `BrandDetailClient`

Se hizo así para separar dos responsabilidades:

- la página base
- la carga dinámica de la marca concreta

### Paso 4. El navegador lee el parámetro `id`

Dentro de:

```text
src/app/marca/BrandDetailClient.tsx
```

se usa `useSearchParams()` de Next.js. Con eso, el componente lee la parte `?id=...` de la URL.

La lógica es esta, explicada de forma sencilla:

1. lee el parámetro `id`
2. le quita espacios si los hubiera
3. si no existe, muestra un mensaje tipo “abre esta página desde el directorio”
4. si existe pero no tiene forma válida de UUID, muestra “marca no disponible”

Esto evita hacer consultas inútiles o aceptar identificadores mal formados.

### Paso 5. Se valida que el identificador tenga formato correcto

Antes de consultar Supabase, el componente usa una expresión regular para comprobar que el `id` tenga formato UUID.

Esto sirve para:

- evitar peticiones absurdas
- reducir errores
- dejar claro que la ficha espera un identificador real de la base de datos

Es una validación sencilla, pero útil y fácil de defender.

### Paso 6. Se consulta Supabase con ese `id`

Si el `id` es válido y la configuración pública de Supabase existe, el componente hace una consulta a la tabla `brands`.

La consulta busca:

- una fila con ese `id`
- que además tenga `published = true`

Esto es importante: no basta con que la marca exista. También tiene que estar publicada. Así se evita que una marca en borrador sea visible desde fuera.

### Paso 7. Hay compatibilidad con esquema nuevo y esquema anterior

Primero se intenta una consulta completa con indicadores ASG nuevos. Si falla, el sistema prueba una consulta legacy, más simple.

Esto se hizo para que la ficha no dejara de funcionar si la base de datos todavía no estuviera actualizada del todo.

Es una decisión muy buena para un proyecto académico porque demuestra:

- compatibilidad
- tolerancia a cambios de esquema
- cuidado con las migraciones

### Paso 8. La fila cruda se transforma antes de pintarse

Cuando llega la fila desde Supabase, no se pinta directamente. Antes pasa por:

```text
src/lib/brand-data.ts
```

con la función `normalizeBrand()`.

Esa función:

- limpia y ordena los datos
- transforma arrays y campos opcionales
- calcula puntuaciones si hay indicadores estructurados
- resuelve imagen de fallback si hace falta
- devuelve un objeto listo para mostrar en la interfaz

Esto es importante porque separa:

- datos de base de datos
- datos preparados para pantalla

### Paso 9. La ficha se actualiza con el resultado

Si Supabase devuelve una marca válida:

- se guarda en el estado de React
- se cambia el estado visual a `loaded`
- la ficha completa se renderiza

Si no devuelve nada:

- se muestra “marca no disponible”

Si hay error de configuración o consulta:

- se muestra un mensaje de error controlado

### Paso 10. La ficha se puede refrescar al volver a la pestaña

Además, el componente escucha el evento `focus` del navegador. Eso significa que si alguien:

- cambia datos en admin
- vuelve a la pestaña de la ficha

la ficha intenta recargar la marca otra vez.

Esto se hizo para que el cambio se note rápido sin tener que rehacer toda la navegación.

### Respuesta corta para una defensa oral

Si te lo preguntan en una exposición y quieres responderlo en menos de un minuto, una respuesta buena sería esta:

> La ruta no genera una página física por cada marca. Lo que hago es exportar una única página estática `/marca.html`. Después, con `.htaccess`, Apache resuelve la URL limpia `/marca` y conserva la query string `?id=...`. En el navegador, el componente `BrandDetailClient` lee ese `id` con `useSearchParams`, valida que sea un UUID, consulta Supabase filtrando por `id` y por `published = true`, normaliza la fila con `normalizeBrand()` y entonces pinta la ficha. Así consigo una ficha dinámica real sobre un despliegue estático sencillo.

## 8.5 `/contacto`

Existe para recibir solicitudes y correcciones. Sin esta página, el sistema sería cerrado. Con ella:

- una marca puede pedir inclusión
- un usuario puede reportar greenwashing
- alguien puede corregir datos
- el proyecto obtiene un flujo real de revisión

## 8.6 `/admin`

Existe para cerrar el circuito completo del sistema:

- leer solicitudes
- tomar decisiones
- crear marcas
- editar marcas
- recalcular ASG
- publicar o despublicar

Sin `/admin`, el resto del sistema sería solo una maqueta de lectura.

---

## 9. Qué hace cada archivo principal

## 9.1 `src/app/layout.tsx`

Es el esqueleto global del sitio. Su función es:

- cargar fuentes
- aplicar el layout común
- renderizar navbar y footer
- envolver todo el contenido dentro de `main`

Se eligió tener un layout central porque así se evita repetir estructura en cada página.

## 9.2 `src/app/globals.css`

Es el centro del sistema visual. Aquí se definen:

- variables de color
- radios
- jerarquía de tokens
- foco accesible
- utilidades globales

Esto se hizo así para que el diseño tuviera una base consistente y no dependiera solo de clases sueltas repartidas por el proyecto.

## 9.3 `src/app/page.tsx`

Monta la home uniendo:

- `HeroSection`
- `DashboardSection`
- `ManifestoSection`
- `StickyArchiveSection`

Es un archivo muy limpio porque su papel no es contener lógica, sino ensamblar secciones.

## 9.4 `src/app/metodologia/page.tsx`

Explica el protocolo público. Se organizó por bloques:

- tesis
- dimensiones
- escala de resultados
- llamada final a contacto

Esto permite contar la metodología como una narrativa, no como una tabla seca.

## 9.5 `src/app/directorio/page.tsx`

Es la página con más lógica de interfaz pública. Su trabajo es:

- cargar marcas publicadas desde Supabase
- permitir búsqueda
- permitir filtros
- ordenar resultados
- mostrar estado de carga o error

Se optó por hacer esta lógica en cliente porque:

- el sitio es estático
- los filtros son interactivos
- el usuario necesita respuesta inmediata

## 9.6 `src/app/contacto/page.tsx`

Gestiona el formulario de solicitud. Hace varias cosas:

- normaliza URLs
- convierte evidencias extra en lista
- construye el payload de Supabase
- informa si el envío ha ido bien o mal

No se limita a pintar inputs. También sanea la entrada y da mensajes útiles.

## 9.7 `src/app/marca/page.tsx`

Su papel es muy pequeño pero importante:

- renderiza un `Suspense`
- muestra un fallback mientras carga la ficha
- delega la lógica a `BrandDetailClient`

Esto mantiene la página limpia y separa la capa de carga de la capa de detalle.

## 9.8 `src/app/marca/BrandDetailClient.tsx`

Es la pieza central de la ficha pública. Hace todo esto:

- lee el parámetro `id`
- valida que tenga forma de UUID
- consulta Supabase
- usa un selector moderno o uno legacy si hace falta
- normaliza la marca
- construye la ficha visual
- muestra indicadores verificados y pendientes
- muestra ubicación y tipo de tienda

Es una buena muestra de cómo separar datos crudos de datos listos para interfaz.

## 9.9 `src/app/admin/page.tsx`

Es el archivo más grande y el más funcional. Su tamaño se entiende porque contiene:

- login sencillo
- gestión de sesión
- carga de solicitudes
- carga de marcas
- aprobación y rechazo
- creación automática de borradores desde solicitudes
- edición manual de establecimientos
- cálculo automático de puntuaciones
- publicación y borrado

No es un archivo pequeño, pero su lógica está bastante ordenada por funciones auxiliares.

---

## 10. Qué hacen los componentes visuales principales

## 10.1 `Navbar`

La barra superior:

- detecta scroll
- cambia de aspecto según la página y la posición
- ofrece navegación desktop y móvil
- bloquea el scroll del `body` cuando el overlay móvil está abierto

Se diseñó así para dar continuidad visual y un comportamiento más editorial que una barra estática clásica.

## 10.2 `Footer`

El pie de página:

- cierra el recorrido del sitio
- repite enlaces importantes
- recuerda el contexto académico

No se dejó como un footer genérico porque en este proyecto también comunica identidad.

## 10.3 `BrandCard`

Es la tarjeta del directorio. Resume:

- imagen
- categoría
- nombre
- puntuaciones por dimensión
- acceso a la ficha completa

Existe para que el directorio no sea solo una lista de texto y para que el usuario compare marcas rápidamente.

## 10.4 `HeroSection`

Sirve para captar atención desde el primer segundo. Usa:

- imagen de fondo
- jerarquía tipográfica fuerte
- animación de entrada con GSAP
- CTAs claros

## 10.5 `DashboardSection`

Traduce el sistema ASG a piezas visuales:

- pila rotatoria de dimensiones
- texto tipo máquina de escribir
- simulación de búsqueda y filtrado

Se creó para que el visitante entienda el proyecto sin leer aún toda la metodología.

## 10.6 `ManifestoSection`

Es el bloque de posicionamiento ideológico del proyecto. Su función no es técnica, pero sí estratégica: decir con fuerza cuál es la postura del sistema frente al greenwashing.

## 10.7 `StickyArchiveSection`

Se creó para explicar las tres dimensiones de forma inmersiva. Usa `ScrollTrigger` para fijar tarjetas mientras entra la siguiente.

La razón de existir es doble:

- reforzar la experiencia editorial
- convertir la explicación de ASG en una narrativa más memorable

---

## 11. Modelo de datos y por qué está diseñado así

## 11.1 Tabla `brands`

La tabla `brands` guarda la información pública de cada establecimiento. Los campos se eligieron así:

- `id`: identificador único
- `slug`: nombre legible y estable
- `nombre`: nombre de la marca
- `eslogan`: frase breve de presentación
- `descripcion`: texto de contexto
- `calificacion_general`: etiqueta final visible
- `ambiental`, `social`, `gobernanza`: puntuaciones numéricas
- `ambiental_indicadores`, `social_indicadores`, `gobernanza_indicadores`: evidencias marcadas por dimensión
- `categorias`: una marca puede encajar en más de una categoría
- `tipo_tienda`: una marca puede ser online, física o ambas
- `pais`, `ciudad`: ubicación pública
- `web`, `instagram`: enlaces
- `published`: separa borrador interno de publicación pública

### Por qué hay arrays

Se usan arrays en `categorias`, `tipo_tienda` e indicadores porque:

- una marca puede tener varios valores a la vez
- evita crear tablas relacionales innecesarias para un TFG de este alcance
- simplifica la escritura y lectura desde frontend

Es una decisión pragmática: no es el modelo más normalizado posible, pero sí uno muy razonable para el problema real.

## 11.2 Tabla `review_requests`

Guarda solicitudes externas. Sus campos permiten:

- saber quién envía la petición
- sobre qué marca habla
- por qué motivo
- qué mensaje aporta
- qué evidencias adjunta
- en qué estado está la revisión
- qué nota interna dejó el admin

Sin esta tabla no existiría trazabilidad del proceso de revisión.

---

## 12. La lógica ASG y por qué funciona así

El sistema se basa en 15 indicadores:

- 5 ambientales
- 5 sociales
- 5 de gobernanza

Cada indicador marcado suma 1 punto en su dimensión. Por eso cada dimensión va de 0 a 5.

### Por qué se escogió esta escala

Se eligió porque:

- es fácil de entender
- es fácil de defender
- evita fórmulas artificialmente complejas
- permite explicar con claridad la relación entre evidencia y puntuación

### Por qué existe el valor 0

Porque una marca recién creada puede no tener todavía ninguna evidencia marcada. Si no existiera el 0, el sistema estaría forzando una valoración positiva sin base real.

### Cómo sale la valoración general

La función `calculateOverallRating` usa:

- la media de las tres dimensiones
- la puntuación mínima

Esto evita que una marca compense una debilidad grave con una sola dimensión alta.

La lógica actual es:

- `Genial`: media >= 4.2 y mínimo >= 3
- `Bueno`: media >= 3 y mínimo >= 2
- `Regular`: media >= 1.5
- `Evitar`: por debajo de eso

Esta decisión es importante porque transmite que el sistema no premia solo un buen resultado parcial.

---

## 13. Funciones importantes explicadas de forma sencilla

## 13.1 `src/lib/asg-indicators.ts`

Este archivo es el corazón metodológico del proyecto.

### `ASG_INDICATOR_GROUPS`

Define el catálogo completo de indicadores. Cada indicador tiene:

- `id`
- dimensión
- título
- descripción
- pista de evidencia

Se hizo así para que la metodología:

- esté centralizada
- sea reutilizable
- alimente tanto el admin como la ficha pública

### `emptyASGIndicatorEvidence()`

Devuelve un objeto vacío con las tres dimensiones preparadas. Se usa para empezar formularios sin errores de estructura.

### `normalizeIndicatorIds()`

Recibe una dimensión y una lista de ids. Limpia la lista y deja solo los ids válidos para esa dimensión.

Sirve para evitar que se guarden indicadores inventados o cruzados donde no toca.

### `normalizeASGIndicatorEvidence()`

Normaliza el objeto completo de evidencias. Es una capa de seguridad y limpieza antes de calcular o mostrar nada.

### `hasStructuredEvidence()`

Comprueba si existe al menos un indicador marcado. Permite decidir si se calcula desde evidencias o si se usan valores legacy.

### `calculateASGScores()`

Cuenta cuántos indicadores válidos hay en cada dimensión.

### `calculateOverallRating()`

Convierte las puntuaciones numéricas en una etiqueta legible.

### `getSelectedIndicators()`

Devuelve los indicadores que sí están marcados. Se usa en “Indicadores verificados”.

### `getMissingIndicators()`

Devuelve los que no están marcados. Se usa en “Indicadores pendientes de comprobar”.

## 13.2 `src/lib/brand-data.ts`

Este archivo conecta la base de datos con la interfaz.

### `parseList()`

Convierte un valor que puede venir como array, string o null en un array limpio.

Es útil porque Supabase o datos antiguos pueden traer formatos distintos.

### `normalizeRating()`

Verifica que la calificación general sea una de las válidas.

### `getFallbackImage()`

Asigna una imagen estable a partir del id. Así una marca sin imagen propia no rompe el diseño.

### `toIndicatorEvidence()`

Convierte las columnas de indicadores en el formato interno que espera la aplicación.

### `normalizeBrand()`

Es probablemente la función más importante del archivo. Toma una fila cruda de Supabase y la transforma en un objeto listo para la interfaz.

Hace varias cosas:

- parsea categorías
- construye las evidencias
- calcula puntuaciones si hay datos estructurados
- si no, usa valores legacy
- resuelve imagen de fallback
- mapea nombres de base de datos a nombres más cómodos de frontend

### `mapFallbackBrand()` y `getFallbackBrandList()`

Preparan marcas de ejemplo. Son útiles como apoyo de desarrollo o compatibilidad de etapas anteriores del proyecto.

## 13.3 `src/app/contacto/page.tsx`

### `toFileList()`

Convierte un texto con URLs separadas por comas o saltos de línea en una lista limpia.

### `normalizeUrl()`

Si el usuario escribe `www...`, añade `https://`. Sirve para mejorar experiencia sin obligar a que la persona escriba la URL perfecta.

### `toNormalizedFileList()`

Aplica la normalización a todas las evidencias extra.

### `formatSupabaseError()`

Traduce errores técnicos a mensajes más entendibles.

### `setField()`

Actualiza cualquier campo del formulario sin repetir lógica.

### `onSubmit()`

Hace el trabajo principal:

- frena el submit normal
- valida la configuración
- prepara el payload
- inserta en Supabase
- muestra resultado

## 13.4 `src/app/directorio/page.tsx`

### `loadBrands()`

Carga marcas publicadas desde Supabase.

Si falla la consulta moderna, prueba una consulta legacy. Esto es una decisión de compatibilidad para no romper la aplicación si la base de datos aún no tiene todas las columnas nuevas.

### `toggleRating()`

Gestiona los checks de filtro por valoración.

### `filteredBrands`

Es un `useMemo` que:

- aplica búsqueda
- aplica filtro por categoría
- aplica filtro por rating
- aplica orden

Es clave porque concentra toda la lógica de filtrado en un solo punto.

## 13.5 `src/app/marca/BrandDetailClient.tsx`

### `refreshBrand()`

Es la función central de la ficha pública.

Hace este recorrido:

1. comprueba si hay `id`
2. valida que el `id` tenga forma de UUID
3. comprueba configuración de Supabase
4. consulta la tabla `brands`
5. si la consulta moderna falla, prueba la legacy
6. normaliza la marca
7. actualiza estados visuales

### `formatLocation()`

Une ciudad y país en una sola cadena legible.

### `formatStoreTypes()`

Convierte valores internos como `online` y `fisica` en texto visible para la ficha.

### `BrandInfoRow`

Pinta una fila simple con icono, etiqueta y valor. Se usa para ubicación y tipo de tienda.

### `BrandStateMessage`

Es un componente de estado para mostrar:

- falta de id
- carga
- error
- marca no encontrada

Esto evita repetir el mismo diseño varias veces.

### `DimensionScoreCard`

Pinta cada una de las tres tarjetas de puntuación.

## 13.6 `src/app/admin/page.tsx`

Este archivo tiene muchas funciones porque resuelve casi toda la lógica interna.

### `parseList()` y `parseCsv()`

Sirven para convertir cadenas y arrays en listas limpias.

### `toIndicatorEvidence()`

Pasa las columnas de indicadores del formato base de datos al formato que espera el formulario.

### `toSlug()`

Convierte un nombre en un slug:

- minúsculas
- sin tildes
- sin caracteres raros
- con guiones

Esto es importante porque un slug no debe depender de cómo escriba el usuario los acentos o símbolos.

### `emptyBrandForm()`

Devuelve un formulario vacío, listo para crear una marca desde cero.

### `toBrandDraftFromRequest()`

Convierte una solicitud de revisión en un borrador de establecimiento.

Sirve para ahorrar trabajo al admin: si aprueba una solicitud, ya tiene una base desde la que seguir editando.

### `toBrandPayloadFromRequest()`

Crea el payload mínimo para insertar una marca automática desde una solicitud.

Se crea inicialmente como borrador y con puntuación 0 para no inventar valores.

### `toBrandForm()`

Convierte una fila real de la base de datos en el estado del formulario de edición.

### `getBrandInsertErrorMessage()`

Traduce ciertos errores de base de datos a mensajes útiles, especialmente los relacionados con restricciones antiguas de puntuación.

### `loadRequests()`

Carga solicitudes de revisión desde Supabase y normaliza su estado.

### `loadBrands()`

Carga establecimientos desde Supabase. También detecta si el esquema ASG nuevo está disponible.

### `handleLogin()`

Valida usuario y contraseña contra las credenciales académicas del panel. Si son correctas, guarda una marca de sesión en `sessionStorage`.

### `handleLogout()`

Limpia sesión y resetea el estado del panel.

### `toggleASGIndicator()`

Marca o desmarca un indicador en el formulario. Esta función es clave porque alimenta el cálculo automático de puntuaciones.

### `saveReview()`

Guarda notas de revisión y puede cambiar el estado de una solicitud a:

- pendiente
- aprobada
- rechazada

### `saveBrand()`

Es la función más importante del CRUD de marcas. Hace varias cosas:

- prepara el payload final
- convierte checks en arrays
- guarda puntuaciones calculadas
- guarda valoración general
- inserta o actualiza en Supabase
- refresca el estado local

### `deleteBrand()`

Elimina un establecimiento tras confirmación.

### `PublicationSwitch`

Muestra un interruptor visual para decidir si una marca es pública o no. Se eligió este formato porque comunica mejor el estado que un checkbox simple.

### `IndicatorChecklist`

Pinta los indicadores de cada dimensión en admin. Es clave porque convierte la metodología en una interfaz de trabajo clara.

## 13.7 `src/components/home`

### `HeroSection`

Usa GSAP para animar la entrada de los elementos principales.

### `ASGRatingStack`

Rota visualmente las tres dimensiones ASG para que el usuario entienda que el análisis tiene capas.

### `AnalysisTypewriter`

Muestra mensajes rotatorios para enseñar ejemplos de criterios evaluados.

### `FilterScheduler`

Simula una búsqueda y un filtrado en el directorio. No es funcional, es pedagógico.

### `ManifestoSection`

Anima el manifiesto con scroll.

### `StickyArchiveSection`

Fija tarjetas con `ScrollTrigger` para explicar las dimensiones con un efecto más inmersivo.

---

## 14. Decisiones de diseño visual

El proyecto no busca apariencia de dashboard corporativo. Busca una identidad editorial. Por eso:

- se usan tipografías con carácter
- hay contraste entre serif, sans y mono
- el fondo principal es crema, no blanco puro
- el texto principal es carbón, no negro plano
- se usan colores musgo y arcilla para transmitir naturaleza y materia
- los bloques tienen bordes muy redondeados
- se combina imagen, texto y ritmo visual

La intención era que el sitio pareciera una mezcla entre:

- archivo
- manifiesto
- directorio crítico

No una tienda ni una landing de marketing.

---

## 15. Decisiones técnicas importantes y cómo defenderlas

## 15.1 Por qué no hay backend propio

Porque para este alcance no era necesario. Supabase resuelve bien persistencia, y el valor del proyecto está en:

- la metodología
- la interfaz
- la normalización de datos
- el flujo de revisión

Hacer un backend entero habría aumentado complejidad sin aportar tanto valor académico.

## 15.2 Por qué no hay SSR ni rutas dinámicas reales por marca

Porque el despliegue objetivo es un hosting sencillo. Con `output: "export"` se priorizó compatibilidad de despliegue.

La solución de `/marca?id=...` evita generar una página física por marca y permite mantener la ficha conectada a datos reales.

## 15.3 Por qué el admin usa una autenticación simple

Porque el proyecto es académico y está pensado para evaluación, no para un entorno de producción con múltiples administradores.

Además, al ser un sitio estático sin backend propio, una autenticación compleja en servidor habría cambiado totalmente el alcance del proyecto.

## 15.4 Por qué las puntuaciones no se escriben a mano

Porque el proyecto quería que la nota saliera de la evidencia, no de una decisión subjetiva manual en cada guardado.

Los checks ASG:

- hacen visible la lógica
- reducen arbitrariedad
- permiten recalcular automáticamente
- conectan admin, ficha y directorio

## 15.5 Por qué el directorio filtra en cliente

Porque:

- las marcas no son miles ni millones
- el sitio es estático
- la experiencia debía ser rápida
- era mejor evitar complejidad innecesaria

## 15.6 Por qué se mantiene una metodología pública

Porque puntuar sin explicar el criterio sería poco defendible. La página de metodología convierte la evaluación en algo transparente.

---

## 16. Seguridad y límites reales del proyecto

Aquí conviene ser honesto si te lo preguntan.

### Lo que sí hace bien

- tipado fuerte con TypeScript
- separación razonable entre datos y vista
- normalización de evidencias
- validación básica de identificadores
- exportación estática fácil de desplegar
- control de publicación con `published`
- interfaz relativamente cuidada en accesibilidad y contraste

### Lo que no pretende ser todavía

- un sistema de autenticación robusto de producción
- un panel multiusuario con roles
- una plataforma con auditoría completa de permisos
- un sistema con backend propio y sesiones seguras

La manera correcta de defender esto no es ocultarlo, sino decir que el proyecto ha priorizado un alcance realista y completo para un TFG.

---

## 17. Despliegue y por qué se pensó así

El despliegue está pensado para ser sencillo:

- `npm run build` genera `out/`
- `out/` se puede servir en local
- `out/` se puede subir a hosting estático
- `.htaccess` resuelve rutas limpias en Apache

La decisión de usar `images.unoptimized: true` en Next también va en esta línea: evitar dependencias de optimización en servidor, que no encajan bien con hosting básico.

---

## 18. Qué papel tiene cada variable de entorno

En `.env.example` aparecen dos:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Se usan para conectar el frontend con Supabase.

Son `NEXT_PUBLIC_` porque la app necesita leerlas en cliente. Esto es coherente con la arquitectura escogida, donde el navegador consulta directamente la base de datos pública bajo las políticas adecuadas.

---

## 19. Cómo se conectan entre sí las páginas

El flujo completo del sistema es este:

1. una persona visita la home y entiende la idea
2. consulta la metodología si quiere saber cómo se evalúa
3. entra al directorio para ver marcas publicadas
4. abre una ficha concreta para ver detalle e indicadores
5. si detecta un error o quiere proponer algo, usa contacto
6. la solicitud llega al panel admin
7. el admin revisa, anota, aprueba o rechaza
8. si hace falta, crea o edita el establecimiento
9. marca indicadores ASG
10. el sistema recalcula puntuaciones
11. si la marca se publica, aparece en directorio y ficha

Eso es importante porque demuestra que el proyecto no son pantallas aisladas. Es un circuito completo.

---

## 20. Qué decisiones se tomaron pensando en accesibilidad

Aunque no sea una web institucional, sí se tuvieron en cuenta varios puntos:

- foco visible en elementos interactivos
- labels en formularios
- `aria-label` y `sr-only` cuando hace falta
- landmarks semánticos
- contraste revisado
- navegación clara
- mensajes de estado legibles

La accesibilidad no se resolvió solo al final, aunque sí hubo un cierre de revisión final para contraste y estructura.

---

## 21. Qué parte del proyecto es más importante técnicamente

Si hubiera que señalar una sola parte, sería la combinación entre:

- `src/lib/asg-indicators.ts`
- `src/lib/brand-data.ts`
- `src/app/admin/page.tsx`
- `src/app/marca/BrandDetailClient.tsx`

Ahí está el núcleo real del sistema:

- definición de indicadores
- transformación de datos
- guardado de evidencias
- cálculo de puntuaciones
- visualización pública

La home y el resto de páginas comunican muy bien el proyecto, pero el valor técnico fuerte está en ese flujo.

---

## 22. Preguntas típicas de defensa y respuestas recomendables

## 22.1 “¿Por qué Next.js y no HTML, CSS y JS puro?”

Porque había varias páginas, componentes reutilizables, formularios con estado, lógica de datos y una ficha que depende de parámetros. Con HTML puro el mantenimiento sería peor y la reutilización mucho más baja.

## 22.2 “¿Por qué TypeScript?”

Porque el proyecto maneja estructuras de datos concretas y puntuaciones derivadas. TypeScript reduce errores y hace el código más fácil de sostener.

## 22.3 “¿Por qué Supabase?”

Porque resolvía base de datos real, tablas, consultas y persistencia sin obligar a construir un backend entero, lo que habría desviado el esfuerzo del objetivo principal del TFG.

## 22.4 “¿Por qué la ficha usa `?id=` y no una ruta por marca?”

Porque el proyecto está exportado como estático y se va a desplegar en hosting sencillo. Esta solución mantiene compatibilidad de despliegue y evita complejidad innecesaria.

## 22.5 “¿Por qué los indicadores son checkboxes?”

Porque el proyecto quería vincular la nota con evidencia verificable. Un checkbox marcado significa que ese punto sí tiene respaldo suficiente.

## 22.6 “¿Por qué el admin tiene login simple?”

Porque el proyecto es académico y se priorizó mostrar el flujo funcional completo con el alcance disponible. No era un proyecto orientado a seguridad empresarial avanzada.

## 22.7 “¿Por qué no generas automáticamente una nota más compleja?”

Porque una escala de 0 a 5 basada en indicadores concretos es mucho más clara de explicar, probar y defender. Una fórmula más compleja no siempre sería mejor; solo sería más difícil de justificar.

## 22.8 “¿Qué es lo más original del proyecto?”

La unión entre:

- metodología pública
- revisión documental
- panel de gestión
- cálculo automático
- ficha pública con evidencias visibles

No es solo una web bonita. Es un sistema pequeño pero completo.

---

## 23. Limitaciones que conviene reconocer sin que resten valor

- el login admin es simple
- la app depende de las políticas correctas de Supabase
- el proyecto no incluye backend propio
- la escalabilidad masiva no es el foco principal
- algunos campos del modelo inicial se mantienen por compatibilidad, aunque hoy el núcleo real está en ASG

Reconocer esto no debilita la defensa. Al contrario: demuestra criterio.

---

## 24. Resumen muy corto para memorizar

Si necesitas una explicación breve de todo el proyecto, esta sería una buena:

Verethique es un directorio web de moda de cercanía que evalúa marcas con criterios ASG. Está construido con Next.js, React y TypeScript en el frontend, y Supabase como persistencia. La arquitectura se ha pensado para despliegue estático en un hosting sencillo, por eso la ficha de marca usa una única página `/marca` con parámetro `id`. El núcleo del sistema está en los indicadores ASG: el admin marca evidencias verificadas, esas evidencias generan puntuaciones de 0 a 5 por dimensión, y la interfaz pública muestra tanto la nota como los indicadores comprobados y los que siguen pendientes. El proyecto no busca solo listar marcas, sino ordenar información verificable y hacer visible una metodología de evaluación.

---

## 25. Conclusión

Lo importante de Verethique no es solo que “funcione”, sino que cada decisión tiene un porqué claro:

- Next.js por estructura y exportación estática
- React por interactividad
- TypeScript por control del modelo
- Supabase por persistencia real sin sobredimensionar el sistema
- metodología ASG para dar sentido a la evaluación
- admin para cerrar el ciclo completo
- ficha única con `?id=` para encajar en hosting sencillo

La mejor manera de defender el proyecto es explicar que no se ha intentado hacer “todo”, sino hacer bien un sistema coherente, publicable, entendible y justificable de principio a fin.
