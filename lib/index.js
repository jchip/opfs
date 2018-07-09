"use strict";

/* eslint-disable global-require */

const Path = require("path");
const fs = require("fs");
const findOwnerDir = require("./find-owner-dir");

let mkdirp;
let rimraf;
let bluebird;
let pkg;

let addDev = process.env.NODE_ENV !== "production";

try {
  const ownerDir = findOwnerDir(__dirname);
  pkg = JSON.parse(fs.readFileSync(Path.join(ownerDir, "package.json")));
  /* istanbul ignore next */
  const pkgAddDev = pkg.opfs && pkg.opfs.addDev;
  /* istanbul ignore next */
  addDev = pkgAddDev !== undefined ? pkgAddDev : addDev;
} catch (err) {
  /* istanbul ignore next */
  pkg = {};
}

const findDep = name =>
  ["dependencies", "optionalDependencies"]
    .concat(addDev && "devDependencies")
    .find(x => pkg && pkg[x] && pkg[x][name]);

// must explicitly require within try/catch blocks
// for it to work when bundling for node using webpack

try {
  /* istanbul ignore next */
  mkdirp = findDep("mkdirp") && require("mkdirp");
} catch (err) {
  /* istanbul ignore next */
  mkdirp = undefined;
}

try {
  rimraf = findDep("rimraf") && require("rimraf");
} catch (err) {
  /* istanbul ignore next */
  rimraf = undefined;
}

try {
  bluebird = findDep("bluebird") && require("bluebird");
} catch (err) {
  /* istanbul ignore next */
  bluebird = undefined;
}

const wrap = require("./wrap");

module.exports = wrap({}, fs, bluebird, [
  // sync can be passed in separately or opt.sync is checked
  {
    name: "mkdirp",
    func: mkdirp
    // sync can be passed in separately or func.sync is checked
    // sync: mkdirp.sync
    // context can be passed in separately or func is used
    // context: mkdirp
  },
  {
    name: "rimraf",
    func: rimraf
  }
]);
