import { Stack } from '@mui/material';
import React, { Component } from 'react';
import './TypingChatBubble.css';

export default class TypingChatBubble extends Component {
  render() {
    return (
      <Stack direction={"row"} justifyContent={'left'}>
        <div className="typing" style={{ backgroundColor: "#B0BEC5" }}>
          <span
            className={`circle ${this.props.indicatorType}`}
            style={{ backgroundColor: "#ECEFF1" }}></span>
          <span
            className={`circle ${this.props.indicatorType}`}
            style={{ backgroundColor: "#ECEFF1" }}></span>
          <span
            className={`circle ${this.props.indicatorType}`}
            style={{ backgroundColor: "#ECEFF1" }}></span>
        </div>
      </Stack>
    );
  }
}
