import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import React, { Component } from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';

import {
  setRandomizeAlgorithm,
  togglePreserveAspectRatio,
  updateBackground,
  updateRenderHeight,
  updateRenderWidth,
  updateVisual
} from '../../modules/canvas';

import { VERSIONS } from '../../constants';

import { createColorString, getContrastingBinaryColor } from '../../utils/color';

import './index.css';

class SvgControls extends Component {
  handleAlgorithmChange = (event, index, value) => {
    this.props.setRandomizeAlgorithm(value);
  }

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

  render() {
    const {
      backgroundColor,
      preserveRenderAspectRatio,
      radialBackground,
      radialBackgroundColor,
      randomizeAlgorithm,
      renderHeight,
      renderWidth
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
            <MenuItem value={VERSIONS.FULL_RANDOM} primaryText="Random" />
            <MenuItem value={VERSIONS.TOPOLOGY} primaryText="Topology 💥" />
            <MenuItem value={VERSIONS.TOPOLOGY_GRADIENT_PACK} primaryText="Topology with select colors" />
            <MenuItem value={VERSIONS.TOPOLOGY_GRADIENTS} primaryText="Topology with select gradients" />
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN} primaryText="Random polygon" />
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN_BW} primaryText="Random polygon black and white" />
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN_GRADIENT_PACK} primaryText="Random polygon with select colors" />
            <MenuItem value={VERSIONS.BASIC_FIRST_GEN_GRADIENTS} primaryText="Random polygons with select gradients" />
            <MenuItem value={VERSIONS.WATER_COLOR} primaryText="Water color" style={{fontStyle: 'italic'}} />
            <MenuItem value={VERSIONS.TRIANGLES} primaryText="Triangles" />
            <MenuItem value={VERSIONS.TRIANGLES_MULTI} primaryText="Triangles 🎉🎉 - Work in progress" />
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
          <ListItem
            primaryText="Render Options"
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[
              <div
                className="concentric-js-svg-controls-list-nested-item"
                key="1"
              >
                <TextField
                  hintText="Width (px)"
                  onChange={(e, newWidth) => this.props.updateRenderWidth(newWidth)}
                  value={renderWidth}
                />
              </div>,
              <div
                className="concentric-js-svg-controls-list-nested-item"
                key="2"
              >
                <TextField
                  hintText="Height (px)"
                  onChange={(e, newHeight) => this.props.updateRenderHeight(newHeight)}
                  value={renderHeight}
                />
              </div>,
              <ListItem
                key={2}
                primaryText="Preserve Aspect Ratio"
                secondaryText="Uses initial ratio with max w/h"
                rightToggle={<Toggle
                  onToggle={this.props.togglePreserveAspectRatio}
                  toggled={preserveRenderAspectRatio}
                />}
              />
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
    preserveRenderAspectRatio: state.canvas.preserveRenderAspectRatio,
    radialBackground: layout.radialBackground,
    radialBackgroundColor: layout.radialBackgroundColor,
    randomizeAlgorithm: state.canvas.randomizeAlgorithm,
    renderHeight: state.canvas.renderHeight,
    renderWidth: state.canvas.renderWidth,
    svgRef: state.canvas.svgRef
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRandomizeAlgorithm: newAlgorithm => dispatch(setRandomizeAlgorithm(newAlgorithm)),
    togglePreserveAspectRatio: () => dispatch(togglePreserveAspectRatio()),
    updateBackground: newBackground => dispatch(updateBackground(newBackground)),
    updateRenderHeight: newHeight => dispatch(updateRenderHeight(newHeight)),
    updateRenderWidth: newWidth => dispatch(updateRenderWidth(newWidth)),
    updateVisual: change => dispatch(updateVisual(change))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgControls);
