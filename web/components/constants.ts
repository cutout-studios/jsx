export enum SupportedHTTPHeaders {
  CONTENT_TYPE = "Content-Type",
  CSP = "Content-Security-Policy",
  CORS = "Access-Control-Allow-Origin",
}

export const ELEMENT_TAG_PREFIX = "xo";

export const ROUTE_FILE_EXTENSION_DEFAULT = ".txt";
export const ROUTE_CONTENT_TYPE_DEFAULT = "text/plain";
export const ROUTE_CSP_HEADER_DEFAULT = "default-src 'self'";

export const DOCUMENT_QUERY_SPECIFICITY_GUIDANCE =
  "Consider explicitly setting an `id` or `key` on this element to preserve its browser state between renders.";

export const DUPLICATE_ENTRY_GUIDANCE =
  "Check if this registry has the present name, before defining an entry.";
