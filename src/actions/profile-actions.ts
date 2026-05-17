// src/actions/profile-actions.ts
'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateProfileData(formData: { firstName: string; lastName: string }) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Неавторизованный доступ');
  }

  const userId = (session.user as any).id;
  const { firstName, lastName } = formData;

  if (!firstName.trim() || !lastName.trim()) {
    throw new Error('Имя и фамилия не могут быть пустыми');
  }

  // Обновляем данные пользователя в базе данных
  await db.user.update({
    where: { id: userId },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    },
  });

  // Мгновенно сбрасываем кэш, чтобы новые данные подтянулись везде
  revalidatePath('/profile');
}