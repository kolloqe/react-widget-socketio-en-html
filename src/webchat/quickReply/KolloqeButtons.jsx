import { Box } from '@mui/material';
import React, { Component } from 'react';
import KolloqeButton from './KolloqeButton';

export default class KolloqeButtons extends Component {
  render() {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: "70%",
        }}>
        {this.props.message?.content.map((button, index) => {
          return (
            <KolloqeButton
              key={index}
              content={button}
              disabled={this.props.disabled}
              sendPayload={this.props.sendPayload} />
          );
        })}
        {/* {this.props.messages?.content.map((button, index) => {
          return (
            <KolloqeButton 
              key={index} 
              content={button}
              sendPayload={this.props.sendPayload} />
            <p>{JSON.stringify(this.props.message)}</p>
          );
        })} */}
      </Box>
    );
  }
}
