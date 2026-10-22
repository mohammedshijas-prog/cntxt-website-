import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/*
 * Markdown to HTML, then an allowlist: only formatting tags survive; scripts,
 * styles, event handlers, iframes and javascript: links are stripped. Pure
 * JavaScript (no browser emulation), so it runs the same on the server, on
 * Vercel at request time, and in the browser.
 */
const allowed: sanitizeHtml.IOptions = {
  allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "del", "blockquote", "code", "pre", "ul", "ol", "li", "a", "img", "table", "thead", "tbody", "tr", "th", "td", "sup", "sub", "span"],
  allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height"], th: ["align"], td: ["align"], code: ["class"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["https", "data"] },
  allowProtocolRelative: false,
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
};

export function renderMarkdown(body: string) {
  return sanitizeHtml(marked.parse(body, { async: false }) as string, allowed);
}
