// This path identifies the entire reader dependency bundle. The build checks
// its SHA-256 against every vendor byte, the worker wrapper and its polyfills.
export const PDFJS_RELEASE_PATH = "vendor/pdfjs/releases/30fe8d1ba291a91998713f46f73d83e6a10e1fa39da78e2fac36271624e93307";
export const PDFJS_ROOT = new URL(`./${PDFJS_RELEASE_PATH}/`, import.meta.url);
