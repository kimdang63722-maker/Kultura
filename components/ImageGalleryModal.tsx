import React, { useState, useEffect } from 'react';
import { Dialog } from './ui-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  // Синхронизация с initialIndex при открытии
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsFirstOpen(true); // При каждом открытии считаем первым
    } else {
      // При закрытии сбрасываем для следующего открытия
      setIsFirstOpen(true);
    }
  }, [isOpen, initialIndex]);

  // Клавиатурная навигация
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Навигация
  const goToNext = () => {
    setIsFirstOpen(false); // Это навигация, не первое открытие
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setIsFirstOpen(false); // Это навигация, не первое открытие
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} variant="gallery">
      <div className="relative w-full">
        {/* Кнопка закрытия - вынесена за пределы изображения */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-white z-10"
          aria-label="Закрыть галерею"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Основное изображение с анимацией */}
        <div className="relative overflow-hidden rounded-lg">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentIndex}
              custom={direction}
              initial={isFirstOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              src={images[currentIndex]}
              alt={`Portfolio ${currentIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </AnimatePresence>
        </div>

        {/* Стрелки навигации - показываем только если больше 1 изображения */}
        {images.length > 1 && (
          <>
            {/* Стрелка влево */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>

            {/* Стрелка вправо */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>

            {/* Счетчик */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
