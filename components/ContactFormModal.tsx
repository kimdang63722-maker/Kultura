import React, { useState } from 'react';
import { Dialog } from './ui-components';
import { Button, Input } from './ui-components';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'estimate' | 'engineer';
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, formType }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    comment: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formConfig = {
    estimate: {
      title: 'Рассчитать стоимость ремонта',
      subtitle: 'Заполните форму и мы пришлем точную смету в течение 2 часов',
      buttonText: 'Получить смету',
      successTitle: 'Заявка отправлена!',
      successMessage: 'Наш инженер свяжется с вами в течение 15 минут для уточнения деталей и расчета сметы.'
    },
    engineer: {
      title: 'Вызвать инженера на объект',
      subtitle: 'Инженер приедет с лазерным дальномером и составит смету с точностью 98%',
      buttonText: 'Вызвать инженера',
      successTitle: 'Инженер вызван!',
      successMessage: 'Менеджер свяжется с вами в ближайшее время для согласования даты и времени выезда.'
    }
  };

  const config = formConfig[formType];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (formType === 'estimate' && formData.area && isNaN(Number(formData.area))) {
      newErrors.area = 'Введите корректную площадь';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Здесь будет отправка данных на сервер
      console.log('Form submitted:', { ...formData, formType });

      // Показываем сообщение об успехе
      setIsSubmitted(true);

      // Сброс формы через 3 секунды и закрытие модального окна
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({ name: '', phone: '', area: '', comment: '' });
    setErrors({});
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h2>
              <p className="text-slate-600 text-sm">{config.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {formType === 'estimate' && (
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Площадь квартиры (м²)
                  </label>
                  <Input
                    id="area"
                    type="text"
                    placeholder="65"
                    value={formData.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    className={errors.area ? 'border-red-500 focus:ring-red-500' : ''}
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  placeholder="Расскажите о вашем объекте..."
                  value={formData.comment}
                  onChange={(e) => handleChange('comment', e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="policy"
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                  defaultChecked
                  required
                />
                <label htmlFor="policy" className="text-xs text-slate-600 leading-tight cursor-pointer">
                  Нажимая кнопку, я даю согласие на обработку персональных данных согласно{' '}
                  <a href="#privacy" className="underline hover:text-slate-900" onClick={handleClose}>
                    Политике конфиденциальности
                  </a>
                  .
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white hover:bg-construction transition-colors"
                >
                  {config.buttonText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="px-6"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8 max-w-md w-full"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">{config.successTitle}</h2>
            <p className="text-slate-600 mb-8">{config.successMessage}</p>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 font-medium mb-2">Ваши данные:</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p><span className="font-medium">Имя:</span> {formData.name}</p>
                <p><span className="font-medium">Телефон:</span> {formData.phone}</p>
                {formData.area && <p><span className="font-medium">Площадь:</span> {formData.area} м²</p>}
              </div>
            </div>

            <Button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800">
              Закрыть
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
