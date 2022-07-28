export const localStorageKeys = {
  kolloqeWidgetOpen: "kolloqeWidgetOpen",
  kolloqeChatSession: "kolloqeChatSession",
  kolloqeLocalChatSession: "kolloqeLocalChatSession",
  kolloqeSelectedLang: "kolloqeSelectedLang"
}

export const webchatConfigs = {
  initPayload: "/get_started",
  urlEndpoint: "http://localhost:5005",
  socketPath: "/socket.io/",
  title: "Kolloqe ⚡",
  customData: {"language": "en"},
  docViewer: true,
  subtitle: null,
  inputTextFieldHint: "Type a message",
  hideWhenNotConnected: true,
  // connectOn
  // onSocketEvent: {
  //   'bot_uttered': () => console.log('the bot said something'),
  //   'connect': () => console.log('connection established'),
  //   'disconnect': () => doSomeCleanup(),
  // },
  embedded: false,
  showFullScreenButton: false,
  displayUnreadCount: false,
  showMessageDate: false,
  // customMessageDelay
  // params: {
  //   images: {
  //     dims: {
  //       width: 300,
  //       height: 200
  //     }
  //   }
  // },
  storage: "local",
  customComponent: null,
  onWidgetEvent: {},
  linkRegex: /(\[[a-zA-Z0-9\\,./{}!~#$%^&*()_\-+=:;'"`@<> ]+\]\([\S]+\))/g,
  subLinkRegex: /\[([a-zA-Z0-9\\,./{}!~#$%^&*()_\-+=:;'"`@<> ]+)\]\(([\S]+)\)/g,
}