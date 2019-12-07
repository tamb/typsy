import _mixin from "./mixin";
import _typeCheck from "./typecheck";

export const mixin = _mixin;
export const typeCheck = _typeCheck;

const typsy = {
  mixin, // mixin a bunch of objects and functions
  typeCheck // check the type of objects by chaining typeCheck(1).isNumber() // true
};

export default typsy;
