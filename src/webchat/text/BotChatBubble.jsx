import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { Component } from 'react';
import reactStringReplace from 'react-string-replace';
import { webchatConfigs } from '../configs';

export default class BotChatBubble extends Component {
  render() {
    function processLink(link, isEnabled) {
      let subLinkParts = link.split(webchatConfigs.subLinkRegex);
      if (subLinkParts.length !== 4) {
        return <span>link</span>;
      } else {
        if (isEnabled) {
          return (
            <a
              href={subLinkParts[2]}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "black",
              }}
              className={"kolloqe-message-link"}>
              {subLinkParts[1]}
            </a>
          );
        } else {
          return (
            <span>
              {subLinkParts[1]}
            </span>
          );
        }
      }
    }

    return (
      <Stack
        sx={{
          width: "100%",
        }}
        direction={"row"}
        justifyContent={"start"}>
        <Box
          className={"kolloqe-chat-bubble"}
          sx={{
            maxWidth: "70%",
            borderRadius: 1,
            padding: 1,
            backgroundColor: "#78909C"
          }}>
          <Typography
            noWrap={false}
            sx={{
              color: "#E0E0E0",
            }}
            style={{ wordWrap: "break-word" }}>
            {reactStringReplace(this.props.text, webchatConfigs.linkRegex, (link, index) => (
              <span key={index}>{processLink(link, this.props.enableURLs)}</span>
            ))}
          </Typography>
        </Box>
      </Stack>
    );
  }
}
