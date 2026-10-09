'use strict';
/**
 * Pure, shared reconciliation of the v12 buildConfig runtime shape before
 * validating a candidate against GUEST_INVITATION_CONFIG_SCHEMA_V1.json.
 * Importable by Node QA and embeddable verbatim in the Deno test-only
 * backend candidate. NO network calls, secrets, email or side effects.
 *
 * Policy: never synthesize RSVP/transport answers that the questionnaire
 * does not own; those belong to the existing guest-management application.
 * Preserve non-empty invalid URLs so the schema rejects them.
 */
function normalizeBackendInvitationConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('invalid_backend_config');
  const config = JSON.parse(JSON.stringify(input));
  if (!config.cover || typeof config.cover !== 'object' || Array.isArray(config.cover))
    throw new Error('invalid_cover');
  if (!Object.prototype.hasOwnProperty.call(config.cover, 'photo'))
    config.cover.photo = null;
  const optionalUrl = (object, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key) && object[key] === '')
      object[key] = null;
  };
  for (const item of config.locations?.items || []) {
    optionalUrl(item, 'mapsUrl');
    optionalUrl(item, 'websiteUrl');
  }
  optionalUrl(config.practical?.bus, 'mapsUrl');
  for (const key of ['websiteUrl', 'mapsUrl', 'externalBookingUrl'])
    optionalUrl(config.practical?.accommodation, key);
  optionalUrl(config.practical?.gift, 'externalUrl');
  optionalUrl(config.practical?.playlist, 'url');
  return config;
}
// Deno source can inline this exact function without a Node dependency.
if (typeof module !== 'undefined' && module.exports)
  module.exports = {normalizeBackendInvitationConfig};
