import calculate, {
  definition as calculateDefinition,
} from "./calculate/tool.ts";
import quickSearch, {
  definition as quickSearchDefinition,
} from "./quickSearch/tool.tsx";

export const QuickSearch = {
  call: quickSearch,
  definition: quickSearchDefinition,
};

export const Calculate = {
  call: calculate,
  definition: calculateDefinition,
};
