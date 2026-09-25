import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGIN = "https://weddlysmartdesign.github.io";

function adminClient() {
  const secrets = Deno.env.get("SUPABASE_SECRET_KEYS");
  const key = secrets ? JSON.parse(secrets).default : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(Deno.env.get("SUPABASE_URL")!, key!, { auth: { persistSession: false } });
}

function headers(origin: string | null) {
  const allow = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type, apikey",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer"
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: headers(origin) });

  if (origin && origin !== ALLOWED_ORIGIN) {
    return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers: headers(origin) });
  }

  let body: any = {};
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: headers(origin) });
  }

  const action = String(body.action || "");
  const map: Record<string, { fn: string; args: Record<string, unknown> }> = {
    preview: {
      fn: "partner_connection_preview",
      args: { p_request_token: body.p_request_token }
    },
    approve: {
      fn: "partner_connection_approve",
      args: {
        p_request_token: body.p_request_token,
        p_member_token: body.p_member_token,
        p_permissions: body.p_permissions || {}
      }
    },
    manage: {
      fn: "partner_manage_grants",
      args: { p_member_token: body.p_member_token }
    },
    update: {
      fn: "partner_update_grant",
      args: {
        p_member_token: body.p_member_token,
        p_grant_id: body.p_grant_id,
        p_permissions: body.p_permissions || {},
        p_revoke: !!body.p_revoke
      }
    },
    responsibilities: {
      fn: "partner_couple_responsibilities",
      args: {
        p_member_token: body.p_member_token,
        p_grant_id: body.p_grant_id
      }
    },
    add_responsibility: {
      fn: "partner_couple_add_responsibility",
      args: {
        p_member_token: body.p_member_token,
        p_grant_id: body.p_grant_id,
        p_title: body.p_title,
        p_owner: body.p_owner || "couple",
        p_due_date: body.p_due_date || null,
        p_comment: body.p_comment || ""
      }
    },
    update_responsibility: {
      fn: "partner_couple_update_responsibility",
      args: {
        p_member_token: body.p_member_token,
        p_id: body.p_id,
        p_title: body.p_title ?? null,
        p_owner: body.p_owner ?? null,
        p_due_date: body.p_due_date ?? null,
        p_set_due_date: !!body.p_set_due_date,
        p_comment: body.p_comment ?? null,
        p_completed: typeof body.p_completed === "boolean" ? body.p_completed : null
      }
    },
    decisions: {
      fn: "partner_couple_decisions",
      args: {
        p_member_token: body.p_member_token,
        p_grant_id: body.p_grant_id
      }
    },
    confirm_decision: {
      fn: "partner_couple_confirm_decision",
      args: {
        p_member_token: body.p_member_token,
        p_decision_id: body.p_decision_id
      }
    }
  };

  const target = map[action];
  if (!target) return new Response(JSON.stringify({ error: "invalid_action" }), { status: 400, headers: headers(origin) });

  const token = action === "preview" ? body.p_request_token : body.p_member_token;
  if (typeof token !== "string" || token.length < 40) {
    return new Response(JSON.stringify({ error: "invalid_capability" }), { status: 401, headers: headers(origin) });
  }

  const { data, error } = await adminClient().rpc(target.fn, target.args);
  if (error) {
    const safe = /invalid|expired|not_found|unauthorized/i.test(error.message || "") ? "not_authorized" : "request_failed";
    return new Response(JSON.stringify({ error: safe }), { status: safe === "not_authorized" ? 403 : 400, headers: headers(origin) });
  }

  return new Response(JSON.stringify(data), { status: 200, headers: headers(origin) });
});