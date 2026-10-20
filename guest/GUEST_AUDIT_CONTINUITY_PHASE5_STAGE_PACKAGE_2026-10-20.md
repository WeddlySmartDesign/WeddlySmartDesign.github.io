# GUEST — Fase 5 · paquete unificado físico y corrección de integridad (20/10/2026)

## Estado preciso
**Preproducción estática local preparada. Venta NO_GO.** Esta fase amplía [fase 4](GUEST_AUDIT_CONTINUITY_PHASE4_VEIL_2026-10-20.md) y no modifica las certificaciones previas de fases 1–4 ni los másters creativos.

### Trabajo efectivamente realizado
- Recuperados de la sesión los dos insumos ya autentificados: `GUEST_PREPRODUCTION_15.zip` (**110 entradas**) y ZIP VEIL LIGHT staging original (**12 entradas**, diez medios). Ambos permanecen intactos.
- Contrastado el piloto VEIL con SHA256 original fuente `977d275d22c609aeb87c88115f6deca6ab2cfd32bd7487c6f4b425e2ae3e0440`, HTML `8f09e6bb3c0d975108b8c985266eadf339c11bedc50abd189445af040714ad30` y **10/10 recursos** con SHA256/tamaño contra manifiesto. Sin modificar origen.
- Constrida y generada una copia iframe *derivada* VEIL con el mismo puente registrado en `guest/tools/merge_veil_stage.cjs`; SHA256 final idéntico al puente de fase 4: `2d5041e3722000a0d307b3392c82ad1cad42df8ef8e329b4989662b33578f899`. Se preserva el máster original y se bloquea la demo hasta hidratar la configuración del pedido.
- Nuevo ZIP de preproducción `GUEST_PREPRODUCTION_16_VERIFICADO.zip` con **122 entradas físicas**: manifiesto principal + **121 recursos controlados** por SHA256 y longitud. **121/121 PASS**, 16 registros de renderizador con URL relativa y HTML existente, correspondientes a **15 diseños potenciales + D03 Limoneros histórico incorrecto** (solo TEST). Ningún archivo excede **25 MiB** (máximo 24 178 059 bytes, D09). Todo con `noindex`, `commercialApproved=false`, `productionPromotionForbidden=true`, `PREPRODUCTION_DO_NOT_SELL`.
- SHA256 ZIP unificado exacto `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`, bytes **223596068** (ZIP ~214 MiB, descomprimido ~281 MiB). Este archivo existe como artefacto descargable de la conversación que lo produjo; **no** está publicado en Cloudflare ni alojado permanentemente en GitHub.
- Se halló un defecto en el empaquetador común: el puente producía `bridge-manifest.json`, pero no lo incluía en la lista firmada de integridad. **Corregido** `guest/tools/merge_veil_stage.cjs` para incluirlo en `newReport.files`; test de regresión añadido en `guest/tests/veil_stage_fail_closed_2026_10_20.test.cjs`. No afecta a másters ni backend.
- Comprobados con `node --check` los **5/5 scripts JavaScript** embebidos del HTML VEIL derivado. Prueba estática 16/16 `registry -> src -> HTML -> applyApi` PASS.
- **Prueba Chromium iframe local NO SUPERADA y NO puede considerarse QA visual**: navegador de la herramienta devolvió `net::ERR_BLOCKED_BY_ADMINISTRATOR` para navegación a `127.0.0.1`, `file:`, `data:` y dominio de test incluso interceptado. Es bloqueo del entorno del navegador, no un resultado de aplicación ni confirmación de que funcione en Android. Los navegadores CI de 13 Claude siguen PASS de fase 3, no repetirlos.
- No se han efectuado peticiones de pago, publicación Cloudflare, envíos de correo, escritura en pedidos reales ni modificados ONE, ONE Partner o STUDIO.

### Trabajo restante para apertura real
1. **Acceso autorizado Cloudflare de GUEST** para desplegar primero esta copia TEST-only y verificar HTTPS cada SHA, el visor común y las cargas de medios; comprobar `noindex`, no ventas y exclusión de D03.
2. **Prueba de punta a punta real**: dos pedidos sintéticos aislados por Stripe TEST → cuestionario → revisión/aprobación → correo enviado/recibido → token público → licencia de gestión posterior a entrega → RSVP sí/no persistido → dos móviles sincronizados. Nunca declarar PASS por una simulación de CI.
3. **Identidad visual** D09 Limoneros frente a la versión realmente elegida, aprobación de diseños candidatos, confirmación de licencias (música, tipografías, vídeos Recraft al crearse) y precios individualizados, textos de contratación y protección de datos; decisiones de titular sin inventarlas.
4. Tras todos los pasos anteriores, revisión comercial explícita de la tienda y levantamiento deliberado de `NO_GO`; jamás por integrar archivos o actualizar CI.

### Continuidad
- Esta fase es la referencia más reciente del **paquete GUEST**. Seguir respetando `guest/START_HERE.md` y toda la bitácora anterior.
- No se exige a la propietaria volver a enviar diseños; ya están en GitHub o Biblioteca. La única asistencia que eventualmente se necesitaría debe agruparse fuera de su horario laboral, sin pedir claves por chat.
- Si se usa la ZIP local unificada, validar primero SHA256 completo `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216` y el manifiesto 121/121; publicar **exclusivamente TEST-only**, nunca habilitar Stripe ni publicidad automáticamente.
