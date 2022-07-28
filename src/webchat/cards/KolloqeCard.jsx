import { Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import KolloqeCardButton from './KolloqeCardButton';
import React, { Component } from 'react';

export default class KolloqeCard extends Component {
  render() {
    return (
      <Stack
        direction="row"
        justifyContent={'space-around'}>
        <Card
          sx={{
            width: "70%",
          }}
          className={this.props.className}>
          <CardMedia
            component="img"
            height="140"
            image={this.props.card.thumbnail || ''}
            alt="Image unavailable" />
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div">
              {this.props.card.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ wordWrap: "break-word" }}>
              {this.props.card.description}
            </Typography>
          </CardContent>
          <CardActions >
            <Stack
              direction={"column"}
              spacing={1}
              justifyContent={'stretch'}
              sx={{ width: "100%" }}>
              {this.props.card?.buttons.map((action, index) => {
                return (
                  <KolloqeCardButton
                    key={index}
                    disabled={this.props.disabled}
                    actionText={action.text}
                    actionType={action.type}
                    actionPayload={action.payload}
                    sendPayload={this.props.sendPayload} />
                )
              })}
            </Stack>
          </CardActions>
        </Card>
      </Stack>
    );
  }
}
