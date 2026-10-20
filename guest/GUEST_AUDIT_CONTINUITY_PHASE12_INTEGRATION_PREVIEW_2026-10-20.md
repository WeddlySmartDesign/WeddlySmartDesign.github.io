# GUEST — Fase 12 · PREVIEW de integración publicada y validada por HTTPS

Fecha: 20/10/2026. **Estado comercial NO_GO**. Continúa [fase 11](GUEST_AUDIT_CONTINUITY_PHASE11_SHADOW_INTEGRATION_2026-10-20.md).

## Bloqueo Cloudflare resuelto tras captura de la titular
La propietaria mostró los registros del deploy de la rama `guest-integration-no-sale-preview-2026-10-20`: Cloudflare ejecutó:

`node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`

El constructor `guest/tools/build_guest_integration_preview_no_sale.cjs` rechazaba cualquier destino dentro del repositorio, incluido el legítimo `/opt/buildhome/repo/dist`, con error exacto **`Provide absolute, separate --output directory`**. No era problema de diseño, del material ZIP ni de Cloudflare authentication.

### Corrección realizada
- **Exclusivamente en rama `guest-integration-no-sale-preview-2026-10-20`**: modificado un único archivo para permitir `root/dist` **y solo esa ruta** dentro del repositorio, conservando la exigencia de carpeta inicialmente vacía y rechazando escritura en cualquier otra ruta de fuentes.
- Adicionalmente, se excluyen del bundle público todos los JSON internos de estado/auditoría/manifiestos de `guest/`, excepto las dos referencias de catálogo explícitamente permitidas: `GUEST_CATALOG_OWNER_RENDERERS_V2.json` y `GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json`. Esto evita publicar `GUEST_PROJECT_STATUS_V1.json`, `SOURCE_LOCK.json`, pruebas QA, etc. Se mantienen el manifiesto de staging (solo hashes/rutas), `noindex`, y CSP que bloquea conexiones API, pagos, envíos, formularios, iframes y workers.
- Commit PREVIEW `77347f4f2a6b777235d41dbff50650a26ac403b1`. **Cloudflare Pages check COMPLETED / SUCCESS** en ese commit.
- URL PREVIEW **inmutable confirmada por Cloudflare**: **https://f1b97db0.guest-weddlysmartdesign.pages.dev**. Alias de rama anunciado `https://guest-integration-no-sale-pr.guest-weddlysmartdesign.pages.dev`; **usar enlace inmutable** para las pruebas, no asumir alias sin validación.
- La corrección se sincronizó al constructor canónico de `guest-independent` con commit `1c8e25813880628eff92d0d9190bedea5343e8f2`. El builder real de producción `guest/tools/build_catalog_static_preview.cjs` en `guest-independent` **no fue sustituido** y la propietaria mantiene desactivadas las implantaciones automáticas de producción.

### Auditoría independiente HTTPS completa
Se creó `guest/qa/verify_guest_integration_preview_live_2026_10_20.py` y workflow `.github/workflows/guest-integration-preview-live-qa.yml`. **[GitHub Actions 39465936172 — COMPLETED / SUCCESS](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39465936172)**.

La prueba hace GET/HEAD read-only y comprueba directamente contra PREVIEW:
- portada de revisión GUEST, 15 diseños individuales en escaparate, «Próxima apertura» y ausencia de los antiguos paquetes
- 7 rutas HTML accesibles por HTTPS, en todas se aplica efectivamente **X-Robots-Tag noindex** y **Content-Security-Policy** con `connect-src 'none'`, `form-action 'none'`, `frame-src 'none'`, `worker-src 'none'`, `object-src 'none'`
- manifiesto GUEST `PREVIEW_NO_REMOTE_DATA_NO_SALE`, `commercialApproved:false`, inventorios no duplicados, exclusión de diseños artísticos y 5 recursos cruciales con contenido/tamaño/SHA256 coincidentes
- ficheros confidenciales internos `GUEST_PROJECT_STATUS_V1.json`, `SOURCE_LOCK.json`, escenario de QA y estado móvil **no incluidos/no publicados como JSON**.
- No utilizó token/credencial de Stripe, Supabase, Resend o Cloudflare, no creó pedidos, no envió correos y no tocó datos de terceros.

La rama `main` permanece EXACTAMENTE en commit `1e7c81515b71f16105b68a928bb908cba702bebf`. **[PR #144](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144)** y **[PR #145](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145)** continúan en DRAFT, no fusionadas. La PREVIEW de 16 diseños original en `https://eebba5b2.guest-weddlysmartdesign.pages.dev` continúa separada.

## Puertas pendientes: no inventar E2E ni venta
1. Probar la interfaz PREVIEW de integración en Chrome real, sin esperar que cargue datos por el bloqueo deliberado de toda API.
2. Preparar/usar una configuración **Stripe TEST aislada**, no sustituir claves LIVE compartidas; dos recorridos completos con Resend REAL a destinatario autorizado; entrega, acceso posterior a entrega y RSVP persistido en Supabase con datos sintéticos.
3. Evaluar regresión real antes de publicar PR #144/#145 en GitHub Pages `main`; **requerir autorización expresa**. No confundir PREVIEW de interfaz con certificar la integración backend.
4. El defecto visual de BOTÁNICA «Lo esencial» (cuadro en PC) sigue abierto, según prioridad de propietaria: reparar después de conectar flujos, pero **antes de vender BOTÁNICA**.
5. Diseños y precios individuales, fuentes, vídeos, música, derechos/privacidad y decisión GO requieren validación comercial. D03 histórico excluido.

**Producción, ONE, STUDIO, Supabase, Stripe LIVE, Resend y datos de clientes: SIN CAMBIOS.**
