import { Alert, Card, CardMedia } from '@mui/material';
import React, { Component } from 'react';

export default class KolloqeImage extends Component {
  render() {
    return (
      this.props.message?.content !== undefined || this.props.message?.content.trim() !== "" ?
        <Card
          sx={{
            width: "70%",
          }}>
          <CardMedia
            component="img"
            height="140"
            image={this.props.message.content || ''}
            alt="Image unavailable" />
        </Card>
        :
        <div
          style={{
            width: "70%",
          }}>
            <Alert severity="error">Image unavailable</Alert>
        </div>
    );
  }
}
