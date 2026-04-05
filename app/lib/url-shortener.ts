const SHORT_CODE_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHORT_CODE_PATTERN = /^[A-Za-z0-9]+$/;

export const SHORT_CODE_LENGTH = 10;
export const URL_KV_KEY_PREFIX = "u:";

export function createShortCode(length = SHORT_CODE_LENGTH) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(
    bytes,
    (value) => SHORT_CODE_ALPHABET[value % SHORT_CODE_ALPHABET.length],
  ).join("");
}

export function isValidShortCode(code: string) {
  if (!SHORT_CODE_PATTERN.test(code)) {
    return false;
  }

  return code.length === SHORT_CODE_LENGTH;
}

export function shortCodeToKey(code: string) {
  return `${URL_KV_KEY_PREFIX}${code}`;
}

export function normalizeHttpUrl(input: string) {
  try {
    const parsed = new URL(input);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
