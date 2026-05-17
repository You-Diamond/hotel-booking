// src/components/ReviewForm.tsx
'use client';

import { useState, useRef } from 'react';
import { createReview } from '@/actions/review-actions';

interface ReviewFormProps {
  hotelId: string;
  isLoggedIn: boolean;
}

export default function ReviewForm({ hotelId, isLoggedIn }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!isLoggedIn) {
    return (
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center text-sm text-zinc-500 font-medium">
        Войдите в аккаунт, чтобы оставить отзыв об этом отеле.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());

    try {
      await createReview(hotelId, formData);
      formRef.current?.reset();
      setRating(5);
    } catch (error: any) {
      alert(error.message || 'Ошибка при отправке');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-xs">
      <h3 className="text-base font-bold text-zinc-900 tracking-tight">Оставить отзыв</h3>
      
      {/* Выбор рейтинга звездами */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Ваша оценка</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-xl focus:outline-none transition-transform active:scale-90 cursor-pointer"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      {/* Текст отзыва */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Комментарий</label>
        <textarea
          name="text"
          required
          rows={3}
          placeholder="Поделитесь впечатлениями об отеле и сервисе..."
          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {isPending ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
}