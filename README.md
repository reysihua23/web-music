# Rey App · Página de descarga

Sitio estático (HTML + CSS + JS puros). Sin servidor, sin base de datos, sin librerías externas.

## Estructura

```
public/
├── index.html      ← textos, versión, tamaño y SHA-256
├── style.css       ← diseño y animaciones
├── script.js       ← animaciones, código que se escribe solo
├── favicon.svg     ← ícono de la pestaña (corona)
├── _headers        ← cabeceras de seguridad (Cloudflare Pages / Netlify)
├── apks/           ← AQUÍ va tu APK
└── images/         ← AQUÍ van tus capturas
```

## Qué debes poner

### 1) El APK → `public/apks/`
- Nombre exacto: **`rey-app.apk`** (si usas otro nombre, cambia `href="apks/rey-app.apk"` en `index.html`).
- Debe estar **firmado** con tu keystore (build release, no debug).
- ⚠️ Cloudflare Pages acepta archivos de **máx. 25 MB**. Si tu APK pesa más, súbelo a GitHub Releases
  y pon ese enlace `https://` en el botón. Netlify no tiene ese límite por archivo.

### 2) Las capturas → `public/images/`
| Archivo | Para qué | Medida recomendada |
|---|---|---|
| `captura1.png` | Primera pantalla de la galería | 1080 × 1920 px (vertical 9:16) |
| `captura2.png` | Segunda pantalla | 1080 × 1920 px |
| `captura3.png` | Tercera pantalla | 1080 × 1920 px |

- Toma las capturas desde tu celular (pantalla completa, sin barra de notificaciones sucia).
- Formato PNG o WebP; intenta que cada una pese menos de 500 KB.
- Si falta alguna, la página muestra un recuadro indicando qué archivo subir; no se rompe.
- Para usar `.jpg` o `.webp`, cambia la extensión en las 3 líneas `<img src="images/...">` de `index.html`.

### 3) El código SHA-256 → `index.html`
Busca `REEMPLAZA_CON_TU_SHA256` y pega tu código. Para calcularlo:
- Windows: `certutil -hashfile rey-app.apk SHA256`
- Mac / Linux: `sha256sum rey-app.apk`

**Cada vez que cambies el APK, actualiza el SHA-256.**

### 4) Versión y tamaño → `index.html`
Busca `v1.0.0 · 25 MB · Android 8+` y ajústalo a tu app real.

## Personalizar
- Frases que cambian en el título: `script.js`, variable `words`.
- Código que se escribe en la ventana: `script.js`, variable `lines`.
- Colores: `style.css`, bloque `:root` (`--o` naranja, `--p` rosa, `--v` morado, `--g` verde, `--b` azul).

## Probar en tu PC
```
cd public
python -m http.server 8000
```
Abre http://localhost:8000

## Publicarlo (cuando quieras)
**Cloudflare Pages**: Create project → Upload assets → sube la carpeta `public` → conecta tu dominio.
**Netlify**: arrastra la carpeta `public` a https://app.netlify.com/drop.
Ambos leen `_headers` solos y dan HTTPS gratis.

## Lista de seguridad
- [x] Sin formularios, cookies ni rastreadores
- [x] CSP estricta: solo scripts y estilos de tu propio dominio
- [x] HTTPS forzado (HSTS) y página que no puede incrustarse en otras webs
- [x] El APK se descarga siempre como archivo, nunca se abre en el navegador
- [ ] Activa 2FA en tu cuenta de hosting y de dominio
- [ ] Activa Cloudflare (proxy + protección DDoS) delante de tu dominio
- [ ] Firma tu APK y publica siempre su SHA-256

Nota: ningún sitio es 100 % invulnerable; esto reduce el riesgo al mínimo.

## Textos de tu app (editar en `index.html`)
- Sección **"Qué puedes hacer"** (`buscar()`, `descargar()`, `reproducir()`): cambia las frases para que describan tu app real.
- Sección **"Preguntas frecuentes"**: ajusta las respuestas a tu caso (versión de Android, dónde se distribuye, etc.).
- Si tu app es gratis o no tiene anuncios, puedes añadirlo en el texto principal; solo escríbelo si es cierto.
