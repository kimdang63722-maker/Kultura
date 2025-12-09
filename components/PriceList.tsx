import React, { useState } from 'react';
import { Input, Badge } from './ui-components';
import { cn, formatCurrency } from '../lib/utils';
import { Search } from 'lucide-react';

interface PriceItem {
  name: string;
  unit: string;
  price: number;
  comment?: string;
}

const priceData: Record<string, PriceItem[]> = {
  'Стены и Перегородки': [
    { name: 'Возведение перегородок (Пеноблок/ПГП)', unit: 'м²', price: 1450, comment: 'Кладка, армирование, привязка' },
    { name: 'Механизированная штукатурка стен', unit: 'м²', price: 790, comment: 'Грунт, маяки, глянцевание' },
    { name: 'Штукатурка потолка (Гипс)', unit: 'м²', price: 1100, comment: 'Работа на потолке' },
    { name: 'Шпаклевка под покраску (Full set)', unit: 'м²', price: 1800, comment: 'Стеклохолст, 2 слоя, шлифовка' },
    { name: 'Покраска стен (Airless/Валик)', unit: 'м²', price: 650, comment: 'Грунт + 2 слоя премиум' },
    { name: 'Поклейка обоев (Винил/Флизелин)', unit: 'м²', price: 550, comment: 'Подбор рисунка, невидимые стыки' },
  ],
  'Полы': [
    { name: 'Полусухая стяжка пола (до 50 м²)', unit: 'фикс.', price: 55000, comment: 'Минимальный выезд + материалы' },
    { name: 'Полусухая стяжка пола (51–90 м²)', unit: 'м²', price: 950, comment: 'Работа + материал, слой до 60 мм' },
    { name: 'Укладка ламината / Кварцвинила', unit: 'м²', price: 650, comment: 'На подложку, плавающий способ' },
    { name: 'Укладка инженерной доски (Клей)', unit: 'м²', price: 1400, comment: 'Укладка на клей, без фанеры' },
    { name: 'Монтаж плинтуса (МДФ/Дюрополимер)', unit: 'пог.м', price: 600, comment: 'Запил углов, монтаж на клей' },
  ],
  'Плитка': [
    { name: 'Укладка керамогранита (до 60x60)', unit: 'м²', price: 2800, comment: 'Стандарт, раскладка, резка' },
    { name: 'Укладка крупного формата (120x60)', unit: 'м²', price: 3800, comment: 'СВП, двойное нанесение клея' },
    { name: 'Укладка Макси-формата (120x240+)', unit: 'м²', price: 5500, comment: 'Спец. оборудование + 2 мастера' },
    { name: 'Запил торца под 45° (Заусовка)', unit: 'пог.м', price: 2100, comment: 'Идеальный угол без уголков' },
    { name: 'Эпоксидная затирка', unit: 'м²', price: 1500, comment: 'Формирование шва, вечный шов' },
    { name: 'Отверстие в керамограните', unit: 'шт.', price: 600, comment: 'Алмазное бурение' },
  ],
  'Электрика': [
    { name: 'Комплекс: Черновая точка (Бетон)', unit: 'шт.', price: 1500, comment: 'Разметка, штробление, подрозетник' },
    { name: 'Комплекс: Черновая точка (Гипсокартон/Блок)', unit: 'шт.', price: 1100, comment: 'Монтаж в полую стену' },
    { name: 'Монтаж кабеля (в гофре)', unit: 'пог.м', price: 180, comment: 'Крепление к потолку' },
    { name: 'Сборка электрощита (за модуль)', unit: 'шт.', price: 600, comment: 'Автомат/УЗО, маркировка' },
    { name: 'Установка чистовой розетки/выкл.', unit: 'шт.', price: 450, comment: 'Монтаж рамки и механизма' },
    { name: 'Установка трековой системы', unit: 'пог.м', price: 1200, comment: 'Врезная/Накладная шина' },
  ],
  'Сантехника': [
    { name: 'Точка водоснабжения (Коллекторная)', unit: 'шт.', price: 4500, comment: 'Rehau/Tece от коллектора + водорозетка' },
    { name: 'Точка канализации (ПВХ)', unit: 'шт.', price: 2500, comment: 'Прокладка труб под уклоном' },
    { name: 'Сборка узла ввода (Стандарт)', unit: 'узел', price: 22000, comment: 'Коллекторы, фильтры, защита от протечек' },
    { name: 'Установка инсталляции (Рама)', unit: 'шт.', price: 5500, comment: 'Монтаж рамы, подвод воды и канализации' },
    { name: 'Установка ванны (Акрил/Искусст. камень)', unit: 'шт.', price: 7000, comment: 'Монтаж на каркас, подключение слива' },
    { name: 'Установка чистовой сантехники', unit: 'шт.', price: 3500, comment: 'Смеситель, раковина, гиг. душ' },
  ]
};

const categories = Object.keys(priceData);

export const PriceList = () => {
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = priceData[activeTab].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeTab === cat 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input 
             placeholder="Поиск услуги..." 
             className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Наименование</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Ед. изм.</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Цена</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors odd:bg-slate-50/30">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.name}
                      {item.comment && (
                         <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5 font-normal text-slate-500">
                           {item.comment}
                         </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">{item.unit}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {new Intl.NumberFormat('ru-RU').format(item.price)} ₽
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Услуги не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};