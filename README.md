# GESARUTA web

Sitio corporativo estático de GESARUTA. No usa React, backend ni dependencias de ejecución: `index.html`, `styles.css`, `script.js`, recursos y fuentes locales.

## Desarrollo local

```bash
python3 -m http.server 8080
```

Abrir <http://localhost:8080>.

## Producción

Vercel sirve este repositorio directamente desde su raíz, sin paso de compilación. [`vercel.json`](vercel.json) deja `outputDirectory` en `.` y define las redirecciones de `/deca` y `/login` hacia `deca.gesaruta.com`.

El proyecto debe estar conectado en Vercel a `gesaruta.com` y `www.gesaruta.com`. No requiere VM, Caddy, backend ni secretos de servidor.
