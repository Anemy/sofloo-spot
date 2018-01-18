import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import React, { Component } from 'react';
import { CompactPicker } from 'react-color';

import './index.css';

// symshapes.com
// progenart.com
// procgenart.com

const buttonBackgroundColor = '#FAFAFA';
const buttonLabelColor = '#333';

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

  render() {
    const {
      backgroundColor,
      contrastPrimarySVGColor,
      primarySVGColor,
      radialBackground,
      radialBackgroundColor
    } = this.props;

    return (
      <div className="concentric-js-svg-controls">
        <List>
          <Subheader>Controls</Subheader>
          {/* <ListItem primaryText="Some option" /> */}
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
        {/* <Divider />
        <List>
          <ListItem primaryText="Another option" />
        </List> */}
      </div>
    );
  }
}

export default SvgControls;
