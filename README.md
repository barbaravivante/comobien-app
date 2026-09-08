# ComoBien — Nutrición y seguimiento de peso

App (PWA, se instala en el celular) para seguimiento de peso y alimentación,
con recomendaciones basadas en las Guías Alimentarias para la Población
Argentina, y una función para escanear el tiquet del supermercado y ver qué
se compra de más o qué conviene sumar.

Sigue el mismo esquema que **Huellas**: repo propio, deploy propio en Vercel,
y cada comprador entra con su propio usuario y contraseña, creados
automáticamente cuando compra (ver `CONFIGURAR_ACCESO.md` en esta misma
carpeta para el detalle).

## Qué incluye la v1

- Perfil (peso, altura, edad, actividad, objetivo) y cálculo automático de
  calorías y macros diarios.
- Registro de comidas contra una base de datos de alimentos comunes en
  Argentina, con recomendaciones del día.
- Seguimiento de peso con historial y evolución.
- Escaneo de tiquet del supermercado (foto), leyendo el texto directo en el
  celular (gratis, sin límite de usos — ver "Escaneo de tiquets: cómo lee el
  texto" más abajo) y comparando la compra contra los grupos de alimentos
  recomendados.
- Todo el dato personal (peso, comidas) se guarda solo en el celular de la
  persona (localStorage), igual que en Huellas. La foto del tiquet tampoco
  sale del celular: se lee ahí mismo, no se manda a ningún servidor.

## Cómo desplegarla (Vercel) — paso a paso

1. Subí esta carpeta completa como un repositorio nuevo en GitHub (por
   ejemplo `comobien-app`).
2. Entrá a vercel.com → "Add New" → "Project" → importá ese repositorio.
   Vercel detecta que es un proyecto Vite automáticamente, no hace falta
   tocar nada en la configuración de build.
3. Antes de darle "Deploy" (o después, en Settings → Environment Variables,
   y ahí sí necesitás un redeploy), configurá estas variables, **en la
   pestaña "Project"** (no "Shared"):

   - `VITE_SUPABASE_URL` (tipo **Config**) → la URL de tu proyecto Supabase.
     Es la misma que ya usás en huellasapp — ver el README de
     barbaravivante-web, sección 7, si todavía no lo creaste.
   - `VITE_SUPABASE_ANON_KEY` (tipo **Config**) → la clave pública ("anon
     public") de ese mismo proyecto de Supabase.
   - `VITE_ACCESS_CODES` (tipo **Config**, opcional) → solo si querés poder
     dar algún acceso manual sin pasar por Mercado Pago. Ver
     `CONFIGURAR_ACCESO.md` para el detalle de cómo queda el login.

4. Una vez deployado, Vercel te da un link tipo
   `https://comobien-app.vercel.app`. **Importante:** el sistema ya está
   cargado en tu tienda con el link `https://comobien.barbaravivante.com.ar`
   (para que quede prolijo, igual que Huellas), así que andá a Settings →
   Domains del proyecto y agregá ese subdominio (el mismo proceso que ya
   hiciste una vez con Huellas, con un registro CNAME en tu proveedor de
   dominio) **antes de activar la venta**, para que el link que reciben los
   compradores por email funcione.
5. Si en algún momento querés dar un acceso manual sin pasar por Mercado
   Pago, editá el valor de `VITE_ACCESS_CODES` en Vercel agregando un
   código, y Vercel va a re-desplegar solo.

## Escaneo de tiquets: cómo lee el texto (y por qué es gratis)

ComoBien lee el tiquet directamente en el celular de la persona que compra,
usando una tecnología llamada OCR (reconocimiento de texto en imágenes,
librería `tesseract.js`, gratuita). La foto nunca sale del celular ni se
manda a ningún servicio pago — por eso esta función no tiene ningún costo
para vos, sin importar cuántos compradores la usen ni cuántas veces.

La contra de este enfoque es que es menos "inteligente" que usar una IA:
la app compara, línea por línea, lo que el OCR leyó contra una lista de
palabras clave (`src/data/ticketKeywords.js`) para adivinar qué producto es
y a qué grupo de alimentos pertenece. Con tiquets bien sacados (buena luz,
sin arrugar) suele reconocer bien los productos comunes, pero se le puede
escapar alguno con nombre raro, muy abreviado, o de un tiquet desteñido.
Si en algún momento notás que se le escapan muchos productos de una marca
o tipo en particular, se puede agregar esa palabra al diccionario
(`src/data/ticketKeywords.js`) para que la reconozca — es una lista simple,
fácil de ampliar con el tiempo.

Si más adelante preferís volver a la versión con inteligencia artificial
(más precisa, pero con un costo chico por escaneo — fracciones de centavo a
centavos de dólar por imagen, con el modelo más económico de Anthropic),
esa lógica no se borró: sigue en `api/scan-ticket.js`, lista para
reactivarse.

## Base de alimentos y recomendaciones

Los valores nutricionales (`src/data/foods.js`) son aproximados, tomados de
tablas de composición de alimentos de uso general, y las recomendaciones
(`src/lib/recommendations.js`) siguen los lineamientos generales de las
Guías Alimentarias para la Población Argentina (GAPA, Ministerio de Salud).
Es una guía orientativa: el texto de la app aclara que no reemplaza a un/a
profesional de la nutrición.

Si con el tiempo querés sumar más alimentos a la base, es solo agregar una
fila nueva en `src/data/foods.js` con sus valores por 100g y el grupo al que
pertenece.

## Cambiar los colores y el estilo

Todos los colores de la app (fondo, color principal, textos, bordes, etc.)
están juntos en un solo archivo: `src/theme.js`. Para cambiar cualquier
color, abrí ese archivo, cambiá el código de color (por ejemplo
`fondo: "#EDEAE0"` por otro código) y guardá — se actualiza en toda la app
a la vez, no hay que tocar archivo por archivo.

Si estás probando la app en tu compu con `npm run dev`, los cambios de
color se ven solos en el navegador apenas guardás el archivo, sin tener que
reiniciar nada.

Los colores de los grupos de alimentos (verduras y frutas, lácteos, etc.,
los que aparecen en el escaneo de tiquets) están aparte, en
`src/data/foods.js`, en el objeto `GRUPOS`.
