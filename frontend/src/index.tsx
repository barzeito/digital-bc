import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './components/layout/layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import interceptors from './utils/interceptors';
import { Helmet } from 'react-helmet';
import TokenWatcher from './utils/tokerWatcher';
import axios from 'axios';

// Set up interceptors
interceptors.create();

// Create root
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'production') {
    console.log = () => { };
    console.debug = () => { };
    console.warn = () => { };
    console.info = () => { };
    console.error = () => { };
}

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

root.render(
    <div dir='rtl'>
        <BrowserRouter>
            <TokenWatcher />
            <Helmet>
                <meta charSet="utf-8" />
                <title>Digital Business Card</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
            </Helmet>
            <Layout />
        </BrowserRouter>
    </div>
);

if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'production') {
    reportWebVitals(() => { });
} else {
    reportWebVitals();
}