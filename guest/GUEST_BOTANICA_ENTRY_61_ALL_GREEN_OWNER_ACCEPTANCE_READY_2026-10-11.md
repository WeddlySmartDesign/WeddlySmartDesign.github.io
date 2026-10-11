# GUEST/Botánica — Entrada 61 · QA de continuidad, staging público y navegador independientes VERDES

**Fecha:** 11/10/2026. Rama `guest-independent`. Complementa Entrada 60. **Se mantiene NO-GO y 8/11** hasta evidencia auténtica del propietario; no confundir QA sintético con certificación comercial.

## Resultado de cierre técnico verificado

**HEAD `6170dd6d08d6a734c438710b603633862d9d15f7`**. Los **tres workflows en el MISMO HEAD terminaron SUCCESS**:

- [GUEST Catalog and Continuity QA (offline), run 38154081311](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38154081311) — SUCCESS. Incluye JSON de estado y contrato de 8/11, nuevo HTML de gestor/cierre, tiempo activo y seguridad, los tests de manifest y multidesign.
- [GUEST Independent QA, run 38154081299](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38154081299) — SUCCESS. Incluye navegador móvil Chromium real sobre el panel de propietario/cierre y el test de tiempo activo con **API de producción simulada**; no ejecuta pedidos reales ni certifica desempeño de una propietaria humana.
- [GUEST Public Cloudflare Pages Live Smoke (NO SALE), run 38154081464](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38154081464) — SUCCESS. Cotejó los bytes HTTP(S) públicos de ambos paneles de certificación con GitHub, master Botánica SHA256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a` y 11.635.635 bytes, manifesto `PREPRODUCTION_DO_NOT_SELL` y noindex. Checkout no habilitado.

## Dos pantallas de validación técnica seguras, ya publicadas

**A. Paridad de ambas variantes y visor del Centro GUEST compartido, SOLO LECTURA:**

`https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-closeout.html`

Con acceso legítimo de propietaria: recupera los dos pedidos TEST entregados de **una sede** y **dos sedes**, consulta `review_load` y `public_load` de la MISMA orden, ignora únicamente TTL de firmas temporales de fotos al comparar, y enseña `Datos de revisión y final: IDÉNTICOS` o `DIFERENCIAS`. Botón por variante `Ver en visor común del Centro GUEST` usa el renderer publicado y certificado solo para TEST, con manifest original intacto. Además hay contador optativo de **revisión visual**, pero ese contador **NO** mide ciclo completo de envío.

**B. Medición genuina de tiempo activo de propietaria para pedido Botánica:**

`https://guest-weddlysmartdesign.pages.dev/guest/qa/owner-botanica-touch-benchmark.html`

Tras su pulsación expresa y autorización, prepara un único encargo Botánica TEST identificable con correo ficticio QA, sin Stripe/emails, lo recupera si el navegador se interrumpe, abre master en visor compartido, inicia cronómetro al cargar el visual, excluye tiempo de página oculta e inactividad de más de 60 segundos; al completar la revisión y pulsar `He revisado · enviar revisión TEST y cerrar tiempo`, envía `mark_review_ready` y `send_review` TEST al Edge V18 y comprueba `review_sent` por readback, mostrando los minutos reales. **Todavía NO se ha ejecutado por la propietaria**, por lo que no inventar resultado ≤5:00.

Ambos paneles están aislados de la web comercial y no cambian ONE, ONE Partner, STUDIO, VEIL LIGHT, `main`, master visual ni checkout. La Biblioteca v24 histórica se conserva, sin repetir overwrites fallidos.

## Límites honestos

- El **Centro Android V4.6 congelado** no se ha modificado ni publicado reemplazo; su dispatcher era VEIL-only, pero el nuevo portal QA web implementa por separado el visor genérico que se necesita certificar. **Gate `renderer` del Centro propietario sigue PENDING** hasta observar la sesión real usando visor autorizado y/o aprobar formalmente el portal GUEST como flujo de producción del Centro.
- La comparación de contenido en Chrome simulado y el hecho de que ambas rutas usen `resolved_config` coincidente **no bastan** por sí solos para dar `review-final-parity` PASS sobre los pedidos Cloud reales. Falta el resultado de la ejecución privada.
- El test de cronómetro con API simulada **no puede acreditar `owner-touch` de una persona real**. Falta medida hecha por propietaria y confirmación.
- No se deben crear más pedidos de revisión/RSVP; solo el único pedido nuevo destinado a medir el tiempo (si no se creó aún).
- El antiguo test de navegador CI externo que intentó navegar un iframe Cloudflare desde GitHub y agotó el tiempo queda diagnóstico, separado de la suite principal; no se ha maquillado como PASS de paridad viva.

## Continuidad exacta

Botánica **8/11 PASS por evidencia, 3 PENDING** (`renderer`, `review-final-parity`, `owner-touch`), **NO-GO comercial** y D03 no iniciado. **La única parte insustituible que falta es una breve validación humana en Android de los dos paneles, primero A y después B.** Una vez aportadas las dos capturas finales SIN código ni URLs privadas: verificar readback Cloud, actualizar gates y el Centro GUEST autorizado y **solo entonces** solicitar permiso comercial explícito; en todo caso mantener diseño congelado sin modificar y continuar documentando.
