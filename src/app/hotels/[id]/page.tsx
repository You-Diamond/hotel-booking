// src/app/hotels/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import RoomCard from '@/components/RoomCard';
import ReviewForm from '@/components/ReviewForm';
import { auth } from '@/auth';

interface HotelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  
  // Проверяем, является ли текущий пользователь администратором
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  // Загружаем отель, его комнаты и отзывы вместе с именами авторов
  const hotel = await db.hotel.findUnique({
    where: { id },
    include: { 
      rooms: true,
      reviews: {
        include: {
          user: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as any;

  if (!hotel) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      
      {/* Upper panel */}
      <div className="flex items-center justify-between">
        <Link href="/hotels" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors inline-flex items-center gap-2">
          ← Назад к списку отелей
        </Link>

        {/* === КНОПКА РЕДАКТИРОВАНИЯ ДЛЯ АДМИНИСТРАТОРА === */}
        {isAdmin && (
          <Link 
            href={`/admin/edit/${hotel.id}`}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            ✏️ Редактировать этот отель
          </Link>
        )}
      </div>

      {/* Блок отеля */}
      <div className="space-y-6">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/50">
          {/* Заменено на Next.js Image */}
          <Image 
            src={hotel.image} 
            alt={hotel.name} 
            fill
            priority // Страница детальная, загружаем картинку в первую очередь
            sizes="(max-width: 1200px) 100vw, 1024px"
            className="object-cover" 
          />
          <span className="absolute top-6 left-6 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl text-sm font-black text-zinc-900 shadow-md z-10">
            ⭐ {hotel.rating}
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md inline-block">
            {hotel.city}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{hotel.name}</h1>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-3xl">{hotel.description}</p>
        </div>
      </div>

      <div className="h-px bg-zinc-200/80" />

      {/* Номера */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight">Доступные категории номеров</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotel.rooms.map((room: any) => (
            <RoomCard 
              key={room.id} 
              hotelId={hotel.id} 
              room={{ 
                id: room.id, 
                name: room.name, 
                capacity: room.capacity, 
                pricePerNight: room.pricePerNight 
              }} 
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-zinc-200/80" />

      {/* === СЕКЦИЯ ОТЗЫВОВ === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Левая колонка: форма */}
        <div className="md:col-span-1">
          <ReviewForm hotelId={hotel.id} isLoggedIn={!!session?.user} />
        </div>

        {/* Правая колонка: лента отзывов */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            Отзывы гостей ({hotel.reviews.length})
          </h2>

          {hotel.reviews.length === 0 ? (
            <p className="text-sm text-zinc-400 font-medium bg-zinc-50 border border-zinc-100 rounded-2xl p-8 text-center">
              У этого отеля пока нет отзывов. Станьте первым!
            </p>
          ) : (
            <div className="space-y-4">
              {hotel.reviews.map((review: any) => (
                <div key={review.id} className="bg-zinc-50/60 border border-zinc-200/60 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-800">
                      👤 {review.user.firstName} {review.user.lastName}
                    </span>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-amber-500 font-bold">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>

                      {/* === КНОПКА УДАЛЕНИЯ ДЛЯ АДМИНИСТРАТОРА === */}
                      {isAdmin && (
                        <form action={async () => {
                          'use server';
                          const { deleteReviewByAdmin } = await import('@/actions/admin-actions');
                          await deleteReviewByAdmin(review.id, hotel.id);
                        }}>
                          <button 
                            type="submit" 
                            className="text-rose-500 hover:text-rose-700 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Удалить 🗑️
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm font-medium leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}