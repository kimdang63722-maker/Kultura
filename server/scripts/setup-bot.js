import { setWebhook } from '../utils/bot-handler.js';
import { TELEGRAM_CONFIG } from '../config/telegram.js';

async function setupBot() {
  console.log('🤖 Setting up Telegram bot webhook...');

  try {
    const webhookUrl = TELEGRAM_CONFIG.webhook.url;
    console.log(`📡 Webhook URL: ${webhookUrl}`);

    const success = await setWebhook(webhookUrl);

    if (success) {
      console.log('✅ Webhook set successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Make sure your server is running: npm run telegram-server');
      console.log('2. Share your bot with users: https://t.me/your_bot_username');
      console.log('3. Users can now type /start to subscribe to notifications');
      console.log('4. Test by submitting a form on your website');
    } else {
      console.log('❌ Failed to set webhook');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check that your server is accessible from the internet');
      console.log('2. Verify the webhook URL is correct');
      console.log('3. Make sure the bot token is valid');
    }
  } catch (error) {
    console.error('❌ Error setting up bot:', error);
  }
}

setupBot();