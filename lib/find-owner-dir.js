"use strict";

const Path = require("path");
const fs = require("fs");

function searchUp(ownerDir) {
  let n = 50;
  while (--n > 0) {
    if (fs.existsSync(Path.join(ownerDir, "package.json"))) break;
    const tmp = Path.join(ownerDir, "..");
    if (tmp === ownerDir) break;
    ownerDir = tmp;
  }

  return ownerDir;
}

function findOwnerDir(origin) {
  let ownerDir = origin || __dirname;
  const nmX = ownerDir.indexOf(`node_modules${Path.sep}opfs`);

  if (nmX > 0) {
    ownerDir = ownerDir.substring(0, nmX);
  } else {
    const ix = ownerDir.indexOf("node_modules") > 0 && ownerDir.indexOf(`${Path.sep}opfs`);
    ownerDir = searchUp(ix > 0 ? ownerDir.substring(0, ix) : ownerDir);
  }

  return ownerDir;
}

module.exports = findOwnerDir;
