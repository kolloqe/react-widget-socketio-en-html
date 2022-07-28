const fs = require('fs');
const fse = require('fs-extra');
var rimraf = require("rimraf");
var exec = require('child_process').exec;

const cacheProjectPath = "cache";
const cacheNodeModulesPath = "cache/node_modules";
const destNodeModulesPath = "node_modules";

const dirExists = fs.existsSync(cacheNodeModulesPath);
if (!dirExists) {
  {
    console.log(
      "\x1b[32m",
      "Initializing a cache project...",
      "\x1b[0m"
    );
    var cmd = exec("npx create-react-app cache", function (err, stdout, stderr) {
      if (err) {
        console.error(
          "\x1b[31m",
          `Error occurred while initializing the cache project.`,
          "\x1b[0m"
        );
        console.error(err);
        return;
      } else {
        console.log(
          "\x1b[32m",
          "Successfully initialized the cache project.",
          "\x1b[0m"
        );
        triggerInit(dirExists, cacheNodeModulesPath, destNodeModulesPath, cacheProjectPath);
      }
      // console.log(stdout);
    });
  }
} else {
  triggerInit(dirExists, cacheNodeModulesPath, destNodeModulesPath, cacheProjectPath);
}

function triggerInit(dirExists, cacheNodeModulesPath, destNodeModulesPath, cacheProjectPath) {
  if (dirExists) {
    console.log(
      "\x1b[32m",
      "Copying required node_modules...",
      "\x1b[0m"
    );
    fse.copy(cacheNodeModulesPath, destNodeModulesPath, { overwrite: true })
      .then(() => {
        console.log(
          "\x1b[32m",
          `Successfully copied the required node_modules.`,
          "\x1b[0m"
        );
        // deleting the dummy react project
        try {
          console.log(
            "\x1b[32m",
            `Cleanup triggerred...`,
            "\x1b[0m"
          );
          rimraf.sync(cacheProjectPath);
          console.log(
            "\x1b[32m",
            `Successfully cleaned up the cached project.`,
            "\x1b[0m"
          );
        } catch (err) {
          console.error(
            "\x1b[31m",
            `Failed to remove cached project. Please manually remove 'cache' dir in the project root if it exists.`,
            "\x1b[0m"
          );
        }
      })
      .catch((err) => {
        console.error(
          "\x1b[31m",
          `Failed to copy the required node_modules.`,
          "\x1b[0m"
        );
        console.error(err);
      })
  } else {
    console.error(
      "\x1b[31m",
      `Failed to initialize the required node_modules.`,
      "\x1b[0m"
    );
  }
}