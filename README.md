# GESARUTA web

Sitio corporativo estático de GESARUTA. No usa React, backend ni dependencias de ejecución: `index.html`, `styles.css`, `script.js`, recursos y fuentes locales.

## Desarrollo local

```bash
python3 -m http.server 8080
```

Abrir <http://localhost:8080>.

## Producción

La configuración de [`deploy/Caddyfile`](deploy/Caddyfile) sirve `/home/pcos/opt/gesaruta-web/current` en `gesaruta.com` y `www.gesaruta.com`. Las rutas `/deca` y `/login` se redirigen directamente al servicio DeCA; el resto de rutas inexistentes conserva respuesta 404 de Caddy.

El workflow de GitHub Actions publica cada push a `main` como release inmutable bajo `releases/<SHA>` y actualiza el enlace `current` de forma atómica. Requiere los secretos `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT` (opcional) y `DEPLOY_SSH_KEY`.

Antes de activar el workflow, instalar el `Caddyfile` en el Caddy de producción y apuntar su `root` al enlace `current`.
