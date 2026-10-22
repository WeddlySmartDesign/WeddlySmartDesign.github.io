# GUEST · web comercial (dirección «Sellos y sobre»)

Web nueva de venta de invitaciones, en una carpeta aislada. No sustituye ni modifica
`guest.html`, `guest-legal.html` ni ningún otro archivo de la web actual.

- `index.html`: la web. `guest-legal.html`: condiciones de contratación (pendientes de revisión del asesor).
- `js/config.js`: precio, WhatsApp, email y `checkoutUrl` (null mientras no haya enlace de Stripe; «La quiero» abre WhatsApp).
- `invitaciones/01–15`: invitaciones de muestra que se abren desde la portada. Incluye Seda (02), Ellas (12) y Ellos (13) corregidas.
- `assets/brand/`: icono de pestaña y `og.jpg` (imagen al compartir, 1200×630).

Antes de publicar:
1. Quitar `<meta name="robots" content="noindex, nofollow">` de `index.html`.
2. Revisar `og:url` y `og:image`: son absolutas y apuntan a `https://weddlysmartdesign.github.io/guest-web/`. Si la dirección definitiva es otra, cambiarlas.
3. Poner el enlace de pago en `js/config.js` → `checkoutUrl`.
