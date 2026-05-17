// src/app/profile/page.tsx
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cancelBooking } from '@/actions/booking-actions';
import ProfileDashboard from '@/components/ProfileDashboard';

export default async function ProfilePage() {
  // 1. Проверяем сессию пользователя на сервере
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const userId = (session.user as any).id;

  // 2. Достаем свежие данные о пользователе напрямую из Neon PostgreSQL
  const dbUser = await db.user.findUnique({
    where: { id: userId }
  });

  if (!dbUser) {
    redirect('/auth/login');
  }

  // 3. Загружаем реальные бронирования текущего пользователя из базы
  const realBookings = await db.booking.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  });

  // Рассчитываем статистику расходов (только для активных броней)
  const activeBookings = realBookings.filter(b => b.status === 'active');
  const totalSpent = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // Обертка для вызова Server Action из клиентского компонента
  async function handleCancelBooking(bookingId: string) {
    'use server';
    await cancelBooking(bookingId);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <ProfileDashboard 
        user={{
          id: dbUser.id,
          firstName: dbUser.firstName || 'Имя',
          lastName: dbUser.lastName || 'Фамилия',
          email: dbUser.email || '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          joinedDate: 'май 2026',
          role: dbUser.role, // <-- Теперь это поле легально и типизировано!
        }}
        realBookings={realBookings}
        activeBookingsCount={activeBookings.length}
        totalSpent={totalSpent}
        cancelBookingAction={handleCancelBooking}
      />
    </div>
  );
}