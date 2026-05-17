// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очищаем старые данные, чтобы не было дублей
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  console.log('🔄 Начинаем масштабное наполнение базы данных...');

  const hotelsData = [
    {
      name: 'Гранд Отель Москва',
      city: 'Москва',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      description: 'Премиальный отель в самом сердце столицы с видом на Кремль, роскошным спа-комплексом и рестораном Мишлен.',
      rooms: [
        { name: 'Стандартный двухместный номер', pricePerNight: 8500, capacity: 2 },
        { name: 'Улучшенный купеческий люкс', pricePerNight: 14500, capacity: 2 },
        { name: 'Президентский апартамент', pricePerNight: 45000, capacity: 4 },
      ]
    },
    {
      name: 'Сочи Резорт & Спа',
      city: 'Сочи',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
      description: 'Идеальное место для отдыха на первой линии побережья Черного моря. Собственный пляж и огромный подогреваемый бассейн.',
      rooms: [
        { name: 'Семейный номер с видом на море', pricePerNight: 12000, capacity: 4 },
        { name: 'Бунгало у бассейна', pricePerNight: 22000, capacity: 2 },
        { name: 'Эконом стандарт (мансарда)', pricePerNight: 6000, capacity: 2 },
      ]
    },
    {
      name: 'Питер Отель Фонтанка',
      city: 'Санкт-Петербург',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
      description: 'Атмосферный отель в историческом здании на набережной. Высокие потолки, старинная лепнина и разводные мосты в пешей доступности.',
      rooms: [
        { name: 'Одноместный сингл для путешественников', pricePerNight: 4500, capacity: 1 },
        { name: 'Двухместный лофт с камином', pricePerNight: 9000, capacity: 2 },
        { name: 'Семейный семейный люкс', pricePerNight: 16000, capacity: 5 },
      ]
    },
    {
      name: 'Казань Палас',
      city: 'Казань',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
      description: 'Современный технологичный отель недалеко от Казанского Кремля. Идеально подходит как для туристов, так и для бизнес-поездок.',
      rooms: [
        { name: 'Бизнес Стандарт смарт-бокс', pricePerNight: 5500, capacity: 2 },
        { name: 'Студия с мини-кухней', pricePerNight: 8000, capacity: 3 },
      ]
    },
    {
      name: 'Алтай Резорт Сибирь',
      city: 'Алтай',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
      description: 'Эко-отель из кедрового сруба среди вековых сосен и заснеженных гор. Единение с природой без отказа от пятизвездочного комфорта.',
      rooms: [
        { name: 'Шале у горной реки', pricePerNight: 25000, capacity: 4 },
        { name: 'Панорамный купол для двоих', pricePerNight: 19000, capacity: 2 },
      ]
    },
    {
      name: 'Калининград Амбер Отель',
      city: 'Калининград',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop',
      description: 'Уютный отель в немецком стиле на берегу Балтийского моря. Свежий морской бриз и пешие прогулки по Куршской косе.',
      rooms: [
        { name: 'Стандарт в европейском стиле', pricePerNight: 6500, capacity: 2 },
        { name: 'Люкс с террасой', pricePerNight: 11000, capacity: 2 },
      ]
    }
  ];

  for (const hotel of hotelsData) {
    await prisma.hotel.create({
      data: {
        name: hotel.name,
        city: hotel.city,
        rating: hotel.rating,
        image: hotel.image,
        description: hotel.description,
        rooms: {
          create: hotel.rooms
        }
      }
    });
  }

  console.log('✅ База Neon успешно наполнена разнообразными данными!');
  console.log(`Создано отелей: ${hotelsData.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });