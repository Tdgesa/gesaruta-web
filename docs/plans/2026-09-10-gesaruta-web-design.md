# GESARUTA web corporativa

## Alcance

Sitio corporativo estático e independiente del proyecto DeCA. La página raíz presenta GESARUTA como ecosistema de transporte y enlaza DeCA/eCMR como una solución externa en `https://deca.gesaruta.com/deca`. No se publican tarifas de GESATD ni GESALAB: sus CTAs solicitan propuesta.

## Implementación

- `index.html` contiene la estructura y el contenido editorial.
- `styles.css` conserva la dirección visual de la landing React: marfil, naranja de señalización, azul técnico, negro carbón, composición editorial/industrial y responsive para 390 px.
- `script.js` solo controla el selector de productos, el menú móvil y las apariciones al hacer scroll.
- Las fuentes Hanken Grotesk e IBM Plex Mono se sirven desde `assets/fonts`; no se usa Google Fonts ni runtime externo.

## Despliegue

Vercel sirve el repositorio directamente desde su raíz y no ejecuta compilación. `vercel.json` redirige `/deca` y sus subrutas a `https://deca.gesaruta.com/deca` y `/login` a `https://deca.gesaruta.com`. No hay despliegue en VM, Caddy ni servidor de aplicación.
