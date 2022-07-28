# react-widget-socketio-html

A Rasa socket.io channel supported React chat widget component attachable via &lt;script> tags. Only supports English.

## Setting up Dev Environmet

The original package was created using `npx create-react-app`. So, to set up a dev environment, the `node_modules` dir initialized using `npx create-react-app` is required to begin with.

- Clone this repo
- Simply run `npm run init` to initialize required node_modeules
- Run `npm i` to install additional packages
- Run `npm start` to run the dev server
- This project adhears to all the commands executable inside a `npx create-react-app` project
- Additionally, this project supports the following npm commands
    1. `npm run init` - initializes required node_modules (takes care of cleanup internally)
    2. `npm run cleanup` - cleans up cached project files
    3. `npm run release` - creates a release that is ready to be attached via a script tag and places it under the `release` dir under the specific version. (takes care of `npm run build` internally)

## Releasing

- When the version is bumped, first do the versioning in the package.json
- run `npm run build` to build the latest build. (This is optional. `npm run release` can take care of this internally)
- run `npm run release` to get the transpiled js module to `release` dir under the proper package version.
- In addition to the js module, a style sheet and a html document where everything is attached for testing are generated automatically.

## Attaching via a `<script>` tag

The component is attachable to any html via a `<script>` tag as follows. You may refer to the test HTML included in each release dir as well.

```html
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
      avatar: true,
      avatarType: "text",
      avatarLink: "",
      socketURL: "http://localhost:5005",
      initPayload: "/get_started",
      reconnectTimeout: 5000,
      widgetOptions: true,
      fullscreenButton: false,
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
    }
  };

  const version = "1.0.0";
  const source = "kolloqe-widget-socketio-en-html-v1.0.0";

  !(function () {
    let e = document.createElement("script");
    let s = document.createElement("link");
    let t = document.head || document.getElementsByTagName("head")[0];
    (e.src = "kolloqe-widget-socketio-en-html-v1.0.0.js"),
      (e.async = !0),
      (e.onload = () => { }),
      t.insertBefore(e, t.firstChild);

    (s.href = "kolloqe-widget-socketio-en-html-v1.0.0.css"),
      (s.rel = "stylesheet"),
      (s.type = "text/css"),
      t.insertBefore(s, t.firstChild);
  })();
</script>
```

## Passing Props

{To be updated}
Refer the [Official Docs](https://kolloqe.github.io) for more details on passing props to kolloqe chat widget component.

## Limitations

- Overriding styles has to be done manually or required to rebuild a different version of the component.
- Does not support snapping to fullscreen yet in smaller screen sizes. We're working on that.
