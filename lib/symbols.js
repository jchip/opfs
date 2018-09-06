"use strict";
const PROMISE = Symbol("opfs-promise");
const CHANGED = Symbol("changed");
const OPTIONALS = Symbol("optionals");
const ORIGINAL_FS = Symbol("original-fs");
const SAVE_STACK = Symbol("save stack");

module.exports = {
  PROMISE,
  CHANGED,
  OPTIONALS,
  ORIGINAL_FS,
  SAVE_STACK
};
