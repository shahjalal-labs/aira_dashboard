/**
 * Universal clipboard copy utility that works across secure (HTTPS/localhost)
 * and non-secure (HTTP IP addresses) browser environments.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern navigator.clipboard API if available and in secure context
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, attempting fallback:", err);
    }
  }

  // 2. Fallback to legacy document.execCommand('copy') via temporary textarea
  if (typeof document !== "undefined") {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Prevent scrolling and viewport changes
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        return true;
      }
    } catch (err) {
      console.error("document.execCommand fallback failed:", err);
    }
  }

  return false;
}
