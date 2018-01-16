import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Close from 'material-ui/svg-icons/navigation/close';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';

import './index.css';

// symshapes.com
// progenart.com
// procgenart.com

const buttonBackgroundColor = '#FAFAFA';
const buttonLabelColor = '#333';

class SvgControls extends Component {
  render() {
    const {
      contrastPrimarySVGColor,
      primarySVGColor
    } = this.props;
    
    return (
      <MuiThemeProvider>
        <div className="concentric-js-svg-controls-container">
          <RaisedButton
            backgroundColor={primarySVGColor}
            // onClick={() => randomizeVizual()}
            label="nice"
            labelColor={contrastPrimarySVGColor}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default SvgControls;
