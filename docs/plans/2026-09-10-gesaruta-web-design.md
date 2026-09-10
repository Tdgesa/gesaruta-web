# GESARUTA web corporativa

## Alcance

Sitio corporativo estático e independiente del proyecto DeCA. La página raíz presenta GESARUTA como ecosistema de transporte y enlaza DeCA/eCMR como una solución externa en `https://deca.gesaruta.com/deca`. No se publican tarifas de GESATD ni GESALAB: sus CTAs solicitan propuesta.

## Implementación

- `index.html` contiene la estructura y el contenido editorial.
- `styles.css` conserva la dirección visual de la landing React: marfil, naranja de señalización, azul técnico, negro carbón, composición editorial/industrial y responsive para 390 px.
- `script.js` solo controla el selector de productos, el menú móvil y las apariciones al hacer scroll.
- Las fuentes Hanken Grotesk e IBM Plex Mono se sirven desde `assets/fonts`; no se usa Google Fonts ni runtime externo.

## Despliegue

Cada push a `main` se empaqueta como release inmutable con su SHA en `/home/pcos/opt/gesaruta-web/releases/<SHA>` y actualiza `/home/pcos/opt/gesaruta-web/current`. Caddy sirve exclusivamente ese enlace y redirige `/deca` y `/login` al servicio DeCA. Las rutas inexistentes no tienen fallback SPA, por lo que `/login` no puede devolver la aplicación.
