export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function buildMailto(subject: string, bodyLines: string[]) {
  const params = new URLSearchParams({ subject, body: bodyLines.join("\n") });
  return `mailto:?${params.toString().replace(/\+/g, "%20")}`;
}

export function canNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function nativeShare(data: { title: string; text?: string; url: string }) {
  if (!canNativeShare()) return false;
  try {
    await navigator.share(data);
    return true;
  } catch {
    // User cancelled the share sheet; nothing to report.
    return false;
  }
}
