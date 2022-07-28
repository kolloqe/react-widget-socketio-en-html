var rimraf = require("rimraf");
const cacheProjectPath = "cache";

console.log(
  "\x1b[32m",
  "Cleanup triggerred...",
  "\x1b[0m"
);
rimraf.sync(cacheProjectPath);
console.log(
  "\x1b[32m",
  "Done!",
  "\x1b[0m"
);