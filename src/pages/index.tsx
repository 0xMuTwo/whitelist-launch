import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import CountdownTimer from '../../components/CountdownTimer';
import SpringyGrid from '../../components/SpringyGrid'; // Ensure the path to this component is correct.
import "../app/globals.css"
import { PathPoint } from '../../components/SpringyGrid';

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const financeDivRef = useRef<HTMLDivElement>(null);
  const targetDate = new Date('2024-01-03T00:00:00');

  const enterGloveButton = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('Glove Finance button clicked');
  };

  const handleSquareComplete = (path: PathPoint[]) => {
    if (showButton) return;
    if (!financeDivRef.current) return;
  
    const divRect = financeDivRef.current.getBoundingClientRect();
  
    // Check if a specific point is inside the user-drawn closed path
    const isPointInsidePath = (point: { x: number; y: number }): boolean => {
      let isInside = false;
      for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
        const xi = path[i].x, yi = path[i].y;
        const xj = path[j].x, yj = path[j].y;
  
        const intersect = ((yi > point.y) != (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
      }
      return isInside;
    };
  
    // We need to check all 4 corners of the div
    const corners = [
      { x: divRect.left, y: divRect.top },
      { x: divRect.right, y: divRect.top },
      { x: divRect.right, y: divRect.bottom },
      { x: divRect.left, y: divRect.bottom },
    ];
  
    // Adding a heuristic check to ensure all corners of the div are within the closed path
    const enclosesDiv = corners.every(corner => isPointInsidePath(corner));
  
    setShowButton(enclosesDiv);
  };
  

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <SpringyGrid onSquareComplete={handleSquareComplete} />
      <div  className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center text-white">
        <div ref={financeDivRef} className="mt-4">
          <p className="text-lg font-bold">
            Read the Blog to Gain Access
          </p>
          <p className="text-opacity-70">
            <code className="font-mono">We hope to see you soon.</code>
          </p>
          <CountdownTimer targetDate={targetDate} />
          {showButton && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <button className="bg-white text-black p-2 rounded" onClick={enterGloveButton}>Enter Glove Finance</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}