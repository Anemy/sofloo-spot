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
    showShareableLink: false,
    showSVGCode: false,
    showSVGControls: false,
    svgCode: 'The svg has not yet loaded or an error has occured.'
  };

  showLinkPopup() {
    const { shareableString } = this.props;

    return (
      <div className="concentric-js-svg-popup-container">
        <div
          className="concentric-js-svg-popup-background"
          onClick={() => this.toggleShowLink()}
        />
        <div className="concentric-js-svg-popup-modal">
          <div className="concentric-js-svg-popup-top-area">
            <h2>
              {shareableString}
            </h2>
            <IconButton
              className="concentric-js-svg-popup-close-button"
              onClick={() => this.toggleShowLink()}
            >
              <Close style={{fill: buttonLabelColor}} />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="concentric-js-svg-popup-top-title">
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

  toggleShowLink = () => {
    this.setState({
      showShareableLink: !this.state.showShareableLink
    });
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

    const {
      showShareableLink,
      showSVGCode,
      showSVGControls
    } = this.state;
    
    return (
      <MuiThemeProvider>
        <div
          className={'concentric-js-controls-container' + (showSVGControls ? ' concentric-js-controls-container-active' : '')}
        >
          {showSVGCode && this.showSVGCodePopup()}
          {showShareableLink && this.showLinkPopup()}
          <a
            className="concentric-js-controls-github-link"
            href="https://github.com/Anemy/concentric"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg aria-labelledby="simpleicons-github-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-github-icon">GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
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
          <RaisedButton
            backgroundColor={buttonBackgroundColor}
            className="concentric-js-show-link-button"
            onClick={() => this.toggleShowLink()}
            label="Get Shareable Link"
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
