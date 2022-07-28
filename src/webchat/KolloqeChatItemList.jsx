import { Stack } from '@mui/material';
import React, { Component } from 'react';
import KolloqeImage from './attachment/KolloqeImage';
import KolloqeCards from './cards/KolloqeCards';
import BotIndicator from './indicator/BotIndicator';
import KolloqeButtons from './quickReply/KolloqeButtons';
import KolloqeTextItem from './text/KolloqeTextItem';

export default class KolloqeChatItemList extends Component {
  render() {
    return (
      <Stack
        direction={"column"}
        spacing={1}
        sx={{
          width: "100%",
          padding: "10px",
        }}
        className={"overflow-hidden"}>
        {this.props.messages.map((message, index) => {
          return (
            message.type === "text" ?
              <KolloqeTextItem
                key={index}
                message={message}
                enableURLs={this.props.enableURLs} />
              :
              (message.type === "indicator" ?
                <BotIndicator 
                  key={index}
                  indicatorType={this.props.indicatorType} />
                :
                (message.type === "buttons" ?
                  <KolloqeButtons
                    key={index}
                    message={message}
                    disabled={this.props.disablePreviousQuickReplies ? ((this.props.messages.length - 1) === index ? false : true) : false}
                    sendPayload={this.props.sendPayload} />
                  :
                  (message.type === "attachment" ?
                    <KolloqeImage
                      key={index}
                      message={message} />
                    :
                    (message.type === "image" ?
                      <KolloqeImage
                        key={index}
                        message={message} />
                      :
                      (message.type === "cards" &&
                        <KolloqeCards
                          key={index}
                          message={message}
                          disabled={this.props.disablePreviousQuickReplies ? ((this.props.messages.length - 1) === index ? false : true) : false}
                          sendPayload={this.props.sendPayload} />
                      )))))
          );
        })}
      </Stack>
    );
  }
}
