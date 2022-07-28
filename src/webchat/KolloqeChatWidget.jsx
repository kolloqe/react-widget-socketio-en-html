import 'bootstrap/dist/css/bootstrap.min.css';
import './KolloqeChatWidget.css';
import {
  ChatBubbleRounded,
  Close,
  Fullscreen,
  Send,
  Delete,
  MoreVert
} from '@mui/icons-material';
import {
  Avatar,
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialIcon,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { Component } from 'react';
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";
import { localStorageKeys } from './configs';
import KolloqeChatItemList from './KolloqeChatItemList';
import ScrollToBottom from 'react-scroll-to-bottom';
import KeyboardInput from '../keyboardInterface/KeyboardInterface';

let socket;

export default class KolloqeChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgetOpen: localStorage.getItem(`${localStorageKeys.kolloqeWidgetOpen}`) === "false" ? false : true,
      message: "",
      socketId: undefined,
      sessionFound: false,
      messageQueue: [],
      widgetOptionsOpen: false,
      widgetOptionsAnchorEl: null,
    };

    // handlers
    this.handleWidgetState = this.handleWidgetState.bind(this);
    this.handleWidgetClose = this.handleWidgetClose.bind(this);
    this.handleWidgetOpen = this.handleWidgetOpen.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageChangeText = this.handleMessageChangeText.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageValidate = this.handleMessageValidate.bind(this);
    this.handleMessageSendKey = this.handleMessageSendKey.bind(this);
    this.handleMessageReset = this.handleMessageReset.bind(this);
    this.displayText = this.displayText.bind(this);
    this.displayIndicator = this.displayIndicator.bind(this);
    this.displayAttachment = this.displayAttachment.bind(this);
    this.displayButtons = this.displayButtons.bind(this);
    this.displayCards = this.displayCards.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleButtonPayload = this.handleButtonPayload.bind(this);
    this.handleWidgetOptionsClick = this.handleWidgetOptionsClick.bind(this);
    this.handleWidgetOptionsClose = this.handleWidgetOptionsClose.bind(this);
    this.handleClearChat = this.handleClearChat.bind(this);
    this.cleanupIndicator = this.cleanupIndicator.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
  }

  componentDidMount() {
    try {
      socket.offAny();
      socket.disconnect();
    } catch (err) {
      console.log("No existing listeners!");
    }

    socket = io(this.props.socketURL);

    socket.on('connect', () => {
      let session_id = null;
      let session_id_suffix = uuidv4();

      if (this.props.persistSession) {
        let persisted_session = localStorage.getItem(`${localStorageKeys.kolloqeChatSession}`);
        if (persisted_session === null || persisted_session === undefined) {
          session_id = `${socket.id}${session_id_suffix}`;
          localStorage.setItem(
            `${localStorageKeys.kolloqeChatSession}`,
            JSON.stringify({
              sender_id: session_id,
              messages: []
            })
          );
          console.log("Session Not Found!, New SID: ", session_id);
        } else {
          persisted_session = JSON.parse(persisted_session);
          session_id = persisted_session.sender_id;
          let messages = persisted_session.messages;

          localStorage.setItem(
            `${localStorageKeys.kolloqeChatSession}`,
            JSON.stringify({
              sender_id: session_id,
              messages: messages,
            })
          );

          this.setState({
            sessionFound: true,
            messageQueue: messages,
          });

          console.log("Session Found, SID: ", session_id);
        }
      } else {
        localStorage.removeItem(`${localStorageKeys.kolloqeChatSession}`);
        localStorage.removeItem(`${localStorageKeys.kolloqeLocalChatSession}`);

        session_id = `${socket.id}${session_id_suffix}`;

        localStorage.setItem(`${localStorageKeys.kolloqeLocalChatSession}`, JSON.stringify({
          sender_id: session_id,
          messages: []
        }))

        console.log("Local Session, SID: ", session_id);
      }

      this.setState({
        socketId: session_id,
      }, () => {
        socket.emit('session_request', { session_id });

        try {
          if (this.props.initPayload.toString().trim() !== "" && !this.state.sessionFound) {
            socket.emit('user_uttered', {
              "message": this.props.initPayload.toString().trim(),
              "session_id": session_id
            });
          }
        } catch (err) {
          console.error(err);
          console.error("Could not sent the init payload");
        }

        console.log("Connected to Socket.io server");
      });
    });

    socket.on("connect_error", () => {
      console.log("Reconnecting...");
      setTimeout(() => {
        socket.connect();
      }, Number(this.props.reconnectTimeout) || 6000);
    });

    socket.on('disconnect', () => {
      this.setState({
        socketId: undefined
      }, () => {
        console.log("Disconnected");
      });
    });

    socket.on('reconnect', () => {
      this.setState({
        socketId: socket.id
      }, () => {
        console.log("Reconnected");
      });
    });

    socket.on('bot_uttered', (response) => {
      console.log("Bot uttered:", response);
      if (response?.text) {
        this.displayText(response.text, "bot");
      }
      if (response?.quick_replies) {
        this.displayButtons(response.quick_replies);
      }
      if (response?.image) {
        this.displayImage(response.image, "bot");
      }
      if (response?.attachment) {
        this.displayAttachment(response.attachment.payload.src, "bot");
      }
      if (response?.cards) {
        this.displayCards(response.cards);
      }
    });
  }

  componentWillUnmount() {
    socket.disconnect(() => {
      console.log("Disconnect Emitted!");
    });

    socket.offAny();
  }

  handleWidgetState() {
    this.setState({
      widgetOpen: !this.state.widgetOpen,
    });
    localStorage.setItem(`${localStorageKeys.kolloqeWidgetOpen}`, !this.state.widgetOpen);
  }

  handleWidgetClose() {
    this.setState({
      widgetOpen: false,
    });
    localStorage.setItem(`${localStorageKeys.kolloqeWidgetOpen}`, false);
  }

  handleWidgetOpen() {
    this.setState({
      widgetOpen: true,
    });
    localStorage.setItem(`${localStorageKeys.kolloqeWidgetOpen}`, true);
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  handleMessageChangeText(text) {
    this.setState({
      message: text,
    });
  }

  handleMessageValidate(message) {
    if (message.trim() === "") {
      console.log("Empty Message");
      return false;
    } else if (!this.props.triggerIntents && message.startsWith("/")) {
      console.log("Triggerring Intents has been disabled");
      return false;
    } else {
      return true;
    }
  }

  handleMessageReset() {
    this.setState({
      message: "",
    });
    this.messageRef.handleInputFocus();
    this.messageRef.handleInputReset();
  }

  handleMessageSendKey(event) {
    if (event.keyCode === 13) {
      this.handleMessageSend();
    }
  }

  handleMessageSend(event) {
    if (this.handleMessageValidate(this.state.message)) {
      socket.emit('user_uttered', {
        "message": this.state.message,
        "session_id": this.state.socketId
      });
      this.displayText(this.state.message, "user");
      console.log(`User uttered: ${this.state.message}`);
    }
    this.handleMessageReset();
  }

  handleButtonPayload(payload, title) {
    if (this.handleMessageValidate(payload)) {
      socket.emit('user_uttered', {
        "message": payload,
        "session_id": this.state.socketId
      });
      this.displayText(title, "user");
      console.log(`User uttered: ${title} ${payload}`);
    }
  }

  handleInputFocus() {
    this.messageRef.handleInputFocus();
  }

  handleWidgetOptionsClick(event) {
    this.setState({
      widgetOptionsAnchorEl: event.currentTarget,
      widgetOptionsOpen: true,
    });
  }

  handleWidgetOptionsClose() {
    this.setState({
      widgetOptionsOpen: false,
      widgetOptionsAnchorEl: null,
    });
  }

  handleClearChat() {
    this.setState({
      messageQueue: [],
      widgetOptionsOpen: false,
      widgetOptionsAnchorEl: null,
    }, () => {
      localStorage.setItem(
        `${localStorageKeys.kolloqeChatSession}`,
        JSON.stringify({
          sender_id: this.state.socketId,
          messages: [],
        })
      );
      localStorage.setItem(
        `${localStorageKeys.kolloqeLocalChatSession}`,
        JSON.stringify({
          sender_id: this.state.socketId,
          messages: [],
        })
      );
    });
  }

  displayMessage(message) {
    this.cleanupIndicator();

    let messageQueue = [];
    let sender_id = null;

    if (this.props.persistSession) {
      const persistedQueue = JSON.parse(localStorage.getItem(`${localStorageKeys.kolloqeChatSession}`));
      messageQueue = persistedQueue.messages || [];
      sender_id = persistedQueue.sender_id;
    } else {
      const localQueue = JSON.parse(localStorage.getItem(`${localStorageKeys.kolloqeLocalChatSession}`));
      messageQueue = localQueue.messages || [];
      sender_id = localQueue.sender_id;
    }

    messageQueue.push(message);

    if (this.props.persistSession) {
      localStorage.setItem(
        `${localStorageKeys.kolloqeChatSession}`,
        JSON.stringify({ sender_id, messages: messageQueue })
      );
    } else {
      localStorage.setItem(
        `${localStorageKeys.kolloqeLocalChatSession}`,
        JSON.stringify({ sender_id, messages: messageQueue })
      );
    }

    this.setState({
      messageQueue: [...this.state.messageQueue, message],
    }, () => {
      if (message?.origin === "user") {
        this.displayIndicator();
      }
    });

    console.log("Message queue was updated!");
  }

  displayIndicator() {
    this.setState({
      messageQueue: [...this.state.messageQueue, { origin: "bot", type: "indicator" }],
    }, () => {
      if (this.props?.indicatorDelay > 0) {
        setTimeout(() => {
          this.cleanupIndicator();
        }, this.props.indicatorDelay);
      }
    });
  }

  cleanupIndicator() {
    if (this.state.messageQueue.slice(-1)[0]?.type === "indicator") {
      let messageQueue = this.state.messageQueue;
      messageQueue.pop()

      this.setState({
        messageQueue: [...messageQueue],
      });
    }
  }

  displayText(text, origin) {
    this.displayMessage({ origin, type: 'text', content: text });
  }

  displayButtons(buttons) {
    this.displayMessage({ origin: "bot", type: 'buttons', content: buttons });
  }

  displayAttachment(attachment, origin) {
    this.displayMessage({ origin, type: 'attachment', content: attachment });
  }

  displayImage(image, origin) {
    this.displayMessage({ origin, type: 'image', content: image });
  }

  displayCards(cards) {
    this.displayMessage({ origin: "bot", type: 'cards', content: cards });
  }

  render() {
    function stringAvatar(name) {
      return {
        children: `${name.split(' ')[0][0]}`,
      };
    }

    function widgetPosition(position, positionProps) {
      if (position === "left") {
        return {
          bottom: positionProps?.yAxis || "10px",
          left: positionProps?.xAxis || "16px"
        }
      } else {
        return {
          bottom: positionProps?.yAxis || "10px",
          right: positionProps?.xAxis || "16px"
        }
      }
    }

    function launcherPosition(position) {
      if (position === "left") {
        return "flex-start"
      } else {
        return "flex-end"
      }
    }

    return (
      this.state.socketId !== undefined || !this.props.hideWhenNotConnected ?
        <Box
          sx={{
            '& > :not(style)': { m: 1 },
            // position: '-webkit-sticky',
            position: 'fixed',
            zIndex: 'modal',
            ...widgetPosition(this.props.position, this.props.positionProps),
          }}>
          <Stack
            direction={'column'}
            alignItems={launcherPosition(this.props.position)}>
            {this.state.widgetOpen &&
              <ClickAwayListener
                onClickAway={this.handleWidgetClose}>
                <Box
                  sx={{
                    width: "380px",
                    height: "560px",
                    zIndex: '1049 !important',
                  }}>
                  <motion.div
                    initial={{ y: 6, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`kolloqe-widget-bg w-100 h-100 shadow overflow-hidden`}>
                    <Stack
                      direction='column'
                      justifyContent={"space-between"}
                      alignItems={"stretch"}
                      sx={{ height: "100%", width: "100%" }}>
                      <Stack
                        direction={'column'}
                        sx={{
                          width: "100%",
                          height: "100%"
                        }}>
                        <Box
                          className={`kolloqe-widget-header`}>
                          <Stack
                            direction={'row'}
                            spacing={1}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            className="w-100">
                            <Stack
                              direction={'row'}
                              spacing={1}>
                              {this.props.avatar && (
                                (
                                  this.props.avatarType === "image" ?
                                    <Avatar
                                      sx={{ width: 56, height: 56, bgcolor: "black" }}
                                      alt="KolloqeAvatar"
                                      src={this.props.avatarLink || ""} />
                                    :
                                    <Avatar
                                      {...stringAvatar(this.props.title)}
                                      sx={{ width: 56, height: 56, bgcolor: "black" }} />
                                )
                              )}
                              <Stack
                                direction={'column'}>
                                <Typography
                                  variant="h6"
                                  style={{ wordBreak: 'break-word' }}>
                                  {this.props.title}
                                </Typography>
                                {this.props?.subtitle &&
                                  <Typography
                                    variant="body1"
                                    style={{ wordBreak: 'break-word' }}>
                                    {this.props.subtitle}
                                  </Typography>
                                }
                              </Stack>
                            </Stack>
                            <Stack
                              className={"float-right"}
                              spacing={1}
                              direction="row">
                              {(this.props.widgetOptions && this.props?.widgetOptionsPosition === "bottom") &&
                                this.props.fullscreenButton &&
                                <Tooltip title="Fullscreen" placement="bottom-end">
                                  <IconButton
                                    aria-label="fullscreen"
                                    className="kolloqe-widget-fullscreen float-right">
                                    <Fullscreen />
                                  </IconButton>
                                </Tooltip>
                              }
                              {(this.props.widgetOptions && this.props?.widgetOptionsPosition === "top") &&
                                <>
                                  {this.props.fullscreenButton &&
                                    <Tooltip title="Fullscreen" placement="bottom-end">
                                      <IconButton
                                        aria-label="fullscreen"
                                        className="kolloqe-widget-fullscreen float-right">
                                        <Fullscreen />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                  {this.props.moreOptions &&
                                    <Box>
                                      <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={this.state.widgetOptionsOpen ? 'long-menu' : undefined}
                                        aria-expanded={this.state.widgetOptionsOpen ? 'true' : undefined}
                                        aria-haspopup="true"
                                        style={{ color: "white" }}
                                        onClick={(e) => { this.handleWidgetOptionsClick(e) }}>
                                        <MoreVert />
                                      </IconButton>
                                      <Menu
                                        id="long-menu"
                                        MenuListProps={{
                                          'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={this.state.widgetOptionsAnchorEl}
                                        open={this.state.widgetOptionsOpen}
                                        onClose={this.handleWidgetOptionsClose}
                                        PaperProps={{
                                          style: {
                                            maxHeight: 48 * 4.5,
                                          },
                                        }}>
                                        <MenuItem
                                          onClick={this.handleClearChat}>
                                          {"Clear Chat"}
                                        </MenuItem>
                                      </Menu>
                                    </Box>
                                  }
                                </>
                              }
                            </Stack>
                          </Stack>
                        </Box>
                        <ScrollToBottom
                          initialScrollBehavior='smooth'>
                          <Box
                            className="kolloqe-message-list"
                            sx={this.props.widgetOptionsPosition === "bottom" ?
                              {
                                width: "100%",
                                height: "376px",
                                maxHeight: "376px",
                              }
                              :
                              {
                                width: "100%",
                                height: "424px",
                                maxHeight: "424px",
                              }}>
                            <KolloqeChatItemList
                              messages={this.state.messageQueue}
                              enableURLs={this.props.enableURLs}
                              disablePreviousQuickReplies={this.props.disablePreviousQuickReplies}
                              sendPayload={this.handleButtonPayload}
                              indicatorType={this.props.indicatorType} />
                          </Box>
                        </ScrollToBottom>
                      </Stack>
                      {(this.props.widgetOptions && this.props?.widgetOptionsPosition === "bottom") &&
                        <Stack
                          direction={'row'}
                          style={{ backgroundColor: "#37474F" }}
                          spacing={1}
                          className={"px-3 py-1"}>
                          <Box
                            className={`w-100`}
                            onClick={this.handleInputFocus}>
                            <Stack
                              className={"float-right"}
                              spacing={1}
                              direction="row"
                              sx={{ width: "100%" }}
                              justifyContent={'space-between'}>
                              {this.props.moreOptions &&
                                <Tooltip title="Clear Chat" placement="top-end">
                                  <IconButton
                                    style={{ color: "white" }}
                                    onClick={this.handleClearChat}>
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              }
                            </Stack>
                          </Box>
                        </Stack>
                      }
                      <Stack
                        direction={'row'}
                        spacing={1}>
                        <Box
                          className={`kolloqe-widget-header w-100`}
                          onClick={this.handleInputFocus}>
                          <Stack
                            direction={'row'}
                            spacing={1}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            className="w-100">
                            <KeyboardInput
                              interface={"input"}
                              value={""}
                              placeholder="Type a message here..."
                              className={"w-100 kolloqe-widget-message"}
                              disableUnderline={true}
                              ref={messageRef => this.messageRef = messageRef}
                              handleChange={(e) => { this.handleMessageChange(e) }}
                              handleTextChange={this.handleMessageChangeText}
                              handleShortcut={this.handleLanguage}
                              handleEnter={this.handleMessageSend} />
                            <IconButton
                              aria-label="fullscreen"
                              className="kolloqe-widget-send float-right"
                              onClick={(e) => { this.handleMessageSend(e) }}
                              disabled={this.state.message === "" ? true : false}>
                              <Send />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Stack>
                    </Stack>
                  </motion.div>
                </Box>
              </ClickAwayListener>
            }
            <SpeedDial
              ariaLabel="SpeedDial playground example"
              hidden={false}
              icon={<SpeedDialIcon icon={<ChatBubbleRounded />} openIcon={<Close />} />}
              direction={'up'}
              open={this.state.widgetOpen}
              onClick={this.handleWidgetState}
              className={`kolloqe-launcher`}
              sx={{
                width: "60px"
              }}
            />
          </Stack>
        </Box>
        :
        <></>
    );
  }
}

KolloqeChatWidget.propTypes = {
  position: PropTypes.oneOf(["right", "left"]),
  positionProps: PropTypes.object,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  defaultLang: PropTypes.oneOf(["en", "si"]),
  avatar: PropTypes.bool,
  avatarType: PropTypes.oneOf(["text", "image"]),
  avatarLink: PropTypes.string,
  socketURL: PropTypes.string,
  initPayload: PropTypes.string,
  reconnectTimeout: PropTypes.number,
  widgetOptions: PropTypes.bool,
  fullscreenButton: PropTypes.bool,
  langSwitch: PropTypes.bool,
  moreOptions: PropTypes.bool,
  widgetOptionsPosition: PropTypes.oneOf(["top", "bottom"]),
  hideWhenNotConnected: PropTypes.bool,
  displayUnreadCount: PropTypes.bool,
  showMessageDate: PropTypes.bool,
  customMessageDelay: PropTypes.func,
  persistSession: PropTypes.bool,
  triggerIntents: PropTypes.bool,
  enableURLs: PropTypes.bool,
  disablePreviousQuickReplies: PropTypes.bool,
  indicatorDelay: PropTypes.number,
  indicatorType: PropTypes.oneOf(["scaling", "bouncing"]),
  params: PropTypes.object,
  enableShortcuts: PropTypes.bool,
  shortcutKey: PropTypes.oneOf([32, 81]),
};

KolloqeChatWidget.defaultProps = {
  position: "right",
  positionProps: {
    xAxis: "100px",
    yAxis: "100px"
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
};

