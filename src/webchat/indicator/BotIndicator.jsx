import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { Component } from 'react';
import TypingChatBubble from './TypingChatBubble';

export default class BotIndicator extends Component {
  render() {
    return (
      <Stack
        sx={{
          width: "100%",
        }}
        direction={"row"}
        justifyContent={"start"}>
        <Box
          className={"kolloqe-chat-indicator"}
          sx={{
            maxWidth: "70%",
            borderRadius: 1,
            padding: 1,
          }}>
          <TypingChatBubble
            indicatorType={this.props.indicatorType} />
        </Box>
      </Stack>
    );
  }
}
