/* Aviso de vacaciones: si la propietaria ha puesto fecha de vuelta, se avisa del nuevo plazo antes de comprar.
   Si el servidor no responde, no se muestra nada. */
(() => {
  'use strict';
  // QA: al pasar a real, guest-invitation-flow.
  const API = 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow-qa';
  const show = (until) => {
    const back = new Date(until + 'T12:00:00'), next = new Date(back.getTime() + 864e5);
    const f = (d) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    const el = document.createElement('div');
    el.className = 'vac-band'; el.setAttribute('role', 'status');
    el.textContent = `Estamos de vacaciones hasta el ${f(back)}. Podéis comprar y rellenar el cuestionario; las propuestas salen a partir del ${f(next)}.`;
    const st = document.createElement('style');
    st.textContent = '.vac-band{position:relative;z-index:60;padding:.7rem 16px;background:#1b2650;color:#fbf7f4;font:500 .875rem/1.45 "Hanken Grotesk",system-ui,sans-serif;text-align:center;text-wrap:balance}';
    document.head.append(st); document.body.prepend(el);
  };
  fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"action":"site_status"}', cache: 'no-store' })
    .then((r) => r.json()).then((j) => { if (j?.ok && j.vacation?.until) (document.body ? show(j.vacation.until) : addEventListener('DOMContentLoaded', () => show(j.vacation.until))); }).catch(() => {});
})();
