export interface Hotel {
  id: string;
  name: string;
  city: string;
  pricePerNight: number;
  rating: number;
  image: string;
  description: string;
}

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Гранд Отель Плаза',
    city: 'Москва',
    pricePerNight: 8500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
    description: 'Роскошный отель в самом центре города с видом на исторические достопримечательности.'
  },
  {
    id: '2',
    name: 'Уютный Берег',
    city: 'Сочи',
    pricePerNight: 5200,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60',
    description: 'Отель на первой береговой линии. Идеально подходит для семейного отдыха.'
  },
  {
    id: '3',
    name: 'Невский Экспресс Отель',
    city: 'Санкт-Петербург',
    pricePerNight: 4300,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60',
    description: 'Современный отель в стиле лофт в пешей доступности от метро и главных музеев.'
  },
  {
    id: '4',
    name: 'Горный Воздух Резорт',
    city: 'Сочи',
    pricePerNight: 12000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60',
    description: 'Премиум-отель в горах. Собственный спа-комплекс и панорамные бассейны.'
  }
];