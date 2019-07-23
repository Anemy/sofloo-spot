import React, { Component } from 'react';
import { connect } from 'react-redux';

// import './index.css';

// import Controls from '../controls';
import Loader from '../loader';
import SVG from '../svg';

import {
  setStreamSofloo
} from '../../modules/canvas';

class Stream extends Component {
  componentWillMount() {
    this.props.setStreamSofloo();

    setInterval(() => {
      this.props.setStreamSofloo();
    }, 12000);
  }

  render() {
    const props = this.props;

    return (
      <div
        className="concentric-js-home"
        style={props.radialBackground ? {
          background: `radial-gradient(${props.radialBackgroundColor}, ${props.backgroundColor})`
        } : { backgroundColor: props.backgroundColor }}
      >
        <SVG />
        {props.isBuilding && <Loader />}
        {/* <Controls /> */}
      </div>
    );
  }
};

const mapStateToProps = state => ({
  backgroundColor: state.canvas.present.backgroundColor,
  isBuilding: state.canvas.isBuilding,
  radialBackground: state.canvas.present.radialBackground,
  radialBackgroundColor: state.canvas.present.radialBackgroundColor
});

const mapDispatchToProps = dispatch => ({
  setStreamSofloo: () => dispatch(setStreamSofloo())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stream);
