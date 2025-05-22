import DOMPurify from 'dompurify';

export function isSafeKey(key: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(key);
}

export function sanitizeHtml({ html }: { html: string }): string {
  if (!html) {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}
