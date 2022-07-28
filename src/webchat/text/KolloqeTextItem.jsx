import React, { Component } from 'react';
import BotChatBubble from './BotChatBubble';
import UserChatBubble from './UserChatBubble';

export default class KolloqeTextItem extends Component {
  render() {
    return (
      <>
        {this.props.message?.origin === "bot" ?
          <BotChatBubble 
            text={this.props.message?.content || ""}
            enableURLs={this.props.enableURLs} />
          :
          <UserChatBubble 
            text={this.props.message?.content || ""}/>
        }
      </>
    );
  }
}
