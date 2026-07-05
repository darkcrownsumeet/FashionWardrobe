const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
require('dotenv').config();

const { runRecommendationPipeline } = require('./pipeline/recommendationPipeline');

const app = express();

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    console.warn("NODE_ENV is production but FRONTEND_URL is undefined. Server will try to start anyway.");
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
        if (!origin) {
            callback(null, true);
            return;
        }
        // Allow any localhost/127.0.0.1 port for development
        if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('CORS Policy Rejection'));
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

    console.log(`[${reqId}] Request received`);

    // Enable Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Disable proxy buffering - critical for Render and other proxies
    res.setHeader('X-Accel-Buffering', 'no');

    let isClientConnected = true;
    res.on('close', () => {
        isClientConnected = false;
        console.log(`[${reqId}] Client disconnected`);
    });

    const sendEvent = (data) => {
        if (!isClientConnected) return;
        const raw = JSON.stringify(data);
        if (data.result) {
            console.log(`[${reqId}] Result:`, raw);
        } else if (raw.length < 200) {
            console.log(`[${reqId}] Sending event:`, raw);
        } else {
            console.log(`[${reqId}] Sending event type:`, data.status || 'unknown');
        }
        res.write(`data: ${raw}\n\n`);
    };

    // Connection checker for pipeline
    const isConnected = () => isClientConnected;

    // Send an initial event immediately to establish the connection
    sendEvent({ status: "Starting analysis...", timestamp: Date.now() });
    console.log(`[${reqId}] Sent initial event`);

    // Keepalive heartbeat every 15s with actual data (not comments)
    // This prevents proxy/browser from killing the idle SSE connection
    // while LLMs are processing (can take 60-180s on Render free tier)
    const keepaliveId = setInterval(() => {
        if (!isClientConnected) { clearInterval(keepaliveId); return; }
        // Send actual data event with elapsed time - proxies respect data events better than comments
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        sendEvent({ 
            status: "Still analyzing your outfit...", 
            heartbeat: true,
            elapsedSeconds: elapsed,
            timestamp: Date.now()
        });
    }, 15000);

    try {
        console.log(`[${reqId}] Calling pipeline...`);
        await runRecommendationPipeline(req.body, sendEvent, isConnected);
        console.log(`[${reqId}] Pipeline completed`);
        clearInterval(keepaliveId);
        if (isClientConnected) res.end();
    } catch (error) {
        clearInterval(keepaliveId);
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
