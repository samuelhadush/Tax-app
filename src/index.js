import React,{StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import App3 from './App3'
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );