// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import MainSearchPanel from '@/components/MainSearchPanel';

export default async function HomePage() {
  // Достаем топ-3 отеля с лучшим рейтингом
  const recommendedHotels = await db.hotel.findMany({
    orderBy: { rating: 'desc' },
    take: 3,
  });

  const popularCities = [
    { name: 'Москва', imgId: '1513622470522-26c328a9dc0f' },
    { name: 'Санкт-Петербург', imgId: '1571896349842-33c89424de2d' },
    { name: 'Сочи', imgId: '1540555700478-4be289fbecef' },
    { name: 'Казань', imgId: '1520250497591-112f2f40a3f4' }
  ];

  return (
    <div className="space-y-24 pb-24">
      
      {/* === HERO BANNER WITH COMPACT SEARCH === */}
      <section className="relative h-[75vh] min-h-[550px] max-h-[750px] mx-6 mt-4 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
        {/* Использование Next.js Image для баннера */}
        <Image 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Hotel"
          fill
          priority // Загружаем баннер в первую очередь
          className="object-cover brightness-75 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-zinc-900/20 to-transparent z-10" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
              Отдых, которого вы достойны
            </h1>
            <p className="text-base sm:text-lg text-zinc-100 max-w-xl mx-auto drop-shadow-xs font-medium">
              Эксклюзивные отели и individual-сервис для безупречных путешествий.
            </p>
          </div>

          {/* Интерактивная панель поиска */}
          <MainSearchPanel />
        </div>
      </section>

      {/* === ПОПУЛЯРНЫЕ НАПРАВЛЕНИЯ === */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">Популярные направления</h2>
          <p className="text-zinc-500 text-sm">Места, которые чаще всего выбирают наши clients</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCities.map((city) => (
            <Link 
              key={city.name}
              href={`/hotels?city=${encodeURIComponent(city.name)}`}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 block"
            >
              {/* Заменено на Next.js Image с проксированием */}
              <Image 
                src={`https://images.unsplash.com/photo-${city.imgId}?q=80&w=600&auto=format&fit=crop`}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-10" />
              <div className="absolute bottom-5 left-5 text-white z-10">
                <h3 className="text-lg font-bold tracking-tight">{city.name}</h3>
                <p className="text-xs text-zinc-200/80 mt-0.5">Смотреть отели →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === РЕКОМЕНДУЕМЫЕ ОТЕЛИ === */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">Рекомендованные отели</h2>
            <p className="text-zinc-500 text-sm">Высшая оценка по отзывам и качеству сервиса</p>
          </div>
          <Link href="/hotels" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors hidden sm:block">
            Смотреть все предложения →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/60 hover:shadow-xl hover:border-zinc-300/80 transition-all duration-300 relative text-left"
            >
              
              {/* Картинка отеля */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                {/* Заменено на Next.js Image для картинок из БД */}
                <Image 
                  src={hotel.image} 
                  alt={hotel.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-950 shadow-xs flex items-center gap-1 z-10">
                  ★ {hotel.rating.toFixed(1)}
                </div>
              </div>

              {/* Контентная часть */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block">
                    {hotel.city}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {hotel.name}
                  </h3>
                </div>
                
                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed flex-grow">
                  {hotel.description}
                </p>

                {/* Нижняя часть */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xs text-zinc-400 block">Городской отель</span>
                    <span className="text-base font-extrabold text-zinc-900">Premium класс</span>
                  </div>
                  
                  <Link 
                    href={`/hotels/${hotel.id}`} 
                    className="inline-flex items-center justify-center bg-zinc-900 group-hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 after:absolute after:inset-0 after:z-10"
                  >
                    Номера
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}