import { Button } from '@mui/material';
import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

export default class KolloqeCardButton extends Component {
  render() {
    const cardButtonTheme = createTheme({
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
      <ThemeProvider theme={cardButtonTheme}>
        {this.props.actionType === "bot_action" ?
          <Button
            variant='contained'
            size="small"
            disabled={this.props.disabled}
            onClick={(e) => { this.props.sendPayload(this.props.actionPayload, this.props.actionText) }}>
            {this.props.actionText}
          </Button>
          :
          (
            this.props.actionType === "link" ?

              <Button
                variant='contained'
                disabled={this.props.disabled}
                size="small">
                <a
                  href={this.props.actionPayload}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "white"
                  }}>
                  {this.props.actionText}
                </a>
              </Button>
              :
              <Button
                variant='contained'
                disabled={this.props.disabled}
                size="small">
                {this.props.actionText}
              </Button>
          )}
      </ThemeProvider>
    );
  }
}
