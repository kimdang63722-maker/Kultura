import * as fs from 'fs';
import * as path from 'path';

// Путь к файлу с подписчиками
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'subscribers.json');

// Инициализация файла подписчиков, если он не существует
const initializeSubscribersFile = () => {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
  }
};

// Получение всех подписчиков
export const getSubscribers = () => {
  try {
    initializeSubscribersFile();
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
};

// Добавление нового подписчика
export const addSubscriber = (subscriber) => {
  try {
    const subscribers = getSubscribers();

    // Проверяем, не подписан ли уже пользователь
    const existingSubscriber = subscribers.find(s => s.chatId === subscriber.chatId);
    if (existingSubscriber) {
      return true; // Уже подписан
    }

    // Добавляем нового подписчика
    const newSubscriber = {
      ...subscriber,
      subscribedAt: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return false;
  }
};

// Получение всех chat IDs для отправки уведомлений
export const getSubscriberChatIds = () => {
  const subscribers = getSubscribers();
  return subscribers.map(s => s.chatId);
};

// Удаление подписчика (опционально, для отписки)
export const removeSubscriber = (chatId) => {
  try {
    const subscribers = getSubscribers();
    const filteredSubscribers = subscribers.filter(s => s.chatId !== chatId);

    if (filteredSubscribers.length === subscribers.length) {
      return false; // Пользователь не найден
    }

    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(filteredSubscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error removing subscriber:', error);
    return false;
  }
};

// Получение статистики подписчиков
export const getSubscriberStats = () => {
  const subscribers = getSubscribers();
  return {
    total: subscribers.length,
    recent: subscribers.filter(s => {
      const subscribedDate = new Date(s.subscribedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return subscribedDate > weekAgo;
    }).length
  };
};