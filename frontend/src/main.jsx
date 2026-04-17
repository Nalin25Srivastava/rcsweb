import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '356758659495-kpjkl2irajdr94o0i3pg2f7k1r44ge89.apps.googleusercontent.com';

console.log('main.jsx is executing');
console.log('Root element:', document.getElementById('root'));

try {
  const root = createRoot(document.getElementById('root'));
  console.log('Ready to render App');
  root.render(
    <StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </StrictMode>,
  )
  console.log('main.jsx render called');
} catch (error) {
  console.error('CRITICAL RENDER ERROR:', error);
}
