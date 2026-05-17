// src/app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-24 pb-24">
      
      {/* === HERO БЛОК СТРАНИЦЫ === */}
      <section className="bg-zinc-900 text-white py-20 sm:py-28 relative overflow-hidden">
        {/* Мягкий световой акцент на фоне */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full">
            О компании
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Переосмысляем культуру <br className="hidden sm:inline" /> премиальных путешествий
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            HotelSpace — это технологичная экосистема бронирования, созданная для тех, кто ценит свое время, безупречный сервис и абсолютный комфорт в любой точке мира.
          </p>
        </div>
      </section>

      {/* === ЦИФРЫ И СТАТИСТИКА === */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 sm:p-12 bg-white border border-zinc-200/80 rounded-3xl shadow-xs text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">6+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Крупных регионов</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">150+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Проверенных номеров</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">12к+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Счастливых гостей</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">4.9</div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Средний рейтинг отзывов</div>
          </div>
        </div>
      </section>

      {/* === ЦЕННОСТИ И ПРЕИМУЩЕСТВА === */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">Почему выбирают нас</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">Мы убрали всё лишнее и оставили то, что действительно важно при планировании поездки</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Карточка 1 */}
          <div className="bg-white border border-zinc-200/60 p-8 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">🛡️</div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">100% Гарантия заселения</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Мы напрямую интегрированы с системами управления отелей. Каждое бронирование мгновенно фиксируется в базе отеля без риска овербукинга.
            </p>
          </div>

          {/* Карточка 2 */}
          <div className="bg-white border border-zinc-200/60 p-8 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">✨</div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Честный отбор локаций</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Мы не гонимся за количеством. Каждый отель в нашем каталоге проходит строгую ручную проверку сервиса, чистоты и соответствия фотографиям.
            </p>
          </div>

          {/* Карточка 3 */}
          <div className="bg-white border border-zinc-200/60 p-8 rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">💬</div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Консьерж-поддержка 24/7</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Никаких бездушных ботов. Наша персональная служба заботы на связи круглые сутки, чтобы помочь решить любой вопрос от отмены до позднего выезда.
            </p>
          </div>
        </div>
      </section>

      {/* === БЛОК ПРИЗЫВА К ДЕЙСТВИЮ (CTA) === */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">Готовы отправиться в путь?</h2>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Забронируйте свой идеальный номер прямо сейчас и получите персональную скидку 10% на первую поездку после регистрации.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <Link 
              href="/auth/register" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-4 rounded-xl text-center shadow-xs transition-all cursor-pointer"
            >
              Зарегистрироваться
            </Link>
            <Link 
              href="/hotels" 
              className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold text-sm px-8 py-4 rounded-xl text-center shadow-xs transition-all cursor-pointer"
            >
              Смотреть отели
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}