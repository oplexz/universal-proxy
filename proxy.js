const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Check if config exists
const configPath = path.join(__dirname, "config.js");
if (!fs.existsSync(configPath)) {
    console.error("\n=== Configuration Error ===");
    console.error("config.js not found!");
    console.error(
        "Please copy config.example.js to config.js and modify it according to your needs."
    );
    console.error("You can do this by running:");
    console.error("cp config.example.js config.js\n");
    process.exit(1);
}

const config = require("./config");

const app = express();

if (config.cors.enabled) {
    app.use(cors(config.cors.options));
}

if (config.parser.json.enabled) {
    app.use(express.json(config.parser.json.options));
}

if (config.parser.urlencoded.enabled) {
    app.use(express.urlencoded(config.parser.urlencoded.options));
}

app.use(config.target.basePath, async (req, res) => {
    try {
        const targetPath = config.target.preserveBasePath
            ? `${config.target.basePath}${req.url}`
            : req.url;
        const url = `${config.target.url}${targetPath}`;

        const headers = {
            ...req.headers,
            host: new URL(config.target.url).host,
            ...config.headers.add,
        };

        config.headers.remove.forEach((header) => {
            delete headers[header.toLowerCase()];
        });

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: headers,
            validateStatus: false,
        });

        res.status(response.status);

        Object.entries(response.headers).forEach(([key, value]) => {
            if (!config.headers.remove.includes(key.toLowerCase())) {
                res.set(key, value);
            }
        });

        res.send(response.data);
    } catch (error) {
        if (config.errors.logging) {
            console.error("Proxy error:", error.message);
        }

        res.status(500).json({
            error: config.errors.messages.proxyError,
            message: config.errors.exposeErrorDetails
                ? error.message
                : undefined,
        });
    }
});

app.listen(config.server.port, config.server.host, () => {
    console.log("\n=== Proxy Server Configuration ===");
    console.log(
        `Server running at: http://${config.server.host}:${config.server.port}`
    );
    console.log(`Target URL: ${config.target.url}`);
    console.log(`Base Path: ${config.target.basePath}`);
    console.log(`Preserve Base Path: ${config.target.preserveBasePath}`);
    console.log("\nEnabled Features:");
    console.log(`- CORS: ${config.cors.enabled}`);
    console.log(`- JSON Parser: ${config.parser.json.enabled}`);
    console.log(`- URL Encoded Parser: ${config.parser.urlencoded.enabled}`);
    console.log(`- Error Logging: ${config.errors.logging}`);
    console.log("\nHeader Configuration:");
    console.log("- Headers to remove:", config.headers.remove);
    console.log("- Headers to add:", Object.keys(config.headers.add));
    console.log("\n=== Ready to handle requests ===\n");
});
