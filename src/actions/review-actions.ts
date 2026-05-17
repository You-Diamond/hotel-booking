// src/actions/review-actions.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createReview(hotelId: string, formData: FormData) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw new Error('Вы должны быть авторизованы, чтобы оставить отзыв');
  }

  const rating = parseInt(formData.get('rating') as string);
  const text = formData.get('text') as string;

  if (!rating || !text) {
    throw new Error('Заполните все поля отзыва');
  }

  // Используем хак с (db as any), чтобы TypeScript пропустил строку, 
  // пока мы не обновим клиент Prisma в следующем шаге
  await (db as any).review.create({
    data: {
      rating,
      text,
      userId,
      hotelId,
    },
  });

  // Тянем все отзывы для пересчета
  const allReviews = await (db as any).review.findMany({
    where: { hotelId },
    select: { rating: true },
  });

  // Явно типизируем sum и item как number
  const totalRating = allReviews.reduce((sum: number, item: { rating: number }) => sum + item.rating, 0);
  const averageRating = allReviews.length > 0 ? parseFloat((totalRating / allReviews.length).toFixed(1)) : 5;

  // Обновляем рейтинг отеля
  await db.hotel.update({
    where: { id: hotelId },
    data: { rating: averageRating },
  });

  revalidatePath(`/hotels/${hotelId}`);
}