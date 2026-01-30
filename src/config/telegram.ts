// Telegram Bot Configuration
// ВАЖНО: В production эти данные должны храниться в переменных окружения (.env)
export const TELEGRAM_CONFIG = {
  botToken: '8316857468:AAG_xT7jgeRnTuxQx1m8kpSNuajxCRak154',

  // Список ID чатов администраторов и каналов (всегда получают уведомления)
  // Первый ID - личный чат администратора
  // Второй ID - канал/группа компании
  adminChatIds: ['615369157', '-1003806704116'],

  // Устаревшее поле - оставлено для обратной совместимости
  // Теперь используется subscribers.json для хранения подписчиков бота
  chatIds: ['615369157', '-1003806704116'],

  // Настройки webhook сервера
  webhook: {
    // URL для webhook (для production заменить на реальный домен)
    url: process.env.TELEGRAM_WEBHOOK_URL || 'https://your-domain.com/telegram/webhook',
    // Порт для локального сервера
    port: process.env.PORT || 3001
  }
};
