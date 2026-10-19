import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

/** Markdown to HTML with scripts, event handlers and javascript: links stripped. */
export function renderMarkdown(body: string) {
  return DOMPurify.sanitize(marked.parse(body, { async: false }) as string, { USE_PROFILES: { html: true } });
}
