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
  'Стены': [
    { name: 'Механизированная штукатурка стен (гипс)', unit: 'м²', price: 790, comment: 'Вкл. грунтовку, маяки' },
    { name: 'Штукатурка потолков (гипс)', unit: 'м²', price: 1100, comment: 'Высокая трудоемкость' },
    { name: 'Штукатурка откосов (до 400 мм)', unit: 'пог.м', price: 950 },
    { name: 'Монтаж штукатурной сетки', unit: 'м²', price: 150 },
  ],
  'Пол': [
    { name: 'Полусухая стяжка (до 50 м²)', unit: 'фикс.', price: 55000, comment: 'Минимальный заказ' },
    { name: 'Полусухая стяжка (51–80 м²)', unit: 'м²', price: 950 },
    { name: 'Полусухая стяжка (от 81 м²)', unit: 'м²', price: 850 },
    { name: 'Доп. слой стяжки (> 60 мм)', unit: 'м²/см', price: 60 },
  ],
  'Электрика': [
    { name: 'Штробление стен (бетон)', unit: 'пог.м', price: 750, comment: 'С пылесосом' },
    { name: 'Штробление стен (пеноблок)', unit: 'пог.м', price: 450 },
    { name: 'Устройство гнезда подрозетника', unit: 'шт.', price: 1100, comment: 'Алмазное бурение' },
    { name: 'Монтаж кабеля', unit: 'пог.м', price: 150 },
    { name: 'Сборка электрощита (внутр.)', unit: 'шт.', price: 8000, comment: 'До 24 модулей' },
  ],
  'Сантехника': [
    { name: 'Точка водоснабжения (Rehau)', unit: 'шт.', price: 4500 },
    { name: 'Точка канализации', unit: 'шт.', price: 2500 },
    { name: 'Сборка коллекторного узла', unit: 'шт.', price: 22000, comment: 'Комфорт класс' },
    { name: 'Установка инсталляции', unit: 'шт.', price: 5500 },
    { name: 'Защита от протечек (монтаж)', unit: 'компл.', price: 5000 },
  ],
  'Плитка': [
    { name: 'Укладка керамогранита (до 60x60)', unit: 'м²', price: 2800 },
    { name: 'Укладка крупного формата (120x60)', unit: 'м²', price: 3800 },
    { name: 'Запил торцов под 45°', unit: 'пог.м', price: 2100 },
    { name: 'Затирка швов (эпоксидная)', unit: 'м²', price: 1500 },
    { name: 'Отверстие в керамограните', unit: 'шт.', price: 600 },
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