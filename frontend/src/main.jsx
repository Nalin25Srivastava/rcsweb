import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { ThemeProvider } from './context/ThemeContext.jsx'

const GOOGLE_CLIENT_ID = '356758659495-kpjkl2irajdr94o0i3pg2f7k1r44ge89.apps.googleusercontent.com';

// Simple Global Initialization for Native GSI
window.initGoogleGSI = () => {
  if (window.google) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        // This will be caught by components listening for this event
        window.dispatchEvent(new CustomEvent('google-auth-success', { detail: response }));
      }
    });
  } else {
    setTimeout(window.initGoogleGSI, 100);
  }
};
window.initGoogleGSI();

const root = createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </GoogleOAuthProvider>,
)
