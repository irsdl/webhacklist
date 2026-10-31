/* Seasonal master switch. Set enabled to false and deploy to retire Halloween
 * everywhere, including for visitors who previously opted in. The end date is
 * exclusive; no rebuild is needed for the season to expire in an open tab. */
window.WEBHACKLIST_HALLOWEEN = Object.freeze({
  enabled: true,
  startsAt: "2026-10-24T00:00:00Z",
  endsAt: "2026-11-02T00:00:00Z"
});
