import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './App.tsx';

try {
  console.log("Rendering App...");
  const html = renderToString(React.createElement(App));
  console.log("Render successful!");
} catch (e) {
  console.error("React Render Error:", e);
}
