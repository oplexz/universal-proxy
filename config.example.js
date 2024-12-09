module.exports = {
    // Server configuration
    server: {
        port: 8888,
        host: "localhost",
    },

    // Target configuration
    target: {
        url: "https://example.com",
        basePath: "/api/cats",
        preserveBasePath: true, // if true, keeps basePath in forwarded URL
    },

    // CORS configuration
    cors: {
        enabled: true,
        options: {
            // Add specific CORS options here
            // origin: '*',
            // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            // allowedHeaders: ['Content-Type', 'Authorization']
        },
    },

    // Headers configuration
    headers: {
        // Headers to remove before forwarding
        remove: ["content-length", "content-encoding", "transfer-encoding"],
        // Additional headers to add to forwarded requests
        add: {
            // 'x-proxy-header': 'value'
        },
    },

    // Body parser configuration
    parser: {
        json: {
            enabled: true,
            options: {},
        },
        urlencoded: {
            enabled: true,
            options: {
                extended: true,
            },
        },
    },

    // Error handling configuration
    errors: {
        // Whether to log errors to console
        logging: true,
        // Custom error messages
        messages: {
            proxyError: "Proxy Error",
        },
        // Whether to include original error message in response
        exposeErrorDetails: true,
    },
};
