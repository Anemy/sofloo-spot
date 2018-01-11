import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';

import { createColorString, createRandomColor, getContrastingBinaryColor } from '../../utils';

import './index.css';

// symshapes.com

class Controls extends Component {
  state = {
    randomizeButtonBackgroundColor: {
      r: 0,
      g: 188,
      b: 212
    },
    randomizeButtonLabelColor: 'white'
  };

  randomizeClicked = () => {
    const newButtonColor = createRandomColor();

    this.setState({
      randomizeButtonBackgroundColor: newButtonColor,
      randomizeButtonLabelColor: getContrastingBinaryColor(newButtonColor)
    });

    this.props.randomizeVizual();
  }

  render() {
    const {
      randomizeButtonBackgroundColor,
      randomizeButtonLabelColor
    } = this.state;

    console.log('state', this.state);
    
    return (
      <MuiThemeProvider>
        <div className="concentric-js-controls-container">
          <RaisedButton
            backgroundColor={createColorString(randomizeButtonBackgroundColor)}
            onClick={() => this.randomizeClicked()}
            label="Randomize"
            labelColor={randomizeButtonLabelColor}
            overrides={true}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Controls;
