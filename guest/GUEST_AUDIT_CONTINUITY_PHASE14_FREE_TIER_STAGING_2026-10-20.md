# GUEST — Fase 14 · decisión Supabase FREE / Stripe TEST sin gastos nuevos (20/10/2026)

**Estado: NO_GO.** Continuidad tras [fase 13](GUEST_AUDIT_CONTINUITY_PHASE13_PAYMENT_TEST_ISOLATION_2026-10-20.md).

## Evidencia, no suposiciones
- La propietaria mostró en Chrome el aviso de Supabase «Project GUEST-Botanica-Certificacion-Temporal is paused», con botón `Resume project`, otro `Upgrade to Pro` y plazo UI «until 17 Nov 2027».
- Connector Supabase verificado por lectura: organización `Weddly Smart Design` `wqpryknbjhcwcmsuqfgm` plan `free`, `tier_free`. Project GUEST temporal `pwhcivzdmmkyuodzzqfq` `INACTIVE`, mismo org. **Proyecto principal `dnjsxequwgtyyauuofxj` y STUDIO `kijigxprredusnaaazow` ambos `ACTIVE_HEALTHY` y del mismo org.**
- Fuente actual Supabase [billing FAQ](https://supabase.com/docs/guides/platform/billing-faq): **máximo dos proyectos Free activos**, pausados no cuentan. [Restauración](https://supabase.com/docs/guides/platform/free-project-pausing): el botón restaura datos/configuración; puede generar limitación si se excede la cuota. **NO pulsar `Resume project` con 2/2 proyectos activos** ni `Upgrade to Pro` sin autorización de costes y decisión expresa de titular. No pausar STUDIO para liberar plaza de manera tácita: protección independiente de proyecto.
- UI Stripe confirmado TEST/sandbox con banda azul. Connector Stripe solo muestra LIVE, por tanto **no insertar/circular claves API en chat, repositorio, o proyecto Supabase compartido**, ni lanzar cobros de prueba contra producción.
- La UI de PREVIEW GUEST aislada con CSP sin conexiones e-commerce en `f1b97db0.guest-weddlysmartdesign.pages.dev` ya está visualizada y comprobada. El renderizado de diseños y su PREVIEW ZIP `eebba5b2.guest-weddlysmartdesign.pages.dev` siguen segregados. Nada autorizado para LIVE.

## Estrategia de coste cero antes de comprometer infraestructura
- Reutilizar el proyecto **Supabase local desechable en un GitHub Actions runner**, ya implementado en `.github/workflows/guest-isolated-free-smoke.yml`. Ejecuta Postgres/Supabase y edge functions como proceso local efímero, sin crear ni restaurar proyecto remoto. No ejecutar datos de clientes.
- Preparar en ese entorno pruebas aisladas de contratos de checkout Stripe con **API de Stripe Sandbox exclusivamente**, mediante `sk_test_` guardada como secreto en GitHub Actions (nunca texto en el chat) y `pk_test_`; imponer comprobaciones que aborten si `livemode` o prefijos `sk_live_/pk_live_` aparecen, y sin aceptar precios/configuraciones de LIVE.
- Para correo REAL y compra E2E desde navegador externo, GitHub Actions local efímero sin exposición pública **NO es por sí solo un backend accesible**. Debe proponerse después un mecanismo seguro y acotado (instancia TEST remota segregada o túnel verificado de corta duración) antes de afirmar que Stripe y Resend están integrados. No publicar por comodidad en `main` ni reactivar Supabase con coste implícito.
- Inspeccionar la infraestructura y reportar dependencias/limitaciones de la vía gratuita **antes** de pedir autorización para cualquier gasto o cambios de infraestructura.

## Próxima intervención mínima
- **Ninguna todavía en Supabase**. No pulsar Resume ni Upgrade. La titular no debe copiar claves API al chat.
- El agente debe documentar/testear el runner local de prueba y preparar el mecanismo de ingreso **seguro** de clave Stripe de Sandbox en GitHub Actions. Solo entonces solicitar una intervención guiada, aislada, fuera de cuentas empresariales y sin mostrar secretos.

**PENDIENTE:** dos compras auténticas Stripe TEST, correos Resend recibidos, revisión/aprobación/entrega, acceso GUEST después de entrega, RSVP sí/no persistido, dos móviles físicos, PR #144/#145 tras autorización, corrección del cuadro BOTÁNICA «Lo esencial», precios/derechos/comercial GO. Todos NO_GO; producción y STUDIO intactos.
