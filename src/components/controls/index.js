import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';

import './index.css';

// symshapes.com

class Controls extends Component {
  render() {
    const {
      historyBack,
      historyForward,
      randomizeButtonBackgroundColor,
      randomizeButtonLabelColor,
      randomizeVizual
    } = this.props;
    
    return (
      <MuiThemeProvider>
        <div className="concentric-js-controls-container">
          <RaisedButton
            backgroundColor={randomizeButtonBackgroundColor}
            onClick={() => randomizeVizual()}
            label="Randomize"
            labelColor={randomizeButtonLabelColor}
          />
          <button
            onClick={() => historyBack()}
          >
            back
          </button>
          <button
            onClick={() => historyForward()}
          >
            forward
          </button>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Controls;
