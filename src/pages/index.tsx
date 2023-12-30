import Image from 'next/image';
import SpringyGrid from '../../components/SpringyGrid';
import "../app/globals.css"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <SpringyGrid />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center text-white">
        {/* Logo */}
        <div className="w-45 h-9 relative mb-8">
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            fill
            sizes="100vw"
            priority
          />
        </div>

        {/* Text Section - This section is moved below the logo */}
        <div className="mt-4"> {/* Pushing text below the logo */}
          <p className="text-lg font-bold">
            Welcome to the Next.js Project
          </p>
          <p className="text-opacity-70">
            Edit <code className="font-mono">pages/index.tsx</code> to get started
          </p>
        </div>
      </div>
    </div>
  );
}