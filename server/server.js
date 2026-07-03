const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
require('dotenv').config();

const { runRecommendationPipeline } = require('./pipeline/recommendationPipeline');

const app = express();

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    console.error("FATAL: NODE_ENV is production but FRONTEND_URL is undefined. Exiting.");
    process.exit(1);
}

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    hidePoweredBy: true,
    noSniff: true
}));

const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080', process.env.FRONTEND_URL];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy Rejection'));
        }
    }
}));

app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/recommend', apiLimiter);
app.use(express.json({ limit: '50kb' }));

app.get('/health', (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

app.post('/api/recommend', async (req, res) => {
    const startTime = Date.now();
    const reqId = crypto.randomUUID();

    // Enable Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let isClientConnected = true;
    req.on('close', () => {
        isClientConnected = false;
        console.log(`[SSE] Client disconnected early (reqId: ${reqId})`);
    });

    const sendEvent = (data) => {
        if (!isClientConnected) return;
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        await runRecommendationPipeline(req.body, sendEvent);
        if (isClientConnected) res.end();
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            requestId: reqId,
            endpoint: req.originalUrl,
            method: req.method,
            provider: 'AI_Pipeline',
            statusCode: 500,
            durationMs: duration,
            errorType: error.name,
            stack: error.stack
        }));
        if (isClientConnected) {
            sendEvent({ 
                error: "An unexpected server error occurred while processing your request.",
                referenceId: reqId
            });
            res.end();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
