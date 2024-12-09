# Universal Proxy Server

A highly configurable proxy server that can forward requests to any target URL with customizable settings.

## Features

- Configurable server port and host
- Customizable target URL and base path
- Flexible CORS settings
- Configurable header handling
- Custom error handling and logging
- Body parser configuration
- Preserved or stripped base path options

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create your configuration file:
```bash
cp config.example.js config.js
```

3. Modify config.js according to your needs. The configuration file is ignored by git, so your settings remain private.

4. Start the proxy:
```bash
node proxy.js
```

## Configuration

All configuration options are in `config.js`. Use `config.example.js` as a template:

### Server Configuration
```javascript
server: {
    port: 8888,        // Port to run the proxy server on
    host: "localhost"  // Host to bind the server to
}
```

### Target Configuration
```javascript
target: {
    url: "https://example.com",  // Target URL to proxy to
    basePath: "/api/cats",       // Base path to mount the proxy on
    preserveBasePath: true       // Whether to keep base path in forwarded URL
}
```

### CORS Configuration
```javascript
cors: {
    enabled: true,    // Enable/disable CORS
    options: {        // CORS options (see cors npm package)
        // origin: '*',
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        // allowedHeaders: ['Content-Type', 'Authorization']
    }
}
```

### Headers Configuration
```javascript
headers: {
    // Headers to remove before forwarding
    remove: ["content-length", "content-encoding", "transfer-encoding"],
    // Additional headers to add to forwarded requests
    add: {
        // 'x-proxy-header': 'value'
    }
}
```

### Body Parser Configuration
```javascript
parser: {
    json: {
        enabled: true,    // Enable JSON body parsing
        options: {}       // Options for express.json()
    },
    urlencoded: {
        enabled: true,    // Enable URL-encoded body parsing
        options: {        // Options for express.urlencoded()
            extended: true
        }
    }
}
```

### Error Handling Configuration
```javascript
errors: {
    logging: true,                    // Enable console error logging
    messages: {
        proxyError: "Proxy Error"     // Custom error message
    },
    exposeErrorDetails: true          // Include original error in response
}
```

## Example Usage

1. Basic setup with default configuration:
```bash
# Copy example config
cp config.example.js config.js

# Start the server
node proxy.js
```

2. Custom configuration example:
```javascript
// config.js
module.exports = {
    server: {
        port: 3000,
        host: "0.0.0.0"  // Allow external connections
    },
    target: {
        url: "https://api.example.com",
        basePath: "/api",
        preserveBasePath: false
    },
    cors: {
        enabled: true,
        options: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }
    // ... other configurations
};
```

## Error Handling

The proxy server includes comprehensive error handling:

- All proxy errors are caught and logged (if enabled)
- Customizable error messages
- Option to expose or hide detailed error information
- Maintains original status codes from the target server
