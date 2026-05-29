export const FALLBACK_CENTER = { lat: 4.392, lng: -76.071 };

export const CATEGORY_OPTIONS = [
  'Todos',
  'Restaurante',
  'Cafetería',
  'Parque',
  'Cultura',
  'Tienda',
  'Servicio',
  'Turismo',
];

export const CATEGORY_META = {
  Todos: { label: 'Todo', icon: '✦', color: '#0050cb' },
  Restaurante: { label: 'Restaurante', icon: '🍴', color: '#FF6B35' },
  Cafetería: { label: 'Cafetería', icon: '☕', color: '#7c3aed' },
  Parque: { label: 'Parque', icon: '🌳', color: '#16a34a' },
  Cultura: { label: 'Cultura', icon: '🎭', color: '#db2777' },
  Tienda: { label: 'Tienda', icon: '🛍️', color: '#0284c7' },
  Servicio: { label: 'Servicio', icon: '🛠️', color: '#f59e0b' },
  Turismo: { label: 'Turismo', icon: '🏛️', color: '#0f766e' },
  General: { label: 'General', icon: '📍', color: '#0050cb' },
};

export const DEMO_PLACES = [
  {
    id: 'demo-cafe-origen',
    nombre: 'Café de Especialidad "El Origen"',
    descripcion:
      'Café de granos locales, mesas tranquilas y panadería artesanal para estudiar o trabajar.',
    latitud: 4.3928,
    longitud: -76.0701,
    direccion: 'Av. Libertador 1234, Barrio Norte',
    horario: '08:00 - 20:00',
    telefono: '+57 300 123 4567',
    categoria: 'Cafetería',
    categoriaIcono: '☕',
    categoriaColor: '#7c3aed',
    puntuacionPromedio: 4.8,
    totalResenas: 128,
  },
  {
    id: 'demo-parque-central',
    nombre: 'Parque Central',
    descripcion:
      'Espacio verde amplio con senderos, sombra y zonas para caminar al atardecer.',
    latitud: 4.3945,
    longitud: -76.0731,
    direccion: 'Calle 12 con Carrera 10',
    horario: '05:30 - 22:00',
    telefono: null,
    categoria: 'Parque',
    categoriaIcono: '🌳',
    categoriaColor: '#16a34a',
    puntuacionPromedio: 4.6,
    totalResenas: 84,
  },
  {
    id: 'demo-museo-memoria',
    nombre: 'Museo de la Memoria',
    descripcion:
      'Un recorrido íntimo por la historia local con salas inmersivas y visitas guiadas.',
    latitud: 4.3898,
    longitud: -76.0686,
    direccion: 'Cra 8 # 11-20',
    horario: '10:00 - 18:30',
    telefono: '+57 320 555 8899',
    categoria: 'Cultura',
    categoriaIcono: '🎭',
    categoriaColor: '#db2777',
    puntuacionPromedio: 4.9,
    totalResenas: 62,
  },
  {
    id: 'demo-tienda-barrio',
    nombre: 'Tienda del Barrio',
    descripcion:
      'Una tienda de paso con café, bocadillos y todo lo básico para la ruta diaria.',
    latitud: 4.3914,
    longitud: -76.0752,
    direccion: 'Diagonal 4 con Calle 6',
    horario: '07:00 - 21:30',
    telefono: '+57 301 444 7766',
    categoria: 'Tienda',
    categoriaIcono: '🛍️',
    categoriaColor: '#0284c7',
    puntuacionPromedio: 4.3,
    totalResenas: 41,
  },
];

export const DEMO_REVIEWS = [
  {
    id: 'review-1',
    author: 'Lucía M.',
    date: 'Hace 2 días',
    rating: 5,
    body:
      'El flat white es espectacular y la atención es rápida. Ideal para llegar temprano y trabajar un rato.',
    helpful: 12,
  },
  {
    id: 'review-2',
    author: 'Martín R.',
    date: 'Hace 1 semana',
    rating: 4,
    body:
      'Muy buen lugar para reunirse. El ambiente es relajado y siempre hay algo nuevo para probar.',
    helpful: 5,
  },
  {
    id: 'review-3',
    author: 'Daniela P.',
    date: 'Hace 3 semanas',
    rating: 5,
    body:
      'Me gusta porque mezcla mapa, reseñas y descubrimiento visual. Se siente ágil desde el móvil.',
    helpful: 9,
  },
];

export const DEMO_GALLERY = [
  {
    title: 'Barra principal',
    subtitle: 'Luz cálida y espresso bar',
    accent: 'from-sky-500 to-indigo-600',
    icon: '☕',
  },
  {
    title: 'Mesas tranquilas',
    subtitle: 'Ideal para trabajar',
    accent: 'from-emerald-500 to-teal-600',
    icon: '🪑',
  },
  {
    title: 'Pastelería',
    subtitle: 'Productos del día',
    accent: 'from-amber-500 to-orange-600',
    icon: '🥐',
  },
  {
    title: 'Vista urbana',
    subtitle: 'Hecho para explorar',
    accent: 'from-fuchsia-500 to-violet-600',
    icon: '🗺️',
  },
];
