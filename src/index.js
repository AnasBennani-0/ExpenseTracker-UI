import React from 'react';
import ReactDOM from 'react-dom/client';
// Ensure this points to the file containing your OKLCH variables
import './index.css'; 
import App from './ExpenseTracker/App'
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from "./components/theme-provider";
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './ExpenseTracker/store/store';
axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Accept'] = 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<ThemeProvider defaultTheme="light">
  <Provider store={store}>
  <App />
  </Provider>
</ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();