#!/usr/bin/env node
'use strict';
/* Cloudflare build COMMAND on this one non-production, temporary integration
 * branch only. Never copy this wrapper to guest-independent (production).
 * Builds a GUEST-only read-only integration review, with network/payment CSP.
 */
require('./build_guest_integration_preview_no_sale.cjs');
