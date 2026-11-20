/* Optional clipboard enhancement. GitHub file links work without JavaScript. */
document.addEventListener("click", async event => {
  const button = event.target.closest?.("[data-copy-repo]");
  if (!button) return;
  const url = button.dataset.copyRepo;
  if (!url?.startsWith("https://github.com/irsdl/webhacklist/blob/master/archived-references/")) return;
  const status = document.querySelector("[data-copy-status]");
  const announce = message => { if (status) status.textContent = message; };
  try {
    await navigator.clipboard.writeText(url);
    announce("Repository file link copied.");
  } catch {
    let input = document.querySelector("[data-copy-fallback]");
    if (!input) {
      input = document.createElement("input");
      input.readOnly = true;
      input.dataset.copyFallback = "true";
      input.setAttribute("aria-label", "Repository file link — select and copy");
      button.after(input);
    }
    input.value = url;
    input.focus();
    input.select();
    announce("Clipboard unavailable. Select and copy the repository link shown.");
  }
});
