import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, Lock, Settings, Menu, Phone, MessageCircle, X, ChevronRight, Check
} from 'lucide-react';
import { Button, Input, Sheet, Dialog, AccordionItem, Badge, Card, CardContent } from './components/ui-components';
import { Calculator } from './components/Calculator';
import { PriceList } from './components/PriceList';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  // Simple Hash Router effect
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Auto-scroll to top if it's a "page" navigation (not a section jump)
      if (window.location.hash === '#privacy' || window.location.hash === '#404') {
        window.scrollTo(0, 0);
      }
    };
    
    // Initial check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinks = [
    { name: 'Преимущества', href: '#features' },
    { name: 'Цены', href: '#prices' },
    { name: 'Калькулятор', href: '#calculator' },
    { name: 'Портфолио', href: '#portfolio' },
    { name: 'FAQ', href: '#faq' },
  ];

  // Helper to handle navigation when on a sub-page
  const handleNavClick = (href: string) => {
    if (currentHash === '#privacy' || currentHash === '#404') {
      // If we are on a subpage, we need to force navigation to root + hash
      window.location.href = '/' + href;
    }
    setIsMobileMenuOpen(false);
  };

  const portfolioImages = [
    "https://picsum.photos/800/600?random=1",
    "https://picsum.photos/800/600?random=2",
    "https://picsum.photos/800/600?random=3",
    "https://picsum.photos/800/600?random=4",
    "https://picsum.photos/800/600?random=5",
    "https://picsum.photos/800/600?random=6"
  ];

  const faqData = [
    { 
      q: "Почему так дорого?", 
      a: "Мы используем профессиональное оборудование (станции PFT, Festool) и качественные материалы (Knauf, Rehau), которые не могут стоить дешево. Наши мастера — узкопрофильные специалисты с опытом от 7 лет. Цена оправдана отсутствием переделок и геометрической точностью." 
    },
    { 
      q: "Какие гарантии вы даете?", 
      a: "Мы предоставляем гарантию 2 года на все виды работ. Это зафиксировано в договоре. Если возникнут проблемы с инженерными системами или отделкой по нашей вине — исправим за свой счет." 
    },
    { 
      q: "Как фиксируется цена?", 
      a: "Работаем по системе Open Book. После замера составляется детальная смета, которая становится приложением к договору. Цена работ фиксируется и не меняется, если вы не вносите изменения в проект." 
    },
    {
      q: "Закупаете ли вы материалы?",
      a: "Да, мы организуем закупку и доставку черновых материалов по оптовым ценам наших партнеров. Предоставляем полную отчетность по чекам."
    }
  ];

  // Router Logic
  const isPrivacyPage = currentHash === '#privacy';
  const isNotFoundPage = currentHash === '#404';
  const isLandingPage = !isPrivacyPage && !isNotFoundPage;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <a href="#" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
            <div className="h-8 w-8 bg-slate-900 rounded-sm flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-construction rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Культура<span className="text-construction">.</span>Метров</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => handleNavClick(link.href)}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a href={isLandingPage ? '#calculator' : '/#calculator'}>
              <Button 
                className="bg-slate-900 text-white hover:bg-construction transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Рассчитать стоимость
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* --- MOBILE SHEET --- */}
      <Sheet isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="flex flex-col gap-8 pt-10">
           <div className="text-xl font-bold">Меню</div>
           <nav className="flex flex-col gap-6 text-lg">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="font-medium hover:text-construction transition-colors"
                onClick={() => handleNavClick(link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="mt-auto">
             <a 
                href={isLandingPage ? '#calculator' : '/#calculator'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
             >
               <Button className="w-full mb-4 bg-slate-900 hover:bg-construction transition-colors">
                  Рассчитать стоимость
               </Button>
             </a>
             <p className="text-sm text-slate-500 text-center">+7 (495) 000-00-00</p>
          </div>
        </div>
      </Sheet>

      <main className="flex-1">
        {/* --- ROUTER VIEW --- */}
        {isPrivacyPage && <PrivacyPolicy />}
        
        {isNotFoundPage && <NotFound />}

        {isLandingPage && (
          <>
            {/* --- HERO SECTION --- */}
            <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
              <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-3xl space-y-8">
                  {/* Removed Season 2025 Badge as requested */}
                  
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                    Ремонт квартир в Москве с <span className="text-slate-500">инженерной точностью</span>.
                  </h1>
                  <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                    Работаем по системе «Открытая книга» (Open Book). Вы видите реальную стоимость материалов, 
                    честную цену работ и фиксируете бюджет до начала ремонта. 
                    Никаких скрытых доплат и «раздувания» сметы.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#calculator">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto text-lg h-12 px-8 bg-slate-900 text-white hover:bg-construction transition-colors duration-300 shadow-lg"
                      >
                        Рассчитать стоимость
                      </Button>
                    </a>
                    <a href="#portfolio">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full sm:w-auto text-lg h-12 px-8 hover:bg-slate-100 transition-colors"
                      >
                        Посмотреть портфолио
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              {/* Subtle grid background */}
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </section>

            {/* --- FEATURES (TRUST) --- */}
            <section id="features" className="py-20 bg-slate-50 border-y border-slate-100">
              <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { 
                      icon: FileText, 
                      title: "Прозрачность", 
                      desc: "Мы не зарабатываем на перепродаже черновых материалов. Вы оплачиваете их напрямую поставщикам или по нашим оптовым ценам без накрутки." 
                    },
                    { 
                      icon: ShieldCheck, 
                      title: "Технадзор", 
                      desc: "Каждый этап принимает наш штатный инженер технадзора, а не прораб. Мы используем чек-листы из 150 пунктов для приемки работ." 
                    },
                    { 
                      icon: Lock, 
                      title: "Фиксация цены", 
                      desc: "Стоимость работ фиксируется в договоре. Если мы забыли посчитать розетку при замере — мы установим её за свой счет." 
                    },
                    { 
                      icon: Settings, 
                      title: "Механизация", 
                      desc: "Используем станции PFT для штукатурки и шлифовальные машины Festool. Это обеспечивает заводское качество и сокращает сроки на 30%." 
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex flex-col gap-4 p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-construction">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- CALCULATOR & PRICE --- */}
            <section id="prices" className="py-24">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                  
                  {/* Left Column: Calculator (Sticky on Desktop) */}
                  <div id="calculator" className="w-full lg:w-1/3 lg:min-w-[400px]">
                    <div className="lg:sticky lg:top-24">
                      <Calculator />
                    </div>
                  </div>

                  {/* Right Column: Price List */}
                  <div className="w-full lg:w-2/3">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold tracking-tight mb-4">Прайс-лист 2025</h2>
                      <p className="text-slate-500">
                        Актуальные расценки на строительный сезон. Цены указаны за работу профессиональных бригад с соблюдением СНиП.
                      </p>
                    </div>
                    <PriceList />
                  </div>

                </div>
              </div>
            </section>

            {/* --- PORTFOLIO --- */}
            <section id="portfolio" className="py-24 bg-slate-900 text-slate-50">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Инженерная эстетика</h2>
                      <p className="text-slate-400">
                        Наши работы — это не только красивые интерьеры, но и безупречная инженерия. 
                        Посмотрите на качество сборки щитов, коллекторных узлов и примыканий.
                      </p>
                    </div>
                    <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                      Все проекты
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioImages.map((src, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.02 }}
                        className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 cursor-pointer relative group"
                        onClick={() => setSelectedImage(src)}
                      >
                        <img 
                          src={src} 
                          alt={`Portfolio ${idx}`} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
                            Смотреть детали
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </section>

            {/* --- FAQ --- */}
            <section id="faq" className="py-24 bg-white">
              <div className="container px-4 md:px-6 max-w-3xl">
                  <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Частые вопросы</h2>
                  <div className="space-y-2">
                    {faqData.map((item, i) => (
                      <div key={i} className="border rounded-lg px-4 bg-slate-50/50">
                        <AccordionItem 
                          title={item.q} 
                          isOpen={false} // Controlled by internal state in AccordionItem for simplicity in this demo
                          onToggle={() => {}} // Internal
                        >
                          {item.a}
                        </AccordionItem>
                      </div>
                    ))}
                  </div>
              </div>
            </section>

            {/* --- CONTACT FORM --- */}
            <section className="py-24 bg-slate-50 border-t">
              <div className="container px-4 md:px-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border max-w-4xl mx-auto flex flex-col md:flex-row">
                  <div className="p-8 md:p-12 md:w-1/2 bg-slate-900 text-white flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Начните с консультации</h3>
                      <p className="text-slate-300 mb-8">
                        Инженер приедет на объект, проведет замер лазером и составит смету с точностью до 98%.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Телефон</div>
                            <div className="font-mono font-bold">+7 (495) 123-45-67</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Мессенджеры</div>
                            <div className="font-medium">Telegram / WhatsApp</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 md:mt-0 text-xs text-slate-500">
                      © 2025 Культура Метров
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 md:w-1/2">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Ваше имя</label>
                          <Input placeholder="Иван" className="bg-slate-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Телефон</label>
                          <Input placeholder="+7 (999) 000-00-00" className="bg-slate-50" />
                        </div>
                        <div className="flex items-start gap-2 pt-2">
                          <input type="checkbox" id="policy" className="mt-1" defaultChecked />
                          <label htmlFor="policy" className="text-xs text-slate-500 leading-tight cursor-pointer">
                            Нажимая кнопку, я даю согласие на обработку персональных данных согласно <a href="#privacy" className="underline hover:text-slate-800">Политике конфиденциальности</a>.
                          </label>
                        </div>
                        <Button className="w-full bg-construction hover:bg-construction/90 text-white mt-2">
                          Вызвать инженера
                        </Button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-12 border-t text-sm text-slate-500">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="font-bold text-slate-900 mb-2">ООО "Культура Метров"</div>
              <p>Москва, ул. Строителей, д. 10, оф. 305</p>
            </div>
            <div className="md:text-right text-xs flex flex-col md:items-end gap-2">
              <p>
                Информация на сайте носит справочный характер и не является публичной офертой (ст. 437 ГК РФ).
              </p>
              <p>Цены актуальны на весенний сезон 2025 года.</p>
              <a href="#privacy" className="underline hover:text-slate-900 transition-colors">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MOBILE STICKY FOOTER --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex gap-4 safe-area-bottom">
        <Button variant="outline" className="flex-1 border-slate-300">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button className="flex-1 bg-slate-900 text-white">
          <Phone className="w-4 h-4 mr-2" />
          Позвонить
        </Button>
      </div>

      {/* --- PORTFOLIO MODAL --- */}
      <Dialog isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="relative">
            <img src={selectedImage} alt="Portfolio Detail" className="w-full h-auto rounded-md" />
            <div className="mt-4 text-center">
              <h3 className="font-bold text-lg">Детализация узла</h3>
              <p className="text-slate-500 text-sm">Пример реализации инженерного решения.</p>
            </div>
          </div>
        )}
      </Dialog>

    </div>
  );
}