// Install the Temporal polyfill globally for test runtimes without native
// Temporal (e.g. Node.js 24). This is a no-op on runtimes with native Temporal.
import "temporal-polyfill/global";
