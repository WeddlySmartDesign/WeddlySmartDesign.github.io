import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://weddlysmartdesign.github.io";
const REPLY_TO = "weddlysmartdesign@gmail.com";
const PHONE = "620 843 264";
const WHATSAPP = "https://wa.me/34620843264";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

function serviceKey(): string {
  const value = Deno.env.get("SUPABASE_SECRET_KEYS");
  return value ? String(JSON.parse(value).default || "") : String(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
}
function dbClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, serviceKey(), { auth: { persistSession: false } });
}
function env(name: string): string {
  return String(Deno.env.get(name) || "").trim().replace(/^["'`]|["'`]$/g, "");
}
function calendarDay(value: Date): number {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (key: string) => Number(p.find((x) => x.type === key)?.value || 0);
  return Date.UTC(part("year"), part("month") - 1, part("day")) / 86400000;
}
function spanishDate(value: Date): string {
  return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "long", year: "numeric" }).format(value);
}
function eligible(row: any): boolean {
  const meta = row?.metadata || {};
  return row?.source === "tester" &&
    (row.status === "active" || row.status === "inactive") &&
    Boolean(row.wedding_id && row.activated_at) &&
    meta.self_service === true &&
    meta.access_kind === "trial" &&
    meta.product === "full" &&
    meta.permanent !== true &&
    Number.isFinite(Date.parse(String(meta.expires_at || "")));
}
type Stage = "pre" | "post";
function matchingStage(row: any, now: Date): Stage | null {
  if (!eligible(row)) return null;
  const days = calendarDay(new Date(String(row.metadata.expires_at))) - calendarDay(now);
  if (days === 2 && row.status === "active" && !row.metadata.one_trial_pre_expiry_sent_at) return "pre";
  if (days === -3 && !row.metadata.one_trial_post_expiry_feedback_sent_at) return "post";
  return null;
}
function mail(kind: Stage, expiration: Date) {
  const contact = `Si tenéis dudas, sugerencias o algo no os ha funcionado como esperabais, <strong>podéis responder directamente a este mismo correo</strong>. También podéis escribirme por <a href="${WHATSAPP}">WhatsApp al ${PHONE}</a>.`;
  const details = kind === "pre"
    ? {
      subject: "Vuestra prueba de ONE termina en dos días",
      heading: "Vuestra prueba de ONE está a punto de terminar.",
      lead: `El <strong>${spanishDate(expiration)}</strong> termina vuestro acceso gratuito a ONE.`,
      middle: `Si decidís comprar ONE desde la prueba, <strong>seguiréis en el mismo espacio y conservaréis la información que ya habéis organizado</strong>. Podéis abrir <a href="${SITE}/trial-buy.html">la página de compra</a> desde el navegador en el que utilizáis ONE. Si el enlace no reconoce vuestra prueba, abrid ONE desde vuestro dispositivo habitual.`,
      closer: "No hay ninguna obligación de comprar; quería avisaros con tiempo para que podáis decidir tranquilamente.",
    }
    : {
      subject: "¿Qué os ha parecido vuestra prueba de ONE?",
      heading: "Gracias por haber probado ONE.",
      lead: `Vuestra prueba terminó el <strong>${spanishDate(expiration)}</strong>.`,
      middle: "Me ayudaría mucho conocer vuestra opinión, aunque no hayáis decidido comprarlo. ¿Qué os ha hecho no continuar? ¿El precio, alguna función que faltaba, alguna dificultad de uso o simplemente no era el momento? También podéis contarme cualquier sugerencia o problema que hayáis encontrado.",
      closer: "Es totalmente voluntario y no os enviaremos más correos de seguimiento por esta prueba.",
    };
  const html = `<div style="background:#f5f2ec;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:#2c2a26">
  <div style="max-width:570px;margin:auto;background:#fff;padding:32px 27px;border:1px solid #e5ded2;border-radius:8px">
  <p style="font-size:12px;letter-spacing:.1em;color:#626b52">ONE · by WeddlySmartDesign</p>
  <h1 style="font:normal 29px/1.18 Georgia,serif;margin:20px 0">${details.heading}</h1>
  <p style="font-size:15px;line-height:1.7">${details.lead}</p>
  <p style="font-size:15px;line-height:1.7">${details.middle}</p>
  <p style="font-size:15px;line-height:1.7">${contact}</p>
  <p style="font-size:15px;line-height:1.7">${details.closer}</p>
  <p style="font-size:14px;margin-top:25px">Un saludo,<br><strong>WeddlySmartDesign</strong></p>
  <p style="border-top:1px solid #e5ded2;padding-top:15px;margin-top:24px;font-size:12px;line-height:1.5;color:#736f63">Podéis responder a este correo: ${REPLY_TO}<br>WhatsApp: <a href="${WHATSAPP}">${PHONE}</a>. Comunicación sobre la prueba que solicitasteis; no supone una suscripción a publicidad.</p>
  </div></div>`;
  const txt = [details.heading, kind === "pre"
    ? `La prueba termina el ${spanishDate(expiration)}. Si compráis desde vuestra prueba, conservaréis lo que habéis organizado. Compra: ${SITE}/trial-buy.html (abridla en el navegador habitual de ONE).`
    : `La prueba terminó el ${spanishDate(expiration)}. Me gustaría saber qué os pareció, qué faltó o por qué no continuasteis. Es completamente voluntario.`,
    `Podéis responder a este mismo correo (${REPLY_TO}) o escribirme por WhatsApp al ${PHONE} (${WHATSAPP}).`,
    details.closer, "WeddlySmartDesign"].join("\n\n");
  return { subject: details.subject, html, text: txt };
}
async function sendEmail(to: string, licenseId: string, kind: Stage, expiration: Date) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("WEDDLY_RESEND_FROM");
  if (!apiKey || !from) throw new Error("email_not_configured");
  const message = mail(kind, expiration);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "Idempotency-Key": "one-trial-lifecycle/" + licenseId + "/" + kind,
    },
    body: JSON.stringify({
      from, to: [to], reply_to: REPLY_TO,
      subject: message.subject, html: message.html, text: message.text,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.id) throw new Error("resend_" + response.status);
  return String(result.id);
}
Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  try {
    const db = dbClient();
    const provided = String(req.headers.get("x-weddly-cron-secret") || "");
    const { data: conf, error: configError } = await db.from("internal_trial_reminder_config").select("secret").eq("id", 1).maybeSingle();
    if (configError) throw configError;
    if (provided.length < 24 || !conf?.secret || provided !== String(conf.secret)) return json({ ok: false, error: "unauthorized" }, 401);
    const raw = await req.text();
    if (raw.length > 1024) return json({ ok: false, error: "request_too_large" }, 413);
    let body: any = {};
    try { body = JSON.parse(raw || "{}"); } catch { return json({ ok: false, error: "invalid_json" }, 400); }
    const dryRun = body?.mode === "preview";
    if (body?.mode !== "run" && !dryRun) return json({ ok: false, error: "invalid_mode" }, 400);
    const now = new Date();
    const cutoff = new Date(Date.now() - 70 * 86400000).toISOString();
    const { data: rows, error } = await db.from("licenses")
      .select("id,source,status,wedding_id,activated_at,created_at,metadata")
      .eq("source", "tester").in("status", ["active", "inactive"])
      .gte("created_at", cutoff).order("created_at", { ascending: false }).limit(500);
    if (error) throw error;
    let duePre = 0, duePost = 0, sentPre = 0, sentPost = 0, skipped = 0, failed = 0;
    for (const item of rows || []) {
      const kind = matchingStage(item, now);
      if (!kind) { skipped++; continue; }
      if (kind === "pre") duePre++; else duePost++;
      if (dryRun) continue;
      try {
        // Recheck the license immediately before sending to avoid contacting converted or revoked customers.
        const { data: fresh, error: freshError } = await db.from("licenses")
          .select("id,source,status,wedding_id,activated_at,metadata").eq("id", item.id).maybeSingle();
        if (freshError) throw freshError;
        if (!fresh || matchingStage(fresh, new Date()) !== kind) { skipped++; continue; }
        const { data: delivery, error: deliveryError } = await db.from("license_delivery_codes")
          .select("buyer_email").eq("license_id", fresh.id).maybeSingle();
        if (deliveryError) throw deliveryError;
        const to = String(delivery?.buyer_email || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) { skipped++; continue; }
        const expiration = new Date(String(fresh.metadata.expires_at));
        const id = await sendEmail(to, String(fresh.id), kind, expiration);
        const nowIso = new Date().toISOString();
        const sentKey = kind === "pre" ? "one_trial_pre_expiry_sent_at" : "one_trial_post_expiry_feedback_sent_at";
        const idKey = kind === "pre" ? "one_trial_pre_expiry_email_id" : "one_trial_post_expiry_email_id";
        const { error: updateError } = await db.from("licenses")
          .update({ metadata: { ...fresh.metadata, [sentKey]: nowIso, [idKey]: id }, updated_at: nowIso })
          .eq("id", fresh.id);
        if (updateError) throw updateError;
        if (kind === "pre") sentPre++; else sentPost++;
      } catch (error) {
        console.warn("one_trial_lifecycle_send_failed", String(item.id), String((error as Error)?.message || ""));
        failed++;
      }
    }
    return json({ ok: true, mode: dryRun ? "preview" : "run", duePre, duePost, sentPre, sentPost, skipped, failed });
  } catch (error) {
    console.warn("one_trial_lifecycle_error", String((error as Error)?.message || ""));
    return json({ ok: false, error: "server_error" }, 500);
  }
});