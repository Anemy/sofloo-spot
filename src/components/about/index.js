import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const About = props => (
  <div>
    <h1>About</h1>
    <button
      onClick={() => props.changePage()}
    >
      <i className="fa fa-home" aria-hidden="true" />
    </button>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/')
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(About);
