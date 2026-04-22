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

console.log('main.jsx is executing with Forced Client ID');
console.log('Root element:', document.getElementById('root'));

try {
  const root = createRoot(document.getElementById('root'));
  console.log('Ready to render App');
  root.render(
    <Provider store={store}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>,
  )
  console.log('main.jsx render called');
} catch (error) {
  console.error('CRITICAL RENDER ERROR:', error);
}
