'use strict';
/**
 * Shared GUEST invitation runtime gate.
 * One source for Node QA and TypeScript Edge Function candidate (function is
 * embedded by the guarded preparer). No network, writes, emails, or providers.
 * Deliberately does not configure RSVP: that belongs to the existing GUEST app.
 */
function assertPinnedInvitationConfig(config, order, validateConfig, files, phase='stored') {
  if (!config || typeof config !== 'object' || Array.isArray(config))
    throw new Error('invalid_invitation_config');
  if (!order || !order.template_id || !order.template_version)
    throw new Error('missing_order_template_pin');
  if (config.template?.id !== order.template_id ||
      String(config.template?.version) !== String(order.template_version))
    throw new Error('invitation_template_pin_mismatch');
  if (typeof validateConfig !== 'function' || validateConfig(config).length !== 0)
    throw new Error('invalid_invitation_config');
  // The stored invitation is recipient-neutral. Existing GUEST sharing adds
  // rt + g/u + lang only at render time; never persist a redirect here.
  if (config.rsvp?.route != null && config.rsvp.route !== '#')
    throw new Error('invalid_invitation_rsvp_route');
  const media=[];
  if (config.cover?.photo) media.push(config.cover.photo);
  if (config.story?.photo) media.push(config.story.photo);
  if (config.locations?.heroPhoto) media.push(config.locations.heroPhoto);
  for (const picture of config.gallery?.photos || []) media.push(picture);
  const slots=new Set((Array.isArray(files)?files:[]).filter(f=>f&&
    (f.path || f.publicUrl || f.url)).map(f=>String(f.slot)));
  for (const picture of media) {
    const src=picture?.src;
    if (typeof src !== 'string' || !src) throw new Error('invalid_invitation_media');
    if (src.startsWith('upload:')) {
      if (phase === 'hydrated') throw new Error('missing_signed_asset');
      if (!slots.has(src.slice(7))) throw new Error('missing_invitation_upload');
    } else if (!/^https:\/\/[^\s]+$/i.test(src))
      throw new Error('invalid_invitation_media');
  }
  return config;
}
/**
 * Read-only compatibility for historical delivered TEST orders written by v12.
 * Never used for creation, mutation, approval, delivery, or production orders.
 * The old rows may have template.version different from template_version;
 * preserving their bytes is safer than silently rewriting order history.
 */
function assertLegacyDeliveredTestRead(config,order,files) {
  if (order?.mode !== 'test' || order?.status !== 'delivered' ||
      !config || typeof config !== 'object' || Array.isArray(config) ||
      config.schemaVersion !== undefined || config.template?.id !== order.template_id)
    throw new Error('untrusted_legacy_invitation');
  if (config.rsvp?.route != null && config.rsvp.route !== '#')
    throw new Error('invalid_invitation_rsvp_route');
  const media=[];
  if(config.cover?.photo)media.push(config.cover.photo);
  if(config.story?.photo)media.push(config.story.photo);
  if(config.locations?.heroPhoto)media.push(config.locations.heroPhoto);
  for(const picture of config.gallery?.photos||[])media.push(picture);
  for(const picture of media){
    if(typeof picture?.src !== 'string' || !/^https:\/\/[^\s]+$/i.test(picture.src))
      throw new Error('missing_signed_asset');
  }
  return config;
}
if (typeof module !== 'undefined' && module.exports)
  module.exports={assertPinnedInvitationConfig,assertLegacyDeliveredTestRead};
