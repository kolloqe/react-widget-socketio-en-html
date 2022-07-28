const fs = require('fs');
const glob = require("glob");
const path = require("path");
var packageJSON = require('../package.json');

const buildFilePattern = "build/static/js/*.js";
const buildStylesPattern = "build/static/css/*.css";
const releaseDirPath = `release/v${packageJSON.version}/`;
const releaseFilePath = `release/v${packageJSON.version}/kolloqe-widget-socketio-en-html-v${packageJSON.version}.js`;
const releaseStylesPath = `release/v${packageJSON.version}/kolloqe-widget-socketio-en-html-v${packageJSON.version}.css`;
const releaseHTMLPath = `release/v${packageJSON.version}/kolloqe-widget-socketio-en-html-v${packageJSON.version}-test.html`;

const componentExists = fs.existsSync(releaseFilePath);
const styleExists = fs.existsSync(releaseStylesPath);

if (componentExists || styleExists) {
  log("Release already exists! Consider bumping the version up in package.json!", "error");
} else {
  let component = null;
  let style = null;

  glob(buildFilePattern, function (er, files) {
    if (files.length > 0) {
      component = files[0];

      glob(buildStylesPattern, function (er, files) {
        if (files.length > 0) {
          style = files[0];

          if (component == null || style == null) {
            log("Could not locate one or more build soure files!", "error");
          } else {
            const dirExists = fs.existsSync(releaseDirPath);
            if (!dirExists) {
              fs.mkdir(releaseDirPath, { recursive: true }, (err) => {
                if (err) {
                  log(`Failed to initialize the release dir: ${releaseDirPath}`, "error");
                }
              });
              triggerRelease(component, releaseFilePath, style, releaseStylesPath, releaseHTMLPath);
            }
          }
        } else {
          log("Could not locate one or more build soure files!", "error");
        }
      });
    } else {
      log("Could not locate one or more build soure files!", "error");
    }
  });
}

function triggerRelease(component, releaseFilePath, style, releaseStylesPath, releaseHTMLPath) {
  fs.copyFile(component, releaseFilePath, (err) => {
    if (err) {
      log("Releasing Component Failed", "error");
    } else {
      log(`Released a new component version: (${path.basename(releaseFilePath)}). You may find it in the ./release dir.`, "success");
    }
  });

  fs.copyFile(style, releaseStylesPath, (err) => {
    if (err) {
      log("Releasing Styles Failed", "error");
    } else {
      log(`Released a new Styles version: (${path.basename(releaseStylesPath)}). You may find it in the ./release dir.`, "success");
    }
  });

  let testHtml = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <title>Kolloqe | Socketio Widget</title>
  </head>

  <body>
    <h2>Kolloqe Socketio Chat Widget</h2>
    <div id="testid"></div>

    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script>
      window.kolloqe_webchat_id = "testid";
      window.kolloqeProps = {
        testid: {
          position: "right",
          positionProps: {
            xAxis: "10px",
            yAxis: "10px"
          },
          title: "Kolloqe ⚡",
          subtitle: "chat widget",
          defaultLang: "en",
          avatar: true,
          avatarType: "text",
          avatarLink: "",
          socketURL: "http://localhost:5005",
          initPayload: "/get_started",
          reconnectTimeout: 5000,
          widgetOptions: true,
          fullscreenButton: false,
          langSwitch: true,
          moreOptions: true,
          widgetOptionsPosition: "top",
          hideWhenNotConnected: true,
          displayUnreadCount: false,
          showMessageDate: false,
          customMessageDelay: null,
          persistSession: true,
          triggerIntents: true,
          enableURLs: true,
          disablePreviousQuickReplies: true,
          indicatorDelay: 0,
          indicatorType: "bouncing",
          params: null,
          enableShortcuts: true,
          shortcutKey: 81,
        }
      };

      const version = "${packageJSON.version}";
      const source = "kolloqe-widget-socketio-en-html-v${packageJSON.version}";

      !(function () {
        let e = document.createElement("script");
        let s = document.createElement("link");
        let t = document.head || document.getElementsByTagName("head")[0];
        (e.src = "kolloqe-widget-socketio-en-html-v${packageJSON.version}.js"),
          (e.async = !0),
          (e.onload = () => { }),
          t.insertBefore(e, t.firstChild);

        (s.href = "kolloqe-widget-socketio-en-html-v${packageJSON.version}.css"),
          (s.rel = "stylesheet"),
          (s.type = "text/css"),
          t.insertBefore(s, t.firstChild);
      })();
    </script>
  </body>

  </html>
  `;

  fs.writeFile(releaseHTMLPath, testHtml, (error) => {
    if (error) {
      log("Failed to generate the test HTML page. You might need to build it manually!", "error");
    }
    log(`Released a test HTML: (${path.basename(releaseHTMLPath)}). You may find it in the ./release dir.`, "success");
  });
}

function log(text, type) {
  if (type === "error") {
    console.error(
      "\x1b[31m",
      text,
      "\x1b[0m"
    );
    process.exit();
  } else if (type === "success") {
    console.log(
      "\x1b[32m",
      text,
      "\x1b[0m"
    );
  } else {
    console.log(text);
  }
}