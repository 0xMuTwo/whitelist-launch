import { useState, useRef } from 'react';
import Image from 'next/image';
import SpringyGrid from '../../components/SpringyGrid'; // Ensure the path to this component is correct.
import "../app/globals.css"

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const financeDivRef = useRef<HTMLDivElement>(null);

  const handleSquareComplete = (square) => {
    if (!financeDivRef.current) return;
    const divRect = financeDivRef.current.getBoundingClientRect();
    console.log('Div Rect:', divRect);
    const squareBounds = {
      left: Math.min(square.startX, square.endX),
      top: Math.min(square.startY, square.endY),
      right: Math.max(square.startX, square.endX),
      bottom: Math.max(square.startY, square.endY),
    };
    const enclosesDiv = (
      squareBounds.left <= divRect.left &&
      squareBounds.top <= divRect.top &&
      squareBounds.right >= divRect.right &&
      squareBounds.bottom >= divRect.bottom
    );
    console.log('Square:', square);
    financeDivRef.current.style.border = enclosesDiv ? '2px solid green' : '2px solid red';
    setShowButton(enclosesDiv);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <SpringyGrid onSquareComplete={handleSquareComplete} />
      <div  className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center text-white">
        {/* Instructional Text */}
        <div ref={financeDivRef} className="mt-4">
          <p className="text-lg font-bold">
            Draw A Square to Gain Access
          </p>
          <p className="text-opacity-70">
            Enter <code className="font-mono">Glove Finance</code> today.
          </p>
        </div>
      </div>
      
      {/* Enter Glove Finance Button */}
      {showButton && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button className="bg-white text-black p-2 rounded">Enter Glove Finance</button>
        </div>
      )}
    </div>
  );
}