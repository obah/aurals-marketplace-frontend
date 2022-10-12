/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    webpack5: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = { fs: false };
        }
        return config;
    },

    experimental: {
        images: {
            unoptimized: true,
        },
    },
};

module.exports = nextConfig;
