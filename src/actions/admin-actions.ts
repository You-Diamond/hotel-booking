// src/actions/admin-actions.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Интерфейс для динамических комнат
interface RoomInput {
  name: string;
  capacity: number;
  pricePerNight: number;
}

// Вспомогательная проверка прав администратора
async function checkAdminAccess() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  if (userRole !== 'ADMIN') {
    throw new Error('Доступ запрещен: требуется роль администратора');
  }
}

/**
 * 1. Создание отеля с любым количеством комнат
 */
export async function createHotelWithRooms(hotelData: {
  name: string;
  city: string;
  description: string;
  image: string;
  rooms: RoomInput[];
}) {
  await checkAdminAccess();

  const { name, city, description, image, rooms } = hotelData;

  if (!name || !city || !description || !image || !rooms || rooms.length === 0) {
    throw new Error('Пожалуйста, заполните все поля и добавьте хотя бы один номер');
  }

  await db.hotel.create({
    data: {
      name,
      city,
      description,
      image,
      rating: 5.0,
      rooms: {
        create: rooms.map(room => ({
          name: room.name,
          capacity: Number(room.capacity),
          pricePerNight: Number(room.pricePerNight),
        }))
      }
    }
  });

  revalidatePath('/hotels');
  redirect('/hotels');
}

/**
 * 2. Редактирование существующего отеля и его комнат
 */
export async function updateHotelByAdmin(
  hotelId: string,
  hotelData: {
    name: string;
    city: string;
    description: string;
    image: string;
    rooms: RoomInput[];
  }
) {
  await checkAdminAccess();

  const { name, city, description, image, rooms } = hotelData;

  if (!name || !city || !description || !image || !rooms || rooms.length === 0) {
    throw new Error('Пожалуйста, заполните все поля');
  }

  // Транзакция: обновляем отель и перезаписываем список комнат
  await db.$transaction([
    // Удаляем старые категории комнат отеля
    db.room.deleteMany({
      where: { hotelId }
    }),
    // Обновляем параметры отеля и заливаем новые категории номеров
    db.hotel.update({
      where: { id: hotelId },
      data: {
        name,
        city,
        description,
        image,
        rooms: {
          create: rooms.map(room => ({
            name: room.name,
            capacity: Number(room.capacity),
            pricePerNight: Number(room.pricePerNight),
          }))
        }
      }
    })
  ]);

  revalidatePath('/hotels');
  revalidatePath(`/hotels/${hotelId}`);
  redirect('/hotels');
}

/**
 * 3. Удаление модератором некорректных отзывов
 */
export async function deleteReviewByAdmin(reviewId: string, hotelId: string) {
  await checkAdminAccess();

  // Приводим db к типу any, чтобы обойти ошибку генерации типов модели Review
  const prismaExtended = db as any;

  // 1. Удаляем сам отзыв
  await prismaExtended.review.delete({
    where: { id: reviewId }
  });

  // 2. Достаем оставшиеся отзывы для пересчета рейтинга
  const remainingReviews = await prismaExtended.review.findMany({
    where: { hotelId },
    select: { rating: true }
  });

  // 3. Высчитываем новый средний рейтинг (добавили типы : number и : any для sum и item)
  let averageRating = 5.0;
  if (remainingReviews.length > 0) {
    const totalRating = remainingReviews.reduce((sum: number, item: any) => sum + item.rating, 0);
    averageRating = parseFloat((totalRating / remainingReviews.length).toFixed(1));
  }

  // 4. Записываем обновленный рейтинг в карточку отеля
  await db.hotel.update({
    where: { id: hotelId },
    data: { rating: averageRating }
  });

  // Сбрасываем кэш страниц, чтобы изменения применились мгновенно
  revalidatePath(`/hotels/${hotelId}`);
  revalidatePath('/hotels');
}