import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { preloadImages } from './lib/performance';

// Ensure page is visible immediately
if (document.body) {
  document.body.style.visibility = 'visible'
  document.body.style.opacity = '1'
}

// Preload critical images for performance
const criticalImages = [
  'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// Preload images safely
if (typeof window !== 'undefined') {
  preloadImages(criticalImages).catch(console.warn);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
