[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

# opfs

Yet another node [fs] wrapper.

- With promisfied methods that still work with callbacks.
- Set your own custom Promise.
- Non constructor functions bound to [fs].
- All other original properties transferred as is.
- No dependencies.
- Optional pkgs promisified and added: [mkdirp], [rimraf].

## Install

```bash
npm install --save opfs
```

## Usage

```js
const opfs = require("opfs");

// Set custom Promise to bluebird. This is automatic if
// it's found in your package.json and node_modules.

opfs._opfsSetPromise(require("bluebird"));

// To use native Promise even if bluebird was found.

opfs._opfsSetPromise();

// promise APIs

opfs
  .readFile("foo.text")
  .then(data => {})
  .catch(err => {});

// native promises methods (if available) node 10+

opfs.promises
  .readFile("foo.text")
  .then(data => {})
  .catch(err => {});

// callback still works

opfs.readFile("foo.text", (err, data) => {});

//
// optional pkgs (if found in your package.json and node_modules)
//

// mkdirp
opfs.$.mkdirp("a/b/c").then(() => {});
opfs.$.mkdirpSync("a/b/c");

// rimraf
opfs.$.rimraf("a").then(() => {});
opfs.$.rimrafSync("a");

// All other fs props transferred

console.log(typeof opfs.Stats);
console.log(typeof opfs.readFileSync);
console.log(typeof opfs.F_OK);
console.log(typeof opfs.W_OK);
```

# License

Copyright (c) 2018-present, Joel Chen

Licensed under the [Apache License, Version 2.0].

[apache license, version 2.0]: http://www.apache.org/licenses/LICENSE-2.0
[travis-image]: https://travis-ci.org/jchip/opfs.svg?branch=master
[travis-url]: https://travis-ci.org/jchip/opfs
[npm-image]: https://badge.fury.io/js/opfs.svg
[npm-url]: https://npmjs.org/package/opfs
[daviddm-image]: https://david-dm.org/jchip/opfs/status.svg
[daviddm-url]: https://david-dm.org/jchip/opfs
[daviddm-dev-image]: https://david-dm.org/jchip/opfs/dev-status.svg
[daviddm-dev-url]: https://david-dm.org/jchip/opfs?type=dev
[fs]: https://nodejs.org/api/fs.html
[mkdirp]: https://www.npmjs.com/package/mkdirp
[rimraf]: https://www.npmjs.com/package/rimraf
