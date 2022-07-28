import React, { Component } from 'react';
import KolloqeCard from './KolloqeCard';
import Slider from 'react-slick';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import "./KolloqeCards.css";

export default class KolloqeCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCardIndex: 0,
    };

    // handlers
    this.handleCardIndex = this.handleCardIndex.bind(this);
  }

  handleCardIndex(index) {
    this.setState({
      currentCardIndex: index,
    });
  }

  render() {
    const NextArrow = ({ onClick }) => {
      return (
        <IconButton
          varient={"contained"}
          color="primary"
          aria-label="next"
          component="label"
          className="kolloqe-slider-arrow kolloqe-slider-arrow-next"
          onClick={onClick}>
          <KeyboardArrowRight />
        </IconButton>
      );
    };

    const PrevArrow = ({ onClick }) => {
      return (
        <IconButton
          color="primary"
          aria-label="next"
          component="label"
          className="kolloqe-slider-arrow kolloqe-slider-arrow-prev"
          onClick={onClick}>
          <KeyboardArrowLeft />
        </IconButton>
      );
    };

    return (
      <Box 
        sx={{ 
          width: "100%",
        }}
        className="my-4">
        <Slider
          infinite={true}
          lazyLoad={true}
          speed={300}
          slidesToShow={1}
          centerMode={true}
          centerPadding={0}
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
          beforeChange={(current, next) => { this.handleCardIndex(next) }}>
          {this.props.message?.content.map((card, index) => {
            return (
              <KolloqeCard
                key={index}
                card={card}
                sendPayload={this.props.sendPayload}
                disabled={this.props.disabled}
                className={index === this.state.currentCardIndex ? "kolloqe-card kolloqe-card-active" : "kolloqe-card"} />
            )
          })
          }
        </Slider>
      </Box >
    );
  }
}
