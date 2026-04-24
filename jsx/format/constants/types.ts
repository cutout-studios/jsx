import type {
  BOOLEAN as GLOBAL_BOOLEAN,
  EVENT as GLOBAL_FUNCTION,
  GLOBAL,
} from "./attributes/global.ts";
import type {
  BOOLEAN as LOCAL_BOOLEAN,
  LOCAL,
  NUMBER as LOCAL_NUMBER,
} from "./attributes/local.ts";
import type { ELEMENTS } from "./elements.ts";

export type Elements = (typeof ELEMENTS)[number];

export type GlobalAttributes = (typeof GLOBAL)[number];
export type LocalAttributes = keyof typeof LOCAL;
export type Attributes = GlobalAttributes | LocalAttributes;

export type BooleanAttributes =
  | keyof typeof GLOBAL_BOOLEAN
  | keyof typeof LOCAL_BOOLEAN;
export type NumberAttributes = keyof typeof LOCAL_NUMBER;
export type FunctionAttributes = (typeof GLOBAL_FUNCTION)[number];

export type ElementHasAttribute<E extends Elements, A extends Attributes> =
  A extends GlobalAttributes ? true
    : A extends LocalAttributes ? E extends (typeof LOCAL[A])[number] ? true
      : false
    : false;

export type PickElementAttributes<E extends Elements, A extends Attributes> =
  ElementHasAttribute<E, A> extends true ? A : never;
