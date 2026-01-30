import { sendToTelegram } from '../src/utils/telegram.js';
import { getSubscriberChatIds, getSubscriberStats } from '../src/utils/subscribers.js';
import { TELEGRAM_CONFIG } from '../src/config/telegram.js';

async function testBot() {
  console.log('🧪 Testing Telegram bot functionality...\n');

  try {
    // Test 1: Check configuration
    console.log('1️⃣ Testing configuration...');
    console.log(`   Bot token: ${TELEGRAM_CONFIG.botToken ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Admin chat IDs: ${TELEGRAM_CONFIG.adminChatIds.length} configured`);
    console.log(`   Webhook URL: ${TELEGRAM_CONFIG.webhook.url}`);
    console.log('');

    // Test 2: Check subscribers storage
    console.log('2️⃣ Testing subscribers storage...');
    const subscriberStats = getSubscriberStats();
    console.log(`   Total subscribers: ${subscriberStats.total}`);
    console.log(`   Recent subscribers (7 days): ${subscriberStats.recent}`);

    const chatIds = getSubscriberChatIds();
    console.log(`   Active chat IDs: ${chatIds.length}`);
    console.log('');

    // Test 3: Test notification sending
    console.log('3️⃣ Testing notification sending...');

    const testData = {
      formType: 'contact' as const,
      name: 'Тестовый Пользователь',
      phone: '+7 (999) 123-45-67',
      comment: 'Это тестовое уведомление от системы'
    };

    console.log('   Sending test notification...');
    const success = await sendToTelegram(testData);

    if (success) {
      console.log('   ✅ Notification sent successfully');
    } else {
      console.log('   ❌ Failed to send notification');
    }

    console.log('');
    console.log('🎉 Bot test completed!');

    if (subscriberStats.total === 0) {
      console.log('\n💡 Tip: No subscribers yet. Users need to send /start to your bot first.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBot();