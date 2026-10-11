#!/usr/bin/env node
'use strict';
/**
 * V4.7 is a COPY of the real 30MB frozen owner Center V4.6, never an overwrite.
 * No image, VEIL visual, one-payments/ONE/STUDIO code is changed.
 * No future per-design edits: the Cloudflare registry + frozen visual assets
 * drive iframe renderers, via a no-persistent-token postMessage bridge.
 */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const BASE_SHA='a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133';
const BASE_LENGTH=30038021;
const BRIDGE='https://guest-weddlysmartdesign.pages.dev/guest/catalog/owner-center-remote-bridge.html';
const CATALOG="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};";
const RESOLVE="function rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}";
const OPENCENTER="function openCenter(){\n  closeTool();";
const HIDECENTER="function hideCenter(){\n  root.classList.add('off');\n  reopen.style.display='block';\n}";
const REMOTE=String.raw