import '../styles/globals.css';
import type { AppProps } from 'next/app';
import DynamicBackground from '../../../components/DynamicBackground';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DynamicBackground />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
