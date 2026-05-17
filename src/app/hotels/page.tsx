// src/app/hotels/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';

interface HotelsPageProps {
  searchParams: Promise<{
    city?: string;
    maxPrice?: string;
    guests?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const { city, maxPrice, guests } = await searchParams;

  const whereClause: any = {};
  
  if (city && city !== 'all') {
    whereClause.city = city;
  }

  if (maxPrice || guests) {
    whereClause.rooms = {
      some: {
        ...(maxPrice && {
          pricePerNight: {
            lte: parseInt(maxPrice),
          },
        }),
        ...(guests && {
          capacity: {
            gte: parseInt(guests),
          },
        }),
      },
    };
  }

  const hotels = await db.hotel.findMany({
    where: whereClause,
    include: {
      rooms: true,
    },
  });

  const allHotelsForCities = await db.hotel.findMany({ select: { city: true } });
  const uniqueCities = Array.from(new Set(allHotelsForCities.map((h) => h.city)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* === БОКОВАЯ ПАНЕЛЬ ФИЛЬТРОВ === */}
        <aside className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs lg:sticky lg:top-24 space-y-6">
          <div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">Фильтры</h2>
            <p className="text-zinc-400 text-xs mt-0.5">Найдено отелей: {hotels.length}</p>
          </div>

          <div className="h-px bg-zinc-100" />

          <form method="GET" action="/hotels" className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Направление</label>
              <select 
                name="city" 
                defaultValue={city || 'all'}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="all">Все города</option>
                {uniqueCities.map((cityName) => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Количество гостей</label>
              <select 
                name="guests" 
                defaultValue={guests || '2'}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="1">1 гость</option>
                <option value="2">2 гостя</option>
                <option value="3">3+ гостя (Семейный)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">Макс. цена за ночь</label>
              <input 
                type="number" 
                name="maxPrice"
                defaultValue={maxPrice || ''}
                placeholder="Например, 15000"
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Применить фильтры
              </button>
              {(city || maxPrice || guests) && (
                <Link 
                  href="/hotels" 
                  className="block w-full text-center bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold text-xs py-3.5 rounded-xl border border-zinc-200 transition-all"
                >
                  Сбросить
                </Link>
              )}
            </div>
          </form>
        </aside>

        {/* === СПИСОК ОТФИЛЬТРОВАННЫХ ОТЕЛЕЙ === */}
        <section className="lg:col-span-3">
          {hotels.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center space-y-4">
              <span className="text-3xl block">🔍</span>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Ничего не найдено</h3>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                Попробуйте изменить параметры фильтрации или сбросить настройки бюджета и гостей.
              </p>
              <Link href="/hotels" className="inline-block bg-zinc-900 text-white text-xs font-bold px-6 py-3 rounded-xl">
                Показать все отели
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => {
                const prices = hotel.rooms.map((r) => r.pricePerNight);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                return (
                  /* ИЗМЕНЕНИЕ 1: Карточка теперь — это валидный div c позиционированием relative */
                  <div 
                    key={hotel.id} 
                    className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between relative text-left"
                  >
                    <div>
                      {/* Картинка */}
                      <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                        />
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-bold text-zinc-900 shadow-xs z-10">
                          ⭐ {hotel.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Текстовый контент */}
                      <div className="p-6 space-y-2">
                        
                        {/* ИЗМЕНЕНИЕ 2: Город является самостоятельной ссылкой. Класс relative z-25 ставит его выше растянутой ссылки */}
                        <div className="relative z-25 inline-block">
                          <Link 
                            href={`/hotels?city=${hotel.city}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 bg-indigo-50/60 px-2 py-0.5 rounded-md transition-colors block relative z-30"
                          >
                            {hotel.city}
                          </Link>
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                          {hotel.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Нижняя плашка цены */}
                    <div className="p-6 pt-0 border-t border-zinc-50 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 block">от</span>
                        <span className="text-base font-black text-zinc-900">
                          {minPrice.toLocaleString('ru-RU')} ₽ <span className="text-xs font-medium text-zinc-400">/ ночь</span>
                        </span>
                      </div>
                      
                      {/* ИЗМЕНЕНИЕ 3: Кнопка стала настоящим Link. 
                          Класс "after:absolute after:inset-0" создает невидимый слой на ВСЮ карточку.
                          Клик по любому месту карточки активирует именно эту ссылку! */}
                      <Link 
                        href={`/hotels/${hotel.id}`}
                        className="bg-zinc-900 group-hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors after:absolute after:inset-0 after:z-10"
                      >
                        Выбрать номер
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}