/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? '/api' // development api
            : '/api' // production api
    },
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true,
    }
}

module.exports = nextConfig