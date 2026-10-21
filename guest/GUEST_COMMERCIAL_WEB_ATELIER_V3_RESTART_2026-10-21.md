# GUEST — Web comercial | Atelier V3 reconstrucción artística (21/10/2026)

## Decisión de dirección artística
La usuaria rechazó **por completo** la V2: estética genérica, vídeos de portada incorrectos, fichas extendidas sin escalabilidad ni demostración visual de las ventajas de GUEST. Instrucción: rehacer **desde cero**; cada invitación tiene apertura en vídeo, recorrido intermedio animado, cierre en vídeo, y el catálogo debe crecer sin alargar indefinidamente la página. Mostrar las bondades de GUEST visualmente (preboda, invitaciones y RSVP, mesas y dos móviles). **No volver a la V2.**

## Entregable físico preparado en este turno
Archivo de descarga en conversación:
`GUEST_ATELIER_V3_14_DISENOS_APERTURA_RECORRIDO_CIERRE_REVISION.zip`
- Tamaño 126405248 B.
- SHA256 `2b6d7a75236ef2562c78685d3af30c870c926a326393c25719689e70e911f398`.
- ZIP 63 entradas, CRC PASS y comparación SHA256 de 62 recursos contra `MANIFIESTO_SHA256.json` PASS.
- 14 diseños presentados, con 28 vídeos **originales completos y sin recorte** (apertura y cierre de cada uno), 28 posters reales y 4 archivos principales HTML/CSS/JS/catálogo. No contiene `design-09` de identidad no validada, ni `design-03` histórico incorrecto.
- Los vídeos originales y su procedencia se contrastaron uno por uno con el paquete sellado `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip` (Library ya existente; hash `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`).
- **BOTÁNICA V14.7:** apertura/cierre del HTML original extraído de esa versión llevan el mismo vídeo SHA256 `bce101619b180f47270dc3b2ab013abc6eba90649db64c48d50a252e995e12eb`. No inventar archivo alternativo ni tratarlo como aprobación visual.
- PREVIEW real de recorrido intermedio se abre en `https://eebba5b2.guest-weddlysmartdesign.pages.dev/guest/catalog-assets/<slug>/<version>/` desde la web, en otra pestaña o iframe de intento. **Si la PREVIEW remota bloquea embedding, el enlace externo es la salida garantizada**; no se ha demostrado que el iframe remoto funcione en móvil real.

## Arquitectura de la muestra V3
- Hero de autor, con apertura original VEIL LIGHT en vídeo, tipografía editorial (Instrument Serif + DM Sans, **by WeddlySmartDesign en Caveat real online**), cromática marfil/botella/terracota. Control visible para pausar/reanudar vídeo.
- Explorador teatral central: una invitación seleccionada; **01 Se abre** (video completo real), **02 Se descubre** (HTML original animado en Cloudflare PREVIEW), **03 Se recuerda** (video cierre completo real).
- Tira horizontal limitada con acceso a overlay `Ver toda la galería`, búsqueda por nombre y **6 diseños por página**; añadir nuevos requiere añadir un registro y assets, NO se crean más secciones.
- Segunda mitad oscura de GUEST **visual e interactiva**, con **datos expresamente ficticios y sin backend**: (1) preboda/eventos; (2) RSVP y preparación de aviso no enviado; (3) cambiar invitados entre mesas pulsando o arrastrando; (4) simulación compartida de cifra entre dos móviles. No afirmar screenshots reales de producto.
- Secuencia de entrega fiel al contrato: compra individual, cuestionario, revisión/aprobación, entrega **y solo entonces** acceso GUEST. Sin editor de invitaciones ni editor RSVP para compradores. No precios inventados, no LIVE checkout.

## QA efectuada
- Verificación estática **28/28 vídeos SHA256** contra extracción original, ffprobe duración válida, y JPG legibles; **14 visibles; D09 excluido**; `node --check` de ambos scripts; 47 IDs HTML sin duplicados.
- Prueba de navegador en sandbox mediante `page.set_content` + estilos/JS inyectados y pósteres incrustados en memoria (la navegación `file://` y `localhost` devuelve `ERR_BLOCKED_BY_ADMINISTRATOR`): en 1440px y 390px, 14 diseños, cambio de actos, búsqueda y selección, demostraciones de preboda/avisos/mesas/sync PASS sin errores JS. Se descubrió un desbordamiento móvil, corregido; último control de scroll 1440 y 390 PASS.
- Se corrigió también el regreso al catálogo desde iframe de invitación, salida externa permanente, control de pausado hero y `prefers-reduced-motion`.
- Precisión importante: **NO** hay QA del vídeo en navegador con acceso real a la URL remota, ni Android físico, ni prueba E2E comercial. Las capturas de QA se obtuvieron en sandbox con vídeos sustituidos por sus pósteres solo en memoria; el ZIP entregado contiene vídeos completos reales.

## Conservación y límites
El paquete 126 MB **NO pudo persistirse en Biblioteca**: `files.manage_library` devolvió `library_storage_limit_exceeded` al cargarlo. Se creó la carpeta `/GUEST by WeddlySmartDesign/WEB_COMERCIAL`, pero está vacía para este ZIP. **No borrar archivos existentes para liberar espacio sin autorización**. El ZIP sí está creado y disponible como enlace sandbox en la conversación actual. La fuente de vídeos originales permanece en ZIP sellado persistido en Biblioteca y documentación canónica anterior.
La nueva V3 no sustituye producción, no fusiona PR #144/#145, no modifica masters originales, no activa cobros. ONE, ONE Partner y STUDIO intactos. `guest-independent` docs únicamente.

## Continuidad exacta
1. Revisar visualmente la V3 física en PC y móvil con `index.html` de ZIP descomprimido; vigilar vídeos, firmas tipográficas, velocidad y galería; recoger objeciones artísticas, no dar por aprobada.
2. Antes de hacer comercial el catálogo, sustituir medios no certificados por originales aprobados y confirmar `BOTÁNICA`/variante correcta LIMONEROS, derechos, precios y política editorial.
3. Elegida estética V3, realizar implantación web en rama aislada con política de vídeos (lazy/controls/motion) y un backend de compra TEST **aislado**, sin activar LIVE. Certificar 2 pedidos E2E y móviles, y solo después pedir GO explícito.
4. Si se requiere continuidad de código exacto entre sesiones, conservar localmente el ZIP del chat o solicitar espacio Library; no fingir que el artefacto pesado se subió a GitHub/Library.

Estado: **PROPUESTA DE REVISIÓN ARTÍSTICA / VENTA NO_GO**.
