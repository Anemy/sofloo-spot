import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Close from 'material-ui/svg-icons/navigation/close';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';

import './index.css';

import SvgControls from '../../containers/svg-controls';

// symshapes.com
// progenart.com
// procgenart.com

const buttonBackgroundColor = '#FAFAFA';
const buttonLabelColor = '#333';

class Controls extends Component {
  state = {
    showSVGCode: false,
    showSVGControls: false,
    svgCode: 'The svg has not yet loaded or an error has occured.'
  };

  showSVGCodePopup() {
    const { svgCode } = this.state;

    return (
      <div className="concentric-js-svg-popup-container">
        <div
          className="concentric-js-svg-popup-background"
          onClick={() => this.toggleShowSVGCode()}
        />
        <div className="concentric-js-svg-popup-modal">
          <div className="concentric-js-svg-popup-top-area">
            <h2>
              SVG Code
            </h2>
            <IconButton
              className="concentric-js-svg-popup-close-button"
              onClick={() => this.toggleShowSVGCode()}
            >
              <Close style={{fill: buttonLabelColor}} />
            </IconButton>
          </div>
          <div className="concentric-js-svg-popup-body">
            <textarea
              className="concentric-js-svg-popup-textarea"
              defaultValue={svgCode}
            />
          </div>
        </div>
      </div>
    );
  }

  toggleShowSVGCode = () => {
    const newState = {
      showSVGCode: !this.state.showSVGCode
    };

    if (!this.state.showSVGCode) {
      newState.svgCode = this.props.svgRef.outerHTML;
    }

    this.setState(newState);
  }

  toggleShowSVGControls = () => {
    this.setState({
      showSVGControls: !this.state.showSVGControls
    });
  }

  render() {
    const {
      historyBack,
      historyForward,
      randomizeButtonBackgroundColor,
      randomizeButtonLabelColor,
      randomizeVizual
    } = this.props;

    const { showSVGCode, showSVGControls } = this.state;
    
    return (
      <MuiThemeProvider>
        <div
          className={'concentric-js-controls-container' + (showSVGControls ? ' concentric-js-controls-container-active' : '')}
        >
          {showSVGCode && this.showSVGCodePopup()}
          <div>
            <FloatingActionButton
              backgroundColor={buttonBackgroundColor}
              mini
              onClick={() => this.toggleShowSVGControls()}
            >
              <MenuIcon style={{fill: buttonLabelColor}} />
            </FloatingActionButton>
          </div>
          <RaisedButton
            className="concentric-js-controls-randomize-button"
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
          <RaisedButton
            backgroundColor={buttonBackgroundColor}
            className="concentric-js-show-svg-code-button"
            onClick={() => this.toggleShowSVGCode()}
            label="Show Svg Code"
            labelColor={buttonLabelColor}
          />
          {showSVGControls && 
            <div className="concentric-js-svg-controls-container">
              <SvgControls />
            </div>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Controls;
