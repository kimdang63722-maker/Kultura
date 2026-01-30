import { TELEGRAM_CONFIG } from '../config/telegram';
import { addSubscriber, removeSubscriber } from './subscribers';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

// Обработка входящего обновления от Telegram
export const handleTelegramUpdate = async (update: TelegramUpdate): Promise<void> => {
  try {
    if (!update.message) {
      return; // Пропускаем обновления без сообщений
    }

    const { message } = update;
    const chatId = message.chat.id.toString();
    const text = message.text || '';
    const user = message.from;

    console.log(`Received message from ${user.first_name || 'Unknown'} (${chatId}): ${text}`);

    // Обработка команды /start
    if (text === '/start') {
      await handleStartCommand(chatId, user);
    }
    // Обработка команды /stop для отписки
    else if (text === '/stop') {
      await handleStopCommand(chatId, user);
    }
    // Обработка команды /stats (только для администратора)
    else if (text === '/stats' && TELEGRAM_CONFIG.adminChatIds.includes(chatId)) {
      await handleStatsCommand(chatId);
    }
  } catch (error) {
    console.error('Error handling Telegram update:', error);
  }
};

// Обработка команды /start
const handleStartCommand = async (chatId: string, user: any): Promise<void> => {
  try {
    // Добавляем пользователя в список подписчиков
    const success = addSubscriber({
      chatId,
      username: user.username,
      firstName: user.first_name
    });

    if (success) {
      // Отправляем приветственное сообщение
      const welcomeMessage = `👋 Добро пожаловать в бот "Культура Метров"!

Вы успешно подписались на уведомления о новых заявках на ремонт квартир.

📋 Доступные команды:
/stop - Отписаться от уведомлений
/stats - Статистика (только для администратора)

Мы будем присылать вам информацию о новых заявках с сайта.`;

      await sendMessage(chatId, welcomeMessage);
      console.log(`User ${user.first_name || 'Unknown'} (${chatId}) subscribed to notifications`);
    } else {
      await sendMessage(chatId, '❌ Произошла ошибка при подписке. Попробуйте позже.');
    }
  } catch (error) {
    console.error('Error handling start command:', error);
  }
};

// Обработка команды /stop
const handleStopCommand = async (chatId: string, user: any): Promise<void> => {
  try {
    const success = removeSubscriber(chatId);

    if (success) {
      const goodbyeMessage = `👋 Вы успешно отписались от уведомлений.

Если передумаете, просто напишите /start снова.

Спасибо за использование бота "Культура Метров"!`;

      await sendMessage(chatId, goodbyeMessage);
      console.log(`User ${user.first_name || 'Unknown'} (${chatId}) unsubscribed from notifications`);
    } else {
      await sendMessage(chatId, '❌ Вы не были подписаны на уведомления.');
    }
  } catch (error) {
    console.error('Error handling stop command:', error);
  }
};

// Обработка команды /stats
const handleStatsCommand = async (chatId: string): Promise<void> => {
  try {
    const { getSubscriberStats, getSubscribers } = await import('./subscribers');
    const stats = getSubscriberStats();
    const subscribers = getSubscribers();

    const statsMessage = `📊 Статистика подписчиков:

👥 Всего подписчиков: ${stats.total}
🆕 За последнюю неделю: ${stats.recent}

📋 Список подписчиков:
${subscribers.map((s, i) =>
  `${i + 1}. ${s.firstName || 'Без имени'} ${s.username ? `(@${s.username})` : ''} - ${new Date(s.subscribedAt).toLocaleDateString('ru-RU')}`
).join('\n')}`;

    await sendMessage(chatId, statsMessage);
  } catch (error) {
    console.error('Error handling stats command:', error);
    await sendMessage(chatId, '❌ Ошибка получения статистики.');
  }
};

// Отправка сообщения пользователю
const sendMessage = async (chatId: string, text: string): Promise<boolean> => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send message to ${chatId}:`, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

// Установка webhook для бота
export const setWebhook = async (webhookUrl: string): Promise<boolean> => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/setWebhook`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message']
      }),
    });

    if (!response.ok) {
      console.error('Failed to set webhook:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('Webhook set successfully:', result);
    return result.ok;
  } catch (error) {
    console.error('Error setting webhook:', error);
    return false;
  }
};

// Удаление webhook
export const deleteWebhook = async (): Promise<boolean> => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/deleteWebhook`;

    const response = await fetch(url, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error('Failed to delete webhook:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('Webhook deleted successfully:', result);
    return result.ok;
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return false;
  }
};