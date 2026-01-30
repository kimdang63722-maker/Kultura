import { TELEGRAM_CONFIG } from '../config/telegram';
import { getSubscriberChatIds } from './subscribers';

// Типы данных для разных форм
export interface BaseFormData {
  name: string;
  phone: string;
  comment?: string;
}

export interface EstimateFormData extends BaseFormData {
  formType: 'estimate';
  area?: string;
}

export interface EngineerFormData extends BaseFormData {
  formType: 'engineer';
}

export interface CalculatorFormData extends BaseFormData {
  formType: 'calculator';
  calculatorData?: {
    area: number;
    isNewBuild: boolean;
    hasDesignProject: boolean;
    needsDemolition: boolean;
    totalWork: number;
    totalMaterials: number;
    totalDesign: number;
    total: number;
  };
}

export interface ContactFormData extends BaseFormData {
  formType: 'contact';
}

export type TelegramFormData = EstimateFormData | EngineerFormData | CalculatorFormData | ContactFormData;

// Форматирование сообщения для Telegram
const formatMessage = (data: TelegramFormData): string => {
  const timestamp = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Заголовок в зависимости от типа формы
  const formTitles = {
    estimate: '📊 Новая заявка: Рассчитать стоимость ремонта',
    engineer: '🔧 Новая заявка: Вызвать инженера на объект',
    calculator: '🧮 Новая заявка: Заказ сметы из калькулятора',
    contact: '📞 Новая заявка: Форма обратной связи'
  };

  let message = `${formTitles[data.formType]}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `⏰ Дата и время: ${timestamp}\n\n`;

  // Основные данные
  message += `👤 Имя: ${data.name}\n`;
  message += `📱 Телефон: ${data.phone}\n`;

  // Дополнительные данные в зависимости от типа формы
  if (data.formType === 'estimate' && data.area) {
    message += `📐 Площадь: ${data.area} м²\n`;
  }

  if (data.formType === 'calculator' && data.calculatorData) {
    const calc = data.calculatorData;
    message += `\n📋 Данные калькулятора:\n`;
    message += `   • Площадь: ${calc.area} м²\n`;
    message += `   • Тип жилья: ${calc.isNewBuild ? 'Новостройка' : 'Вторичное'}\n`;

    if (calc.hasDesignProject) {
      message += `   • Дизайн-проект: ✅ Включен\n`;
    }

    if (calc.needsDemolition) {
      message += `   • Демонтаж: ✅ Требуется\n`;
    }

    message += `\n💰 Предварительная стоимость:\n`;
    message += `   • Работы: ${new Intl.NumberFormat('ru-RU').format(calc.totalWork)} ₽\n`;
    message += `   • Материалы: ${new Intl.NumberFormat('ru-RU').format(calc.totalMaterials)} ₽\n`;

    if (calc.totalDesign > 0) {
      message += `   • Дизайн: ${new Intl.NumberFormat('ru-RU').format(calc.totalDesign)} ₽\n`;
    }

    message += `   • ИТОГО: ${new Intl.NumberFormat('ru-RU').format(calc.total)} ₽\n`;
  }

  if (data.comment) {
    message += `\n💬 Комментарий: ${data.comment}\n`;
  }

  message += `━━━━━━━━━━━━━━━━━━━━`;

  return message;
};

// Отправка сообщения в Telegram всем подписчикам
export const sendToTelegram = async (data: TelegramFormData): Promise<boolean> => {
  try {
    const message = formatMessage(data);

    // 1. Получаем список ID подписчиков бота
    let chatIds = getSubscriberChatIds();

    // 2. Добавляем hardcoded ID из конфига (для администраторов и каналов)
    chatIds = [...new Set([...chatIds, ...TELEGRAM_CONFIG.chatIds])];

    console.log(`Sending notification to ${chatIds.length} recipients`);
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

    const sendPromises = chatIds.map(chatId => 
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      })
    );

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(res => res.ok).length;

    return successCount > 0; // Возвращаем true, если хотя бы одному отправилось
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
};
