import React, { Component } from 'react';
import KeyboardInput from '../KeyboardInterface';

export default class Examples extends Component {
  render() {
    return (
      <>
        {/* use as a normal text field without handlers */}
        <KeyboardInput
          interface={"textfield"}
          placeholder="Data Instance"
          value={""}
          className={"w-100"}
          disableUnderline={true}
          defaultLanguage={"en"}
          // ref={messageRef => this.dataInstanceRef = messageRef}
          // handleChange={(e) => { this.handleDataInstanceChange(e) }}
          // handleTextChange={this.handleDataInstanceChangeText}
          // handleShortcut={this.handleLanguage}
          // handleEnter={this.handleExplain}
          enableShortcuts={true}
          shortcutKey={81}
          error={false}
          helperText={""} />
          <br />
          <br />
          <br />
        {/* use as a text field with handlers.. means */}
        <KeyboardInput
          interface={"textfield"}
          placeholder="Data Instance"
          value={""}
          className={"w-100"}
          disableUnderline={true}
          defaultLanguage={"en"}
          // ref={messageRef => this.dataInstanceRef = messageRef}
          // handleChange={(e) => { this.handleDataInstanceChange(e) }}
          // handleTextChange={this.handleDataInstanceChangeText}
          // handleShortcut={this.handleLanguage}
          // handleEnter={this.handleExplain}
          enableShortcuts={true}
          shortcutKey={81}
          error={false}
          helperText={""} />
        <br />
        <br />
        <br />
        <KeyboardInput
        interface={"input"}
        value={""}
        placeholder="Type a message here..."
        className={"w-100 kolloqe-widget-message"}
        disableUnderline={true}
        defaultLanguage={"si"}
        // ref={messageRef => this.messageRef = messageRef}
        // handleChange={(e) => { this.handleMessageChange(e) }}
        // handleTextChange={this.handleMessageChangeText}
        // handleShortcut={this.handleLanguage}
        // handleEnter={this.handleMessageSend}
        enableShortcuts={true}
        shortcutKey={32} />
      </>
    );
  }
}
