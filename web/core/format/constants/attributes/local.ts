export const ACCEPT = ["form", "input"] as const;
export const ACTION = ["form"] as const;
export const ALIGN = [
  "caption",
  "col",
  "colgroup",
  "hr",
  "iframe",
  "img",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
] as const;
export const ALLOW = ["iframe"] as const;
export const ALT = ["area", "img", "input"] as const;
export const AS = ["link"] as const;
export const ASYNC = ["script"] as const;
export const AUTOCOMPLETE = ["form", "input", "select", "textarea"] as const;
export const AUTOPLAY = ["audio", "video"] as const;
export const BACKGROUND = ["body", "table", "td", "th"] as const;
export const BGCOLOR = [
  "body",
  "col",
  "colgroup",
  "marquee",
  "table",
  "tbody",
  "tfoot",
  "td",
  "th",
  "tr",
] as const;
export const BORDER = ["img", "object", "table"] as const;
export const CAPTURE = ["input"] as const;
export const CHARSET = ["meta"] as const;
export const CHECKED = ["input"] as const;
export const CITE = ["blockquote", "del", "ins", "q"] as const;
export const COLS = ["textarea"] as const;
export const COLSPAN = ["td", "th"] as const;
export const CONTENT = ["meta"] as const;
export const CONTROLS = ["audio", "video"] as const;
export const COORDS = ["area"] as const;
export const CROSSORIGIN = ["audio", "img", "link", "script", "video"] as const;
export const CSP = ["iframe"] as const;
export const DATA = ["object"] as const;
export const DATETIME = ["del", "ins", "time"] as const;
export const DECODING = ["img"] as const;
export const DEFAULT = ["track"] as const;
export const DEFER = ["script"] as const;
export const DIRNAME = ["input", "textarea"] as const;
export const DISABLED = [
  "button",
  "fieldset",
  "input",
  "optgroup",
  "option",
  "select",
  "textarea",
] as const;
export const DOWNLOAD = ["a", "area"] as const;
export const ENCTYPE = ["form"] as const;
export const ENTERKEYHINT = ["textarea"] as const;
export const ELEMENTTIMING = ["img"] as const;
export const FETCHPRIORITY = ["img", "link", "script"] as const;
export const FOR = ["label", "output"] as const;
export const FORM = [
  "button",
  "fieldset",
  "input",
  "object",
  "output",
  "select",
  "textarea",
] as const;
export const FORMACTION = ["button", "input"] as const;
export const FORMENCTYPE = ["button", "input"] as const;
export const FORMMETHOD = ["button", "input"] as const;
export const FORMNOVALIDATE = ["button", "input"] as const;
export const FORMTARGET = ["button", "input"] as const;
export const HEADERS = ["td", "th"] as const;
export const HEIGHT = [
  "canvas",
  "embed",
  "iframe",
  "img",
  "input",
  "object",
  "video",
] as const;
export const HIGH = ["meter"] as const;
export const HREF = ["a", "area", "base", "link"] as const;
export const HREFLANG = ["a", "link"] as const;
export const HTTPEQUIV = ["meta"] as const;
export const INDETERMINATE = ["input"] as const;
export const INTEGRITY = ["link", "script"] as const;
export const INPUTMODE = ["textarea"] as const;
export const ISMAP = ["img"] as const;
export const KIND = ["track"] as const;
export const LABEL = ["optgroup", "option", "track"] as const;
export const LOADING = ["img", "iframe"] as const;
export const LIST = ["input"] as const;
export const LOOP = ["audio", "marquee", "video"] as const;
export const LOW = ["meter"] as const;
export const MAX = ["input", "meter", "progress"] as const;
export const MAXLENGTH = ["input", "textarea"] as const;
export const MINLENGTH = ["input", "textarea"] as const;
export const MEDIA = ["a", "area", "link", "source", "style"] as const;
export const METHOD = ["form"] as const;
export const MIN = ["input", "meter"] as const;
export const MULTIPLE = ["input", "select"] as const;
export const MUTED = ["audio", "video"] as const;
export const NAME = [
  "button",
  "form",
  "fieldset",
  "iframe",
  "input",
  "object",
  "output",
  "select",
  "textarea",
  "map",
  "meta",
  "param",
] as const;
export const NOVALIDATE = ["form"] as const;
export const OPEN = ["details", "dialog"] as const;
export const OPTIMUM = ["meter"] as const;
export const PATTERN = ["input"] as const;
export const PING = ["a", "area"] as const;
export const PLACEHOLDER = ["input", "textarea"] as const;
export const PLAYSINLINE = ["video"] as const;
export const POSTER = ["video"] as const;
export const PRELOAD = ["audio", "video"] as const;
export const READONLY = ["input", "textarea"] as const;
export const REFERRERPOLICY = [
  "a",
  "area",
  "iframe",
  "img",
  "link",
  "script",
] as const;
export const REL = ["a", "area", "link"] as const;
export const REQUIRED = ["input", "select", "textarea"] as const;
export const REVERSED = ["ol"] as const;
export const ROWS = ["textarea"] as const;
export const ROWSPAN = ["td", "th"] as const;
export const SANDBOX = ["iframe"] as const;
export const SCOPE = ["th"] as const;
export const SELECTED = ["option"] as const;
export const SHAPE = ["a", "area"] as const;
export const SIZE = ["input", "select"] as const;
export const SIZES = ["link", "img", "source"] as const;
export const SLOT = ["slot"] as const;
export const SPAN = ["col", "colgroup"] as const;
export const SRC = [
  "audio",
  "embed",
  "iframe",
  "img",
  "input",
  "script",
  "source",
  "track",
  "video",
] as const;
export const SRCDOC = ["iframe"] as const;
export const SRCLANG = ["track"] as const;
export const SRCSET = ["img", "source"] as const;
export const START = ["ol"] as const;
export const STEP = ["input"] as const;
export const SUMMARY = ["table"] as const;
export const TARGET = ["a", "area", "base", "form"] as const;
export const TYPE = [
  "button",
  "input",
  "embed",
  "object",
  "ol",
  "script",
  "source",
  "style",
  "menu",
  "link",
] as const;
export const USEMAP = ["img", "input", "object"] as const;
export const VALUE = [
  "button",
  "data",
  "input",
  "li",
  "meter",
  "option",
  "progress",
  "param",
] as const;
export const WIDTH = [
  "canvas",
  "embed",
  "iframe",
  "img",
  "input",
  "object",
  "video",
] as const;
export const WRAP = ["textarea"] as const;

// ---

export const BOOLEAN = {
  "checked": CHECKED,
  "disabled": DISABLED,
  "indeterminate": INDETERMINATE,
  "ismap": ISMAP,
  "multiple": MULTIPLE,
  "muted": MUTED,
  "novalidate": NOVALIDATE,
  "open": OPEN,
  "playsinline": PLAYSINLINE,
  "readonly": READONLY,
  "required": REQUIRED,
  "reversed": REVERSED,
  "selected": SELECTED,
} as const;

export const NUMBER = {
  "cols": COLS,
  "colspan": COLSPAN,
  "height": HEIGHT,
  "maxlength": MAXLENGTH,
  "minlength": MINLENGTH,
  "rows": ROWS,
  "rowspan": ROWSPAN,
  "size": SIZE,
  "width": WIDTH,
  "max": MAX,
  "min": MIN,
  "step": STEP,
  "value": VALUE,
} as const;

export const LOCAL = {
  ...BOOLEAN,
  ...NUMBER,
  "accept": ACCEPT,
  "action": ACTION,
  "align": ALIGN,
  "allow": ALLOW,
  "alt": ALT,
  "as": AS,
  "async": ASYNC,
  "autocomplete": AUTOCOMPLETE,
  "autoplay": AUTOPLAY,
  "background": BACKGROUND,
  "bgcolor": BGCOLOR,
  "border": BORDER,
  "capture": CAPTURE,
  "charset": CHARSET,
  "cite": CITE,
  "content": CONTENT,
  "controls": CONTROLS,
  "coords": COORDS,
  "crossorigin": CROSSORIGIN,
  "csp": CSP,
  "data": DATA,
  "datetime": DATETIME,
  "decoding": DECODING,
  "default": DEFAULT,
  "defer": DEFER,
  "dirname": DIRNAME,
  "download": DOWNLOAD,
  "enctype": ENCTYPE,
  "enterkeyhint": ENTERKEYHINT,
  "elementtiming": ELEMENTTIMING,
  "fetchpriority": FETCHPRIORITY,
  "for": FOR,
  "form": FORM,
  "formaction": FORMACTION,
  "formenctype": FORMENCTYPE,
  "formmethod": FORMMETHOD,
  "formnovalidate": FORMNOVALIDATE,
  "formtarget": FORMTARGET,
  "headers": HEADERS,
  "high": HIGH,
  "href": HREF,
  "hreflang": HREFLANG,
  "httpeqiv": HTTPEQUIV,
  "integrity": INTEGRITY,
  "inputmode": INPUTMODE,
  "kind": KIND,
  "label": LABEL,
  "loading": LOADING,
  "list": LIST,
  "loop": LOOP,
  "low": LOW,
  "media": MEDIA,
  "method": METHOD,
  "name": NAME,
  "novalidate": NOVALIDATE,
  "optimum": OPTIMUM,
  "pattern": PATTERN,
  "ping": PING,
  "placeholder": PLACEHOLDER,
  "poster": POSTER,
  "preload": PRELOAD,
  "readonly": READONLY,
  "referrerpolicy": REFERRERPOLICY,
  "rel": REL,
  "sandbox": SANDBOX,
  "scope": SCOPE,
  "shape": SHAPE,
  "sizes": SIZES,
  "slot": SLOT,
  "span": SPAN,
  "src": SRC,
  "srcdoc": SRCDOC,
  "srclang": SRCLANG,
  "srcset": SRCSET,
  "start": START,
  "summary": SUMMARY,
  "target": TARGET,
  "type": TYPE,
  "usemap": USEMAP,
  "wrap": WRAP,
} as const;
