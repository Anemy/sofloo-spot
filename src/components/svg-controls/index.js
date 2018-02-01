import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';

import {
  updateBackground,
  updateVisual,
  setRandomizeAlgorithm
} from '../../modules/canvas';

import { VERSIONS } from '../../constants';

import { createColorString, getContrastingBinaryColor } from '../../utils/color';

import './index.css';

// symshapes.com
// progenart.com
// procgenart.com

// const buttonBackgroundColor = '#FAFAFA';
// const buttonLabelColor = '#333';

class SvgControls extends Component {
  setBackgroundColor = color => {
    this.props.updateBackground({
      backgroundColor: color.hex
    });
  }
  
  setRadialBackgroundColor = color => {
    this.props.updateBackground({
      radialBackgroundColor: color.hex
    });
  }

  toggleRadialBackground = () => {
    this.props.updateBackground({
      radialBackground: !this.props.radialBackground
    });
  }

  handleAlgorithmChange = (event, index, value) => {
    this.props.setRandomizeAlgorithm(value);
  }

  render() {
    const {
      backgroundColor,
      radialBackground,
      radialBackgroundColor,
      randomizeAlgorithm
    } = this.props;

    return (
      <div className="concentric-js-svg-controls">
        <List>
          <div className="concentric-js-svg-controls-about">
            <div className="concentric-js-svg-controls-about-desc">
              Coded by <a
                href="http://rhyshowell.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rhys
              </a>
            </div>
          </div>
          <Divider />
          <Subheader
            className="concentric-js-svg-controls-subheader"
          >Controls</Subheader>
          <SelectField
            className="concentric-js-svg-controls-algorithm"
            floatingLabelText="Randomize Algorithm"
            onChange={this.handleAlgorithmChange}
            selectedMenuItemStyle={{
              color: '#3498db'
            }}
            value={randomizeAlgorithm}
          >
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN} primaryText="Full random" />
            <MenuItem value={VERSIONS.TOPOLOGY} primaryText="Topology" />
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN_BW} primaryText="Random black and white" />
            <MenuItem value={VERSIONS.INIT_FIRST_GEN} primaryText="Initial" />
          </SelectField>
          <ListItem
            primaryText="Background"
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[
              <div
                className="concentric-js-svg-controls-list-nested-item"
                key={1}
              >
                <CompactPicker
                  color={backgroundColor}
                  onChange={this.setBackgroundColor}
                />
              </div>,
              <ListItem
                key={2}
                primaryText="Radial Background"
                rightToggle={<Toggle
                  onToggle={this.toggleRadialBackground}
                  toggled={radialBackground}
                />}
              />,
              <div
                className="concentric-js-svg-controls-list-nested-item"
                key={3}
              >
                <CompactPicker
                  color={radialBackgroundColor}
                  onChange={this.setRadialBackgroundColor}
                />
              </div>
            ]}
          />
        </List>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const layout = state.canvas.present;

  const shape = layout.shapes[0];

  const shapeOuterColor = shape.colors[shape.colors.length - 1];

  return {
    backgroundColor: layout.backgroundColor,
    primarySVGColor: createColorString(shapeOuterColor),
    contrastPrimarySVGColor: getContrastingBinaryColor(shapeOuterColor),
    radialBackground: layout.radialBackground,
    radialBackgroundColor: layout.radialBackgroundColor,
    randomizeAlgorithm: state.canvas.randomizeAlgorithm,
    svgRef: state.canvas.svgRef
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRandomizeAlgorithm: newAlgorithm => dispatch(setRandomizeAlgorithm(newAlgorithm)),
    updateBackground: newBackground => dispatch(updateBackground(newBackground)),
    updateVisual: change => dispatch(updateVisual(change))
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SvgControls);
