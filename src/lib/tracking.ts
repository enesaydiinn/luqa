declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(event: string, params: Record<string, unknown> = {}) {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("luqa-analytics") === "true"
  )
    window.gtag?.("event", event, params);
}
