import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './components/layout/layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import interceptors from './utils/interceptors';
import { Helmet } from 'react-helmet';

interceptors.create();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <div dir='rtl'>
        <BrowserRouter>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Digital Business Card</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
            </Helmet>
            <Layout />
        </BrowserRouter >
    </div>
);

reportWebVitals();
