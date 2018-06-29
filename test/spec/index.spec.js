"use strict";

const fs = require("fs");

describe("opfs", function() {
  process.env.NODE_ENV = "test";
  let opfs = require("../..");

  it("should have promisified writeFile/readFile", () => {
    const fooFile = "./test/foo.txt";
    expect(opfs.$.mkdirp).to.not.exist;
    return opfs.writeFile(fooFile, "hello").then(() => {
      return opfs
        .readFile(fooFile)
        .then(data => {
          expect(data.toString()).to.equal("hello");
        })
        .then(() => opfs.exists(fooFile))
        .then(e => expect(e).to.equal(true))
        .then(() => {
          opfs.$.rimraf(fooFile);
        });
    });
  });

  it("should reject with error for invlaid argument", () => {
    let error;
    return opfs
      .exists()
      .catch(err => (error = err))
      .then(() => {
        expect(error, "expected error").to.exist;
      });
  });

  it("should rejet with error", () => {
    let error;
    return opfs
      .readFile("./non-exist-file")
      .catch(err => (error = err))
      .then(() => {
        expect(error).to.exist;
        expect(error.code).to.equal("ENOENT");
      });
  });

  it("should work as callback", done => {
    opfs.readFile("./non-exist-file", err => {
      expect(err.code).to.equal("ENOENT");
      done();
    });
  });

  it("should keep Stats w/o mod", () => {
    expect(opfs.Stats).to.equal(fs.Stats);
  });

  it("should allow adding optional pkgs", () => {
    opfs._opfsAddOptionals({
      name: "test",
      context: "blah",
      func: function(v, cb) {
        process.nextTick(() => cb(null, v));
      }
    });
    opfs._opfsInitialize(false);
    return opfs.$.test("hello").then(x => {
      expect(x).to.equal("hello");
    });
  });

  it("should allow setting custom promise", () => {
    opfs._opfsSetPromise(require("bluebird"));
    let count = 0;
    return opfs
      .readdir(".")
      .each(() => count++)
      .then(() => {
        expect(count).to.be.above(0);
      });
  });

  it("should not use packages in devDependencies when NODE_ENV is production", () => {
    delete require.cache[require.resolve("../..")];
    process.env.NODE_ENV = "production";

    opfs = require("../..");
    expect(opfs.$.rimraf).to.not.exist;
  });
});
