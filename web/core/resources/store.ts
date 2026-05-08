
// TODO(#52): implement fetchPartial - we need to track each fetch, return `undefined`
// if it's triggered, and then #doRender when it's loaded.
// This might live outside the element as well.
// fetchPartial() {}

// ---

// TODO(#56): This is the _store_, not the element.
// return new Proxy(this, {
//   get: (self, key) => {
//     key = String(key);

//     if (Object.hasOwn(self, key)) {
//       return parseRawValue(
//         String(Reflect.get(self, key)),
//         definition.attributes![key],
//       );
//     }

//     if (observedAttributes.has(key)) {
//       return parseRawValue(
//         self.getAttribute(String(key))!,
//         definition.attributes![key],
//       );
//     }

//     return undefined;
//   },
//   set: (self, key, value) => {
//     if (this.#isRendering) {
//       console.warn(
//         new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
//           context: { name, key, value },
//           guidance:
//             "Move data management outside of the element render loop.",
//         }).toString(),
//       );

//       return true;
//     }

//     key = String(key);

//     if (Object.hasOwn(self, key)) {
//       Reflect.set(self, key, value);
//     }

//     if (observedAttributes.has(key)) {
//       self.setAttribute(String(key), value);
//     }

//     return true;
//   },
//   deleteProperty: (self, key) => {
//     if (this.#isRendering) {
//       console.warn(
//         new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
//           context: { name, key },
//           guidance:
//             "Move data management outside of the element render loop.",
//         }).toString(),
//       );

//       return true;
//     }

//     key = String(key);

//     if (Object.hasOwn(self, key)) {
//       Reflect.deleteProperty(self, key);
//     }

//     if (observedAttributes.has(key)) {
//       self.removeAttribute(String(key));
//     }

//     return true;
//   },
// });
