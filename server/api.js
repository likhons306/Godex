import express from 'express';
import NextAuth from 'next-auth';
import { authOptions } from './auth.js';
import { streamMessage, sendMessage, analyzeCode } from '../src/lib/gemini.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// NextAuth route
app.all('/api/auth/*', (req, res) => {
  req.headers['x-forwarded-host'] = req.headers.host;
  return NextAuth.default(req, res, authOptions);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stream messages endpoint
app.post('/api/stream', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullContent = '';
    let reasoning = '';

    await streamMessage(
      messages || [],
      userMessage,
      (chunk) => {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      },
      (reasoningText) => {
        reasoning = reasoningText;
        res.write(`data: ${JSON.stringify({ type: 'reasoning', content: reasoningText })}\n\n`);
      },
      (toolCall) => {
        res.write(`data: ${JSON.stringify({ type: 'tool-call', ...toolCall })}\n\n`);
      },
      (toolResult) => {
        res.write(`data: ${JSON.stringify({ type: 'tool-result', ...toolResult })}\n\n`);
      },
      () => {
        res.write(`data: ${JSON.stringify({ type: 'complete', content: fullContent, reasoning })}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

// Send message endpoint (non-streaming)
app.post('/api/message', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    const result = await sendMessage(messages || [], userMessage);
    res.json(result);
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze code endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, query } = req.body;
    const result = await analyzeCode(code, query);
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Godex API server running on port ${PORT}`);
});
