/**
 * Material UI
 */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout'
import {RouteGuard} from '../components/RouteGuard'
import theme from '../services/theme'
import './styles.css'


export default function Ticketing(props) {
    const { Component, pageProps } = props;
    
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Ticketing</title>
                <meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=0, maximum-scale=1, minimum-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700;900&display=swap" rel="stylesheet"></link>
                <link rel="shortcut icon" href="/logo.svg"></link>
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <style jsx global>{`
                    body {
                        background: "darkslategray";
                    }
                    `}</style>
                <Layout> 
                    <RouteGuard>
                        <Component {...pageProps} />
                    </RouteGuard>
                </Layout>
            </ThemeProvider>
        </React.Fragment>
    );
}

Ticketing.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};