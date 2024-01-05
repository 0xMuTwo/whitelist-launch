import { useState, useRef, MouseEvent } from 'react';
import "../app/globals.css"
import styles from './Home.module.css';
import CountdownTimer from '../../components/CountdownTimer';
import SpringyGrid from '../../components/SpringyGrid';
import { PathPoint } from '../../components/SpringyGrid';

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [solAddressShown, setSolAddressShown] = useState(false);
  const financeDivRef = useRef<HTMLDivElement>(null);
  const targetDate = new Date(Date.UTC(2024, 0, 8, 0, 0, 0));
  const solAddress = "GLoVEXsnctnVLgLCy7r2v54QPPGdcEwf7qu62VdPo6LQ";

  const handleShowPresaleAddress = (event: MouseEvent<HTMLButtonElement>) => {
    setCollapse(true);
    setTimeout(() => {
      setSolAddressShown(true);
    }, 1000); // Assuming the collapse animation takes 1 second
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
      <div className={`${styles.container} ${collapse ? styles.collapse : ''}`}>
        {!solAddressShown && (
          <>
            <SpringyGrid onSquareComplete={handleSquareComplete} />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center text-white">
              <div ref={financeDivRef} className="mt-4">
                <div className="no-highlight">
                  <p className="text-lg font-bold ">
                    Read the Blog to Gain Access
                  </p>
                  <p className="text-opacity-70 ">
                    <code className="font-mono">We hope to see you soon.</code>
                  </p>
                  <CountdownTimer targetDate={targetDate} />
                </div>
  
                {showButton && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                    <button className="bg-white text-black p-2 rounded" onClick={handleShowPresaleAddress}>Show Pre-Sale Address</button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
  
      {solAddressShown && (
  <div className={`fixed inset-0 flex items-center justify-center w-full h-full z-20 ${styles.shiningTextContainer}`} style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
    <span className={styles.shiningText}>{solAddress}</span>
  </div>
)}
    </div>
  );
}