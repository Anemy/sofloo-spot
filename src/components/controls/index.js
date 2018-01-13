import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';

import './index.css';

// symshapes.com

const buttonBackgroundColor = '#FAFAFA';
const buttonLabelColor = '#333';

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
          <div className="concentric-js-controls-history">
            <FloatingActionButton
              backgroundColor={buttonBackgroundColor}
              mini
              onClick={() => historyBack()}
            >
              <ArrowBack style={{fill: buttonLabelColor}} />
            </FloatingActionButton>
            <FloatingActionButton
              backgroundColor={buttonBackgroundColor}
              className="concentric-js-history-forward-button"
              mini
              onClick={() => historyForward()}
            >
              <ArrowForward style={{fill: buttonLabelColor}} />
            </FloatingActionButton>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Controls;
