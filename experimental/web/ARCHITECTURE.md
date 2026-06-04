# `@cutout/web` Target Architecture

## Semantic HTML as source of truth

HTML microdata is the core encoding principle:

```tsx
<div itemscope itemtype={PlayerType}>
  <span itemprop="name">{name}</span>
  <span itemprop="gamertag">{tag}</span>
</div>;
```

... is equivalent to ...

```ts
{
  "@type": PlayerType,
  "name": name,
  "gamertag": tag
}
```

## Components

Components all have a name and an associated HTTP router/endpoint (can be self).
They can also be "typed" and/or "rendered".

### HTTP Router

_Rendered_

The render function takes the incoming request and returns JSX representing a
set of endpoints valid to that request. The framework then selects the first
matching route in the tree.

First render is cached by default.

An empty "scope" property means this router effectively middleware, otherwise
it's the path segement this router looks for. It can be marked as static, which
means the render function is only called once.

It's its own router (`router: this`);

There will also be routing helpers that you can use to filter endpoints.

### HTTP Endpoint

_Typed, Rendered_

The terminating path this endpoint is located at defaults to its name. Can
contain `:variables`.

The render function takes resolved request parameters (and the request as a
second argument) to craft an appropriate IR response. Content negotiation
projects the best fitting version within the `projection` whitelist option (e.g.
[`html`, `json`])

Its router is static, basically `{ render: () => this }`;

Additional options: `method`, `search`. All "one or many" of their respective
HTTP concepts.

### Data Type

A structured data shape for use in other Components. Something like:

```tsx
const UserType = xo.Type(
  "user", // name
  <>
    <span itemprop="name" itemtype={String}></span>
    <span itemprop="age" itemtype={Number}></span>
    <span itemprop="address" itemtype={AddressType}></span>
  </>,
);
```

Under the hood, the type-enforcement object would look something like:

```ts
{
  name: String,
  age: Number,
  address: AddressType
}
```

Its router is static, returning one endpoint with the HTML microdata definition.

### Data Repository

A DDD-like harness that takes both a data `Type` and a `Store` and exposes
several crud-like operations (get, post, patch, etc).

Its router is static, enumerating crud-like operations and exposing them as
endpoints.

### UI Element

_Typed, Rendered_

Type: attributes Render: returns ir to be written to the dom (or as DSD html,
server-side) Tag: the tag registered in the FE, before the `xo-` prefix.
defaults to its name. Router: Returns endpoints for its source, its associated
styles, its type. Static. Bundles everything on first hit.

### UI Style

Extending the browser's `CSSRule` (polyfill on the BE), this object encapsulates
that entity's CSS parsing logic and endpoint for exposing said logic.

The css content defaults to its name.

Its static router contains one singular endpoint with its own definition.
Compiles CSSRule on first hit.

## Projections

Projections take a JSX IR (containing components) and project it onto some other
shape.

- `html(ir, { ensureFullDocument: boolean; inline: <inline options> })`: returns
  an html string. will contain additional options for truning.
- `dom(ir, { event: <event handling options> })`: makes a series of
  document.createElement calls, injecting event handlers.
- `json(ir, { stripLinkedData: boolean })`: converts HTML microdata into
  ld+json. can be configured to drop the linked data.
- `service(ir, { type: 'http', host = "[::1]", port = 0 } | { type: 'event' })`:
  walks the provided IR, looking for nested components and returns a running
  service based on their `router` propreties.

## Store

The Store is not a component but rather a wrapper around any generic data store,
providing uniform access to read, write, and transation operations.

Also passes errors through in a `Result` rather than throwing them, for
stability.

---

## v0.0.x TODOs

I'm taking these out of the issues - too much overhead to track them both internally and externally.

- [ ] Document v0.0.x scope and revise components' types file. _(in progress)_
- [ ] Get a `service` projection and simple router working (just renders a
      single endpoint)
- [ ] Expand the router to be nestable. Handle errors.
- [ ] Upgrade Type from POJO to an actual component.
- [ ] Add routers to Element, Style.
- [ ] Write json ld projection and add content negotiation to endpoint.
- [ ] Improve current html projection to allow for full document bundling.

## v0.1 TODOs

- Author Store
- Author Repository
- ?
