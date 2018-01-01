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

    const centerX = 200;
    const centerY = 200;

    const stepLength = 100;

    console.log('Drawing a circle centered at', centerX, centerY);
    console.log('With a radius of', stepLength * steps);
    console.log('In an array the size of', width, height);

    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

    // TODO: Precompute so we can smooth.
    // TODO: Allow not to smooth.

    // This is recursive to allow the previous layers to influence?

    const drawBeziersOfCircleRecursively = (x, y, step) => {
      ctx.beginPath();

      // Start from a zero degree point.
      // TODO: Add rotation.
      const distanceFromCenter = 100; // (step / steps) * stepLength;
      ctx.moveTo(x + distanceFromCenter, y);

      // (4/3)*tan(pi/(2n)) = 0.5xxx
      // (4 / 3) * Math.tan(Math.PI/(2 * n));

      for (let i = 0; i < points; i++) {
        // TODO: Use translate for relative center positioning.

        const startAngle = (i === 0) ? 0 : (2 * Math.PI * (i / points));
        const stopAngle = 2 * Math.PI * ((i + 1) / points);

        const alpha = (stopAngle - startAngle) / 2;

        const cosAlpha = Math.cos(alpha);
        const sinAlpha = Math.sin(alpha);
        const cotAlpha = 1 / Math.tan(alpha);

        const phi = startAngle + alpha;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        const lambda = (4 - cosAlpha) / 3;
        const mu = (sinAlpha + (cosAlpha - lambda)) * cotAlpha;

        const cp1x = x + (((lambda * cosPhi) + (mu * sinPhi)) * distanceFromCenter);
        const cp1y = y + (((lambda * sinPhi) - (mu * cosPhi)) * distanceFromCenter);
      
        const cp2x = x + (((lambda * cosPhi) - (mu * sinPhi)) * distanceFromCenter);
        const cp2y = y + (((lambda * sinPhi) + (mu * cosPhi)) * distanceFromCenter);
        
        // ALPHA = (stopAngle - startAngle) ./ 2;
        // COS_ALPHA = cos(ALPHA);
        // SIN_ALPHA = sin(ALPHA);
        // COT_ALPHA = 1 ./ tan(ALPHA);
        // PHI = startAngle + ALPHA;
        // COS_PHI = cos(PHI);
        // SIN_PHI = sin(PHI);
        // LAMBDA = (4 - COS_ALPHA) ./ 3;
        // MU = SIN_ALPHA + (COS_ALPHA - LAMBDA) .* COT_ALPHA;

        // bezier = zeros(4,2);
        // bezier(1,1) = cos(startAngle);
        // bezier(1,2) = sin(startAngle);
        // bezier(2,1) = LAMBDA .* COS_PHI + MU .* SIN_PHI;
        // bezier(2,2) = LAMBDA .* SIN_PHI - MU .* COS_PHI;
        // bezier(3,1) = LAMBDA .* COS_PHI - MU .* SIN_PHI;
        // bezier(3,2) = LAMBDA .* SIN_PHI + MU .* COS_PHI;
        // bezier(4,1) = cos(stopAngle);
        // bezier(4,2) = sin(stopAngle);

        // Generate the control points for the bezier curve.
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo
        
        
        // const cp1Angle = 4 - currentAngle;
        // (4 / 3) * Math.tan(Math.PI/(2 * (i / points)));
        // const cp1x = x + (((4 - Math.cos(cp1Angle))/3) * distanceFromCenter);
        // const cp1y = y + (Math.sin(cp1Angle) * distanceFromCenter);
      
        // // const cp2Angle = (4 / 3) * Math.tan(Math.PI/(2 * (i / points)));
        // // const cp2Angle = (i === points - 1) ? 0 : (2 * Math.PI * ((i + 1) / points));
        // const cp2x = x + (((4 - Math.cos(cp2Angle))/3) * distanceFromCenter);
        // const cp2y = y + (Math.sin(cp2Angle) * distanceFromCenter);
        
        
        const endx = x + (Math.cos(stopAngle) * distanceFromCenter);
        const endy = y + (Math.sin(stopAngle) * distanceFromCenter);

        ctx.fillStyle = 'green';
        ctx.fillRect(endx - 3, endy - 3, 6, 6);

        ctx.fillStyle = 'blue';
        ctx.fillRect(cp1x - 3, cp1y - 3, 6, 6);
        ctx.fillRect(cp2x - 3, cp2y - 3, 6, 6);

        console.log(i, points, 'Start angle:', Math.floor(startAngle * (180 / Math.PI)));
        console.log(i, 'End angle:', Math.floor(stopAngle * (180 / Math.PI)));

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
        // console.log('Position:', cp2x, cp2y);
      }

      const r = 0; // red
      const g = 0; // green
      const b = 255;// * (step / steps); // blue
      const a = 255; // alpha

      ctx.closePath();
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'green';
      // ctx.stroke();
      // TODO: Add shadow.

      ctx.fillStyle = 'orange';
      ctx.fillRect(x - 3, y - 3, 6, 6);
    };

    drawBeziersOfCircleRecursively(centerX, centerY, 0);
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
