type AnyFunction = (...args: unknown[]) => unknown;
type AnyArray = Array<unknown>;
type AnyShape = Record<string, unknown>;

// TODO: namespace?
type ShapeValueConstructors = typeof Number | typeof String | typeof Boolean | typeof Symbol | typeof Function | typeof Array | typeof Object;
type ShapeValue = number | bigint | string | boolean | symbol | AnyFunction | AnyArray | AnyShape;

export type ShapeDefinition = Record<string, ShapeValueConstructors>;
export type Shape = Record<string, ShapeValue>;

type InstanceTypeFromConstructor<C> = 
  C extends typeof Number   ? number :
  C extends typeof BigInt   ? bigint :
  C extends typeof String   ? string :
  C extends typeof Boolean  ? boolean :
  C extends typeof Symbol   ? symbol :
  C extends typeof Function ? AnyFunction :
  C extends typeof Array    ? AnyArray :
  C extends typeof Object   ? AnyShape :
  never;

export type ShapeFromDefinition<T extends ShapeDefinition> = {
  [K in keyof T]: InstanceTypeFromConstructor<T[K]>;
};
