import { TELEGRAM_CONFIG } from '../src/config/telegram.js';

console.log('🧪 Testing Telegram server configuration...\n');

// Проверяем клиентскую конфигурацию
console.log('1️⃣ Client configuration:');
console.log(`   Bot username: ${TELEGRAM_CONFIG.botUsername || 'Not set'}`);
console.log(`   Admin chat IDs: ${TELEGRAM_CONFIG.adminChatIds?.length || 0} configured`);
console.log(`   Chat IDs: ${TELEGRAM_CONFIG.chatIds?.length || 0} configured`);
console.log('');

// Проверяем структуру файлов
console.log('2️⃣ File structure check:');
const fs = await import('fs');

const checkFile = (path) => {
  try {
    const exists = fs.existsSync(path);
    console.log(`   ${exists ? '✅' : '❌'} ${path}`);
    return exists;
  } catch (e) {
    console.log(`   ❌ ${path} (error)`);
    return false;
  }
};

const filesToCheck = [
  'server/telegram-server.js',
  'server/utils/bot-handler.ts',
  'server/utils/subscribers.ts',
  'server/config/telegram.ts',
  'server/scripts/setup-bot.js',
  'src/utils/telegram.ts',
  'src/config/telegram.ts'
];

let allFilesExist = true;
filesToCheck.forEach(file => {
  if (!checkFile(file)) allFilesExist = false;
});

console.log('');
if (allFilesExist) {
  console.log('✅ All required files are present!');
} else {
  console.log('❌ Some files are missing!');
}

console.log('\n📋 Next steps:');
console.log('1. Run: npm run telegram-server');
console.log('2. In another terminal: npm run bot:setup');
console.log('3. Test the bot by sending /start command');

console.log('\n🎉 Server test completed!');