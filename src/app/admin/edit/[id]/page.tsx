// src/app/admin/edit/[id]/page.tsx
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditHotelForm from '@/components/EditHotelForm';
import { auth } from '@/auth';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: EditPageProps) {
  const { id } = await params;
  const session = await auth();
  
  // Дополнительная проверка безопасности на уровне сервера страницы
  if ((session?.user as any)?.role !== 'ADMIN') {
    return <div className="text-center py-20 font-bold">Доступ запрещен</div>;
  }

  // Загружаем отель вместе с его текущими комнатами
  const hotel = await db.hotel.findUnique({
    where: { id },
    include: { rooms: true }
  });

  if (!hotel) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Редактирование отеля</h1>
        <p className="text-zinc-500 text-sm mt-1">Изменение информации об отеле и полное обновление сетки номеров</p>
      </div>

      {/* Передаем чистые данные из базы в клиентскую форму */}
      <EditHotelForm hotel={hotel} />
    </div>
  );
}