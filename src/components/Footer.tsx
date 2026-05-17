// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm">
        <div className="space-y-4">
          <div className="text-lg font-bold text-zinc-900">HotelSpace</div>
          <p className="text-zinc-500 leading-relaxed">
            Бронирование премиального уровня. Только проверенные отели.
          </p>
        </div>
      </div>
    </footer>
  );
}