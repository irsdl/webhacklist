/* Annual season: October 30 first arrives in UTC+14 at October 29 10:00 UTC;
 * Halloween finally ends in UTC-12 at November 1 12:00 UTC (exclusive).
 * Set enabled to false and deploy to override even saved visitor opt-ins. */
window.WEBHACKLIST_HALLOWEEN = Object.freeze({
  enabled: true,
  schedule: "annual"
});
