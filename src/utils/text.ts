export function isSafeKey(key: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(key);
}
