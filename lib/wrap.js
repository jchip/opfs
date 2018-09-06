"use strict";

/* eslint-disable max-params, no-invalid-this */

const assert = require("assert");

const { PROMISE, CHANGED, OPTIONALS, ORIGINAL_FS, SAVE_STACK } = require("./symbols");

function setPromise(p) {
  /* istanbul ignore next */
  this[PROMISE] = p || global.Promise;

  return this._opfsInitialize(true);
}

function saveStack(p) {
  this[SAVE_STACK] = p;
}

function addOptionals() {
  for (let x = 0; x < arguments.length; x++) {
    const opt = arguments[x];
    assert(typeof opt === "object", "adding optional must be object");
    assert(typeof opt.name === "string" && opt.name, "adding optional must have a name string");
    assert(typeof opt.func === "function", "adding optional have an func function");
    this[OPTIONALS].push(opt);
  }

  return this._opfsInitialize(arguments.length > 0);
}

function promiseWrap(func, context, noErr) {
  /* istanbul ignore next */
  const Promise = (this && this[PROMISE]) || global.Promise;
  return function() {
    const len = arguments.length;

    if (len > 0) {
      const cb = arguments[len - 1];
      // callback detect, treat normally
      if (typeof cb === "function") {
        return func.apply(context, arguments);
      }
    }

    // create an error here to save call stack
    const saveErr = this[SAVE_STACK] && new Error("");

    return new Promise((resolve, reject) => {
      arguments[len] = noErr
        ? resolve
        : (err, res) => {
            if (err) {
              if (saveErr) {
                saveErr.message = err.message;
                Object.assign(saveErr, err);
                return reject(saveErr);
              }
              return reject(err);
            }
            return resolve(res);
          };
      arguments.length += 1;
      return func.apply(context, arguments);
    });
  };
}

function initialize(force) {
  if (this.hasOwnProperty(CHANGED) && !this[CHANGED] && !force) return this;

  this[CHANGED] = false;
  this._opfsAddOptionals = addOptionals;
  this._opfsSetPromise = setPromise;
  this._opfsPromiseWrap = promiseWrap;
  this._opfsSaveStack = saveStack;

  const fs = this[ORIGINAL_FS];

  const addNative = prop => {
    // only node 10 and up
    /* istanbul ignore next */
    if (fs[prop].hasOwnProperty("native")) {
      /* istanbul ignore next */
      this[prop].native = fs[prop].native;
    }
  };

  Object.keys(fs).forEach(prop => {
    if (typeof fs[prop] === "function") {
      if (!prop.startsWith("_") && prop[0] === prop[0].toUpperCase()) {
        // constructors props
        return (this[prop] = fs[prop]);
      } else if (!prop.endsWith("Sync") && fs.hasOwnProperty(`${prop}Sync`)) {
        // with callbacks if they have Sync counterpart
        // need to treat exists differently, even though it's deprecated
        this[prop] = this._opfsPromiseWrap(fs[prop], fs, prop === "exists");
      } else {
        // functions w/o callbacks
        this[prop] = fs[prop].bind(fs);
      }

      return addNative(prop);
    } else {
      return (this[prop] = fs[prop]);
    }
  });

  /* istanbul ignore next */
  if (fs.hasOwnProperty("promises")) {
    /* istanbul ignore next */
    Object.defineProperty(this, "promises", {
      get() {
        return fs.promises;
      },
      writeable: true,
      configurable: true,
      enumerable: false
    });
  }

  // wrap optionals
  this.$ = {};
  const wrapOptionals = x => {
    /* istanbul ignore next */
    if (!x || !x.func) return;
    this.$[x.name] = this._opfsPromiseWrap(x.func, x.context || x.func, x.noErr);
    /* istanbul ignore next */
    const sync = x.sync || x.func.sync;
    if (sync) this.$[`${x.name}Sync`] = sync;
  };

  this[OPTIONALS].forEach(wrapOptionals);

  return this;
}

function opfsWrap(opfs, fs, promise, optionals) {
  opfs[ORIGINAL_FS] = fs;
  opfs[CHANGED] = true;
  assert(Array.isArray(optionals), "opfsWrap - optionals must be an array");
  opfs[OPTIONALS] = optionals;
  opfs[SAVE_STACK] = true;

  opfs._opfsInitialize = initialize;
  opfs._opfsSetPromise = setPromise;
  return opfs._opfsSetPromise(promise);
}

module.exports = opfsWrap;
