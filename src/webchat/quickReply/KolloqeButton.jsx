

import { Button } from '@mui/material';
import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

export default class KolloqeButton extends Component {
  render() {
    const quickReplyButtonTheme = createTheme({
      palette: {
        type: 'light',
        primary: {
          main: '#7E57C2',
        },
        secondary: {
          main: '#B39DDB',
        },
      }
    });

    return (
      <ThemeProvider theme={quickReplyButtonTheme}>
      <Button
        variant="contained"
        className="float-end"
        sx={{ border: "none", "&:hover": { border: "none" } , margin: "2px" }}
        onClick={(e) => {this.props.sendPayload(this.props.content?.payload, this.props.content?.title)}}
        disabled={this.props.disabled}>
        {this.props.content?.title}
      </Button>
      </ThemeProvider>
    );
  }
}
