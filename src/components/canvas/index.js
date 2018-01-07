import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

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
      steps,
      width
    } = this.props;

    const centerX = 300;
    const centerY = 300;

    const stepLength = 30;

    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

    // TODO: Precompute so we can smooth.
    // TODO: Allow not to smooth.

    // TODO: Polygon vs circle

    // TODO: Add rotation.

    // This is recursive to allow the previous layers to influence?

    const drawBeziersOfCircleRecursively = (x, y, step) => {
      const radius = (step + 1) * stepLength;

      // ctx.beginPath();
      // ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = '#EDEDED';
      // ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + radius, y);

      for (let i = 0; i < points; i++) {
        // TODO: Use translate for relative center positioning.

        // Visual to help understand bezier curves:
        // https://doc.babylonjs.com/how_to/how_to_use_curve3

        // https://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve#Approximating_circular_arcs

        // https://math.stackexchange.com/questions/873224/calculate-control-points-of-cubic-bezier-curve-approximating-a-part-of-a-circle

        const toDeg = angle => angle * (180/Math.PI);

        const startAngle = (i === 0) ? 0 : (2 * Math.PI * (i / points));
        const stopAngle = 2 * Math.PI * ((i + 1) / points);

        // console.log('start, stop angles', toDeg(startAngle), toDeg(stopAngle));

        const circleOffset = startAngle > stopAngle ? (Math.PI * 2) : 0;
        const halfOfAngle = Math.abs(circleOffset + (stopAngle - startAngle)) / 2;

        // console.log('difference:', toDeg(halfOfAngle) * 2);

        const otherR = radius;
        const normalizedP1X = otherR * Math.cos(halfOfAngle);
        const normalizedP1Y = otherR * Math.sin(halfOfAngle);

        // console.log('zeroed points:', normalizedP1X, normalizedP1Y);

        const zeroedCP1X = (4 * otherR - normalizedP1X) / 3;
        const zeroedCP1Y = -((1 * otherR - normalizedP1X) * (3 * otherR - normalizedP1X)) / (3 * normalizedP1Y);

        const zeroedCP2X = zeroedCP1X;
        const zeroedCP2Y = -zeroedCP1Y;

        // Rotate the control points to their offset.
        let cp1xAngle = Math.atan2(zeroedCP1Y, zeroedCP1X);
        let cp2xAngle = Math.atan2(zeroedCP2Y, zeroedCP2X);

        if (zeroedCP1X < 0) {
          cp1xAngle = -cp1xAngle + Math.PI;
        }

        if (zeroedCP2X < 0) {
          cp2xAngle = -cp2xAngle + Math.PI;
        }

        cp1xAngle += (2 * Math.PI * (i / points)) + halfOfAngle;
        cp2xAngle += (2 * Math.PI * (i / points)) + halfOfAngle;

        const controlPointDistance = Math.sqrt(zeroedCP1X*zeroedCP1X + zeroedCP1Y*zeroedCP1Y) + Math.random() * (10 * (step + 1 / steps));

        const cp1x = x + Math.cos(cp1xAngle) * controlPointDistance;
        const cp1y = y + Math.sin(cp1xAngle) * controlPointDistance;

        const cp2x = x + Math.cos(cp2xAngle) * controlPointDistance;
        const cp2y = y + Math.sin(cp2xAngle) * controlPointDistance;

        const stopx = x + (Math.cos(stopAngle) * radius);
        const stopy = y + (Math.sin(stopAngle) * radius);

        // if (i === 0) {
        //   ctx.fillStyle = 'black';
        //   ctx.fillRect(stopx - 3, stopy - 3, 8, 4);

        //   const startx = x + Math.cos(startAngle) * radius;
        //   const starty = y + Math.sin(startAngle) * radius;

        //   ctx.fillStyle = 'black';
        //   ctx.fillRect(startx - 3, starty - 3, 4, 8);

        //   ctx.fillStyle = 'blue';
        //   ctx.fillRect(cp1x - 3, cp1y - 3, 10, 6);
        //   ctx.fillStyle = 'purple';
        //   ctx.fillRect(cp2x - 3, cp2y - 3, 6, 10);
        // }

        // console.log('Start angle:', Math.floor(startAngle * (180 / Math.PI)));
        // console.log('End angle:', Math.floor(stopAngle * (180 / Math.PI)));

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, stopx, stopy);
        // console.log('Position:', cp2x, cp2y);
      }

      const r = 30; // 255 - Math.floor(255 * (step / steps)); // red
      const g = 255 - Math.floor(255 * (step / steps)); // green
      const b = Math.floor(255 * (step / steps)); // blue
      const a = 1 - (step / steps); // alpha

      ctx.closePath();

      // ctx.globalCompositeOperation='source-atop';
      
      const color = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fillStyle = color;
      // console.log('step:', step,'color:', color);
      ctx.shadowColor = 'black'; // '#999';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 15;
      ctx.shadowOffsetY = 15;

      // ctx.globalCompositeOperation='source-over';

      ctx.fill();


      // Creating the shadow:
      // invert alpha channel
      // ctx.globalCompositeOperation = 'xor';
      // ctx.fillRect(0, 0, c.width, c.height);


      // ctx.lineWidth = 2;
      // ctx.strokeStyle = 'purple';
      // ctx.stroke();
      // TODO: Add shadow.

      // ctx.fillStyle = 'orange';
      // ctx.fillRect(x - 3, y - 3, 6, 6);
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
