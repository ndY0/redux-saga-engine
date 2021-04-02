import { Generator, Class } from "../types";

const generatorFunction = function* generatorFunction() {
  yield true;
  return true;
}.constructor;

function* isGenerator(
  func: (...args: unknown[]) => Generator
): Generator<boolean, void, unknown> {
  yield func instanceof generatorFunction;
}
const composeMixin = <T extends Class>(
  ...mixins: Array<<U extends Class>(previous: T) => T & U>
) => (baseClass: T): Class => {
  return mixins.reduce((acc, mixin) => {
    return class extends mixin(acc) {};
  }, baseClass);
};

export { isGenerator, composeMixin };
