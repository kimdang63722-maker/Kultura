import express from 'express';
import bodyParser from 'body-parser';
import { handleTelegramUpdate, setWebhook, deleteWebhook } from './utils/bot-handler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Telegram webhook endpoint
app.post('/telegram/webhook', async (req, res) => {
  try {
    console.log('Received webhook update:', JSON.stringify(req.body, null, 2));

    await handleTelegramUpdate(req.body);

    res.json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Webhook management endpoints (для удобства настройки)
app.post('/webhook/set', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const success = await setWebhook(url);
    res.json({ success, url });
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/webhook/delete', async (req, res) => {
  try {
    const success = await deleteWebhook();
    res.json({ success });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Telegram webhook server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/telegram/webhook`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});