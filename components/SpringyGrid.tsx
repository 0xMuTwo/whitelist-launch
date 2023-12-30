import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState, VFC } from 'react';

// Next.js does not support SSR for packages that require window, so dynamic import is used to disable SSR.
const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const N = 25;
const SP = 20;
const DT = 0.1;
const EPS = 0.00000001;
const DAMPING = 0.95;
const DELTA = 40;
const KGrid = 10.0;
const KClick = 15.0;

const BACKGROUND_COLOR = '#000000'; // Black background
const LINE_COLOR = '#FFFFFF'; // White lines
const LINE_OPACITY = 125; // Opacity from 0 (transparent) to 255 (opaque)
const LINE_WEIGHT = 2; // Thickness of the line

class Dot {
  constructor(p5: any[], i: number, j: number, width: number, height: number) {
    this.vx = 0;
    this.vy = 0;
    this.x = p5.map(i, 0, N-1, SP, width-SP);
    this.y = p5.map(j, 0, N-1, SP, height-SP);
    this.x0 = this.x;
    this.y0 = this.y;
  }

  update(p5, mouseX, mouseY, mouseIsPressed) {
    let d = p5.dist(mouseX, mouseY, this.x, this.y);
    let intensity = KClick * Math.exp(-d * d / (DELTA * DELTA));

    let res = p5.createVector(0, 0);
    if (mouseIsPressed) {
      res.add(springForce(mouseX, mouseY, this.x, this.y, intensity, p5));
    }
    res.add(springForce(this.x0, this.y0, this.x, this.y, KGrid, p5));

    this.vx += DT * res.x;
    this.vy += DT * res.y;

    this.vx *= DAMPING;
    this.vy *= DAMPING;

    this.x += DT * this.vx;
    this.y += DT * this.vy;
  }
}

const springForce = (ax, ay, bx, by, k, p5) => {
  let xx = ax - bx;
  let yy = ay - by;
  
  let d = p5.dist(xx, yy, 0, 0);
  if (d < EPS) d = EPS; // prevent division by zero
  let nx = xx / d;
  let ny = yy / d;
  
  let f = k * d;
  
  return p5.createVector(f * nx, f * ny);
};

const SpringyGrid: VFC = () => {
  const [array, setArray] = useState([]);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    console.log('Canvas size:', p5.windowWidth, p5.windowHeight);
    p5.background(BACKGROUND_COLOR);

    const arr = new Array(N).fill(null).map((_, i) => 
      new Array(N).fill(null).map((_, j) =>
        new Dot(p5, i, j, p5.width, p5.height)
      )
    );

    setArray(arr);
  };

  const draw = (p5) => {
    p5.background(BACKGROUND_COLOR);

    array.forEach(column => column.forEach(dot => dot.update(p5, p5.mouseX, p5.mouseY, p5.mouseIsPressed)));

    for (let i = 0; i < N - 1; i++) {
      for (let j = 0; j < N - 1; j++) {
        let d1 = array[i][j];
        let d2 = array[i + 1][j];
        let d3 = array[i][j + 1];
        drawConnection(d1, d2, p5);
        drawConnection(d1, d3, p5);
      }
    }
    
    for (let i = 0; i < N - 1; i++) {
      let d1 = array[N - 1][i];
      let d2 = array[N - 1][i + 1];
      let d3 = array[i][N - 1];
      let d4 = array[i + 1][N - 1];
      drawConnection(d1, d2, p5);
      drawConnection(d3, d4, p5);
    }
  };

  const drawConnection = (d1, d2, p5) => {
    p5.stroke(LINE_COLOR + LINE_OPACITY.toString(16)); // Combine color and opacity
    p5.strokeWeight(LINE_WEIGHT);
    p5.line(d1.x, d1.y, d2.x, d2.y);
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  
    const newArray = new Array(N).fill(null).map((_, i) =>
      new Array(N).fill(null).map((_, j) =>
        new Dot(p5, i, j, p5.windowWidth, p5.windowHeight)
      )
    );
  
    setArray(newArray);
  };

  return (
    <div className="w-full h-full">
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        className="w-full h-full"
      />
    </div>
  );
};

export default SpringyGrid;