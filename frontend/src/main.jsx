import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = '356758659495-kpjkl2irajdr94o0i3pg2f7k1r44ge89.apps.googleusercontent.com';

// GLOBAL CALLBACK FOR NATIVE GOOGLE SDK
window.googleLoginCallback = (response) => {
  console.log('Global Google Callback Hit!', response);
  // We'll use a custom event to pass this to the components
  window.dispatchEvent(new CustomEvent('google-auth-success', { detail: response }));
};

// INITIALIZE GOOGLE SDK GLOBALLY
const initGoogleSDK = () => {
  if (window.google) {
    console.log('Initializing Google SDK Globally...');
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (window.googleLoginCallback) {
          window.googleLoginCallback(response);
        }
      },
      ux_mode: "popup"
    });
  } else {
    setTimeout(initGoogleSDK, 100);
  }
};
initGoogleSDK();

console.log('main.jsx is executing with Forced Client ID');
console.log('Root element:', document.getElementById('root'));

try {
  const root = createRoot(document.getElementById('root'));
  console.log('Ready to render App');
  root.render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>,
  )
  console.log('main.jsx render called');
} catch (error) {
  console.error('CRITICAL RENDER ERROR:', error);
}
