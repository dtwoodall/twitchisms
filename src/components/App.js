import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import './App.css';
import store from '../store';
import { getTwitchisms, getLastMousePosition } from '../modules';
import { fetchTwitchisms, moveTwitchisms } from '../modules/twitchisms';
import { moveMouse } from '../modules/mouse';

class App extends Component {

  componentDidMount() {
    this.props.fetchTwitchisms();
  }

  handleMouseMove = (event) => {
    let x = event.pageX, y = event.pageY;
    /*if (IE) { // grab the x-y pos.s if browser is IE
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    }*/
    let lastMousePosition = getLastMousePosition(store.getState());
    this.props.moveMouse({x, y});
    let mousePositionDelta = {
      down: lastMousePosition.y ? (y - lastMousePosition.y)/(window.innerHeight - 300) : 0,
      right: lastMousePosition.x ? (x - lastMousePosition.x)/(window.innerWidth - 300) : 0,
    }
    this.props.moveTwitchisms(mousePositionDelta);
  }

  render() {

    const {twitchisms} = this.props;

    const springSettings = {
      stiffness: 60,
      damping: 15,
    };

    return (
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}} onMouseMove={this.handleMouseMove}>
        {twitchisms ? Object.values(twitchisms).map(twitchism => (
          <Motion style={{
            x: spring((twitchism.pos.x * (window.innerWidth + 300)) - 150, springSettings),
            y: spring((twitchism.pos.y * (window.innerHeight + 300)) - 150, springSettings),
          }}>
            {interpolatingStyle => (
              <div key={twitchism.word} style={{
                padding: '5px',
                fontSize: `${Math.round(twitchism.weight)}px`,
                position: 'absolute',
                top: interpolatingStyle.y,
                left: interpolatingStyle.x,
                textShadow: '0 0 5px white, 0 0 2px black',
                zIndex: Math.round(twitchism.weight),
              }}>
                {twitchism.word.toUpperCase()}
              </div>
            )}
          </Motion>
        )) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  twitchisms: getTwitchisms(state),
});

const mapDispatchToProps = {
  fetchTwitchisms,
  moveTwitchisms,
  moveMouse,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);