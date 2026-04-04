// TODO: a "compact" interpreter for network transmission

/*
// A "simple" SoA formatter. No advanced optimizations are attempted.
// @throws when objects cannot be serialized
const soa: CutoutJSXFormatter<CutoutSoA> = ([, generator], [config?]) => {
  const indexType = [];
  const indexValue = [];
  const data = [];

  const serializations = new WeakMap();
  const ids = new Map();
  for(const token of generator) {
    // If complex object and not in WeakMap
      // Attempt serialization: throw on failure, but wrap it for better DX.

    // With string represenation, check for id - without an id, add a new id.

    // Push type/value to SoA.
  }
    
  return [
    indexType: Uint8Array,
    indexValue,
    data: new Uint{8, 16, 32}Array(data)
    dataDepth,
  ];
}
*/