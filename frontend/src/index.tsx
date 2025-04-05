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
    <BrowserRouter>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Digital Business Card</title>
        </Helmet>
        <Layout />
    </BrowserRouter >
);

reportWebVitals();
