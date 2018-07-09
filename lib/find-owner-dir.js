"use strict";

const Path = require("path");
const fs = require("fs");

function findOwnerDir(origin) {
  let ownerDir = origin || __dirname;
  const nmX = ownerDir.indexOf("node_modules");

  if (nmX > 0) {
    ownerDir = ownerDir.substring(0, nmX);
  } else {
    let n = 50;
    while (--n > 0) {
      if (fs.existsSync(Path.join(ownerDir, "package.json"))) break;
      const tmp = Path.join(ownerDir, "..");
      if (tmp === ownerDir) break;
      ownerDir = tmp;
    }
  }

  return ownerDir;
}

module.exports = findOwnerDir;
