#!/usr/bin/env node
'use strict';
// GUEST-only checkout/admin producer-consumer drift guard; never hits Stripe or Supabase.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..');
const checkout=fs.readFileSync(path.join(dir,'backend/guest-stripe-checkout/index.ts'),'utf8');
const admin=fs.readFileSync(path.join(dir,'backend/guest-orders-admin/index.ts'),'utf8');
const flow=fs.readFileSync(path.join(dir,'backend/guest-invitation-flow/index.ts'),'utf8');
assert.match(checkout,/const metadata=\{product:'guest',edition,/,'paid checkout must issue product GUEST license');
assert.match(checkout,/p_product_ref:'guest_'\+edition/,'license must remain explicitly GUEST product');
assert.match(admin,/!\['guest','guests'\]\.includes\(String\(l\.metadata\?\.product\|\|''\)\)/,'detail must accept current guest and historic guests metadata');
assert.match(admin,/\.eq\('source','stripe'\)\.in\('metadata->>product',\['guest','guests'\]\)/,'admin list must accept both GUEST formats without including ONE');
assert.match(admin,/l\.source!=='stripe'/,'admin detail must never accept arbitrary/internal owner licenses');
assert.match(checkout,/guest-order\.html\?session_id=/,'existing checkout still uses LEGACY order form');
assert.doesNotMatch(checkout,/guest_invitation_orders|functions\/v1\/guest-invitation-flow/,'do not misrepresent direct checkout/new flow integration as implemented');
assert.match(flow,/async function createOrder\(/,'new guest_invitation_orders pipeline remains independent and requires explicit commercial wiring');
console.log('PASS GUEST checkout/admin license producer-consumer parity, legacy guest aliases, and explicit NO-GO marker for new invitation-flow commercial wiring. Offline only; no billing.');
