import { Box, Stack, Typography } from '@mui/material';
import React, { Component } from 'react';

export default class UserChatBubble extends Component {
  render() {
    return (
      <Stack
        sx={{
          width: "100%",
        }}
        direction={"row"}
        justifyContent={"end"}>
        <Box
          className={"kolloqe-chat-bubble"}
          sx={{
            maxWidth: "70%",
            borderRadius: 1,
            padding: 1,
            backgroundColor: "#43A047",
          }}>
          <Typography
            noWrap={false}
            sx={{
              maxWidth: "100%",
              color: "#E0E0E0",
            }}
            style={{
              wordWrap: "break-word",
            }}>
            {this.props.text}
          </Typography>
        </Box>
      </Stack>
    );
  }
}
