import 'inset.js'

import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

import { buildBezierControlPointsForCircleAt } from '../../utils';

// https://codepen.io/netsi1964/pen/ZYpNMz/

// TODO: https://tympanus.net/Development/CreativeGooeyEffects/send.html

class Canvas extends Component {
  componentDidMount() {
    this.drawCanvas();
  }
  
  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas() {
    console.log('Starting to draw canvas...');
    const ctx = this.canvasRef.getContext('2d');

    this.drawCircle(ctx);

    console.log('Done drawing canvas.');
  }

  drawCircle(ctx) {
    const {
      height,
      points,
      shadowBlur,
      shadowColor,
      shadowInset,
      shadowOffsetX,
      shadowOffsetY,
      steps,
      width
    } = this.props;

    const centerX = 300;
    const centerY = 300;

    const stepLength = 30;

    // TODO: Precompute so we can smooth.
    // TODO: Allow not to smooth.

    // TODO: Polygon vs circle

    // TODO: Add rotation.

    // This is recursive to allow the previous layers to influence?

    // const interiorShape

    const drawBeziersOfCircleRecursively = (x, y, step) => {
      const radius = (step + 1) * stepLength;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);

      for (let i = 0; i < points; i++) {
        const startAngle = (i === 0) ? 0 : (2 * Math.PI * (i / points));
        const stopAngle = 2 * Math.PI * ((i + 1) / points);

        const startx = x + (Math.cos(startAngle) * radius);
        const starty = y + (Math.sin(startAngle) * radius);

        const stopx = x + (Math.cos(stopAngle) * radius);
        const stopy = y + (Math.sin(stopAngle) * radius);

        const cp = buildBezierControlPointsForCircleAt(x, y, radius, startx, starty, stopx, stopy);

        ctx.bezierCurveTo(cp[0].x, cp[0].y, cp[1].x, cp[1].y, stopx, stopy);
      }

      const r = 30; // 255 - Math.floor(255 * (step / steps)); // red
      const g = 255 - Math.floor(255 * (step / steps)); // green
      const b = Math.floor(255 * (step / steps)); // blue
      const a = 1; // 1 - (step / steps); // alpha

      ctx.closePath();
      
      const color = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fillStyle = color;

      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
      ctx.shadowInset = shadowInset;

      ctx.fill();
    };

    for (let i = steps-1; i >= 0; i--) {
      drawBeziersOfCircleRecursively(centerX, centerY, i);
    }
  }

  render() {
    const {
      height,
      width
    } = this.props;

    return (
      <canvas
        className="canvas"
        height={height}
        ref={ref => {this.canvasRef = ref;}}
        width={width}
      />
    );
  }
};

export default Canvas;
