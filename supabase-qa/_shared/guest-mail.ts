// Emails de GUEST: un solo diseño (Sellos y sobre) para todo lo que le llega a la pareja y a la propietaria.
// Se lee primero en el móvil: tablas de ancho fluido, texto de 17 px, botón a todo el ancho y sin
// depender de CSS externo (Gmail lo quita). Las fuentes de marca solo cargan donde el cliente lo permite.
const INK = '#1b2650', SOFT = '#4a5480', PAPER = '#fbf7f4', LINE = '#e3d6d1', POST = '#b3263a', BLUSH = '#f8e7e2';
const SERIF = "'Abril Fatface',Georgia,'Times New Roman',serif";
const MONO = "'Courier Prime','Courier New',Courier,monospace";
const SANS = "'Hanken Grotesk',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export const mailEsc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const DESIGN_NAMES: Record<string, string> = { 'design-09': 'Azahar', 'design-11': 'Cristal', 'design-07': 'Espejo', 'veil-light': 'Seda', 'design-12': 'Abanico', 'design-05': 'Gala', 'design-06': 'Invernadero', 'design-08': 'Melodía', 'design-10': 'Cuento', 'botanica': 'Botánica', 'design-16': 'Rumbo', 'design-04': 'Brisa', 'design-13': 'Viñeta', 'design-14': 'Ellas', 'design-15': 'Ellos' };

/** Párrafo normal. `html` ya debe venir escapado. */
export const mP = (html: string, soft = false) => `<p style="margin:0 0 16px;font:400 17px/1.6 ${SANS};color:${soft ? SOFT : INK}">${html}</p>`;

/** Botón a todo el ancho; el secundario va en blanco con borde. */
export function mBtn(href: string, text: string, secondary = false) {
  const bg = secondary ? '#ffffff' : INK, fg = secondary ? INK : PAPER;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 18px"><tr><td align="center" bgcolor="${bg}" style="border-radius:10px;border:1.5px solid ${INK}">
<a href="${mailEsc(href)}" target="_blank" style="display:block;padding:16px 18px;font:700 17px/1.2 ${SANS};color:${fg};text-decoration:none;border-radius:10px">${mailEsc(text)}</a></td></tr></table>`;
}

/** Pasos numerados: [título, texto] (sin HTML). */
export function mSteps(steps: [string, string][], heading = '') {
  return (heading ? `<p style="margin:26px 0 4px;font:700 13px/1.3 ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${POST}">${mailEsc(heading)}</p>` : '')
    + `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px">`
    + steps.map(([t, d], i) => `<tr><td valign="top" style="width:34px;padding:14px 0;border-top:1px solid ${LINE};font:700 15px/1.4 ${MONO};color:${POST}">${String(i + 1).padStart(2, '0')}</td>
<td valign="top" style="padding:14px 0;border-top:1px solid ${LINE}"><div style="font:700 16px/1.4 ${SANS};color:${INK}">${mailEsc(t)}</div><div style="margin-top:3px;font:400 15px/1.55 ${SANS};color:${SOFT}">${mailEsc(d)}</div></td></tr>`).join('')
    + `</table>`;
}

/** Recuadro suave para lo que no se puede pasar por alto. `html` ya escapado. */
export const mNote = (html: string) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:4px 0 18px"><tr><td bgcolor="${BLUSH}" style="border-radius:10px;padding:16px 18px;font:400 16px/1.55 ${SANS};color:${INK}">${html}</td></tr></table>`;

/** Lista simple para los emails de la propietaria. Cada elemento ya escapado. */
export const mList = (items: string[]) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px">${items.map((x) => `<tr><td style="padding:12px 0;border-top:1px solid ${LINE};font:400 16px/1.5 ${SANS};color:${INK}">${x}</td></tr>`).join('')}</table>`;

// Banda de sobre de correo aéreo: rojo, papel, azul.
const stripe = () => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>${Array.from({ length: 12 }, (_, i) => `<td height="6" bgcolor="${[POST, PAPER, INK][i % 3]}" style="height:6px;line-height:6px;font-size:0">&nbsp;</td>`).join('')}</tr></table>`;

/**
 * Email completo. `body` es HTML ya escapado (usa mP, mBtn, mSteps, mNote).
 * `owner` quita la firma de ayuda a parejas.
 */
export function guestMail(o: { preheader: string; kicker: string; title: string; body: string; owner?: boolean }) {
  const help = o.owner ? '' : `<p style="margin:0 0 6px;font:700 15px/1.5 ${SANS};color:${INK}">¿Dudas?</p>
<p style="margin:0 0 18px;font:400 15px/1.55 ${SANS};color:${SOFT}">Responded a este email o escribidnos por <a href="https://wa.me/34620843264" style="color:${INK};font-weight:700">WhatsApp al 620&nbsp;843&nbsp;264</a>.</p>`;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${mailEsc(o.title)}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Courier+Prime:wght@400;700&family=Hanken+Grotesk:wght@400;700&family=Caveat:wght@600&display=swap');
body{margin:0!important;padding:0!important;width:100%!important;background:${PAPER}}a{color:${INK}}
@media (max-width:480px){.card{padding:26px 20px!important}.title{font-size:28px!important}}</style></head>
<body style="margin:0;padding:0;background:${PAPER}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAPER}">${mailEsc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${PAPER}" style="background:${PAPER}"><tr><td align="center" style="padding:20px 12px 32px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px">
<tr><td style="padding:0 4px 14px"><span style="font:400 24px/1 ${SERIF};color:${INK}">GUEST</span> <span style="font:600 19px/1 'Caveat','Segoe Print','Bradley Hand',cursive;color:${SOFT}">by WeddlySmartDesign</span></td></tr>
<tr><td bgcolor="#ffffff" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${LINE}">
${stripe()}
<div class="card" style="padding:32px 28px 12px">
<p style="margin:0 0 10px;font:700 13px/1.3 ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${POST}">${mailEsc(o.kicker)}</p>
<h1 class="title" style="margin:0 0 18px;font:400 31px/1.12 ${SERIF};color:${INK}">${mailEsc(o.title)}</h1>
${o.body}
${help}
</div></td></tr>
<tr><td style="padding:18px 4px 0;font:400 13px/1.6 ${SANS};color:${SOFT}">
<a href="https://www.instagram.com/weddlysmartdesign" style="color:${SOFT}">Instagram</a> · <a href="https://www.tiktok.com/@weddlysmartdesign" style="color:${SOFT}">TikTok</a> · <a href="https://guest.weddlysmartdesign.com" style="color:${SOFT}">guest.weddlysmartdesign.com</a><br>
GUEST by WeddlySmartDesign · Murcia</td></tr>
</table></td></tr></table></body></html>`;
}
