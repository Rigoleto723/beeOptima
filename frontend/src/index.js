import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SessionProvider } from './context/sessionContext'
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from 'react-hot-toast'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SessionProvider>
          <App />
      </SessionProvider>
    </ThemeProvider>
    <Toaster />
  </React.StrictMode>
);
