import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding demo data...');

  let admin = await prisma.usuario.findUnique({ where: { email: 'admin@mapas.com' } });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    admin = await prisma.usuario.create({
      data: {
        nombre: 'Admin Demo',
        email: 'admin@mapas.com',
        password: hashedPassword,
        rol: 'admin'
      }
    });
    console.log('Admin user created.');
  }

  const demoPlaces = [
    {
      nombre: 'Café de Especialidad "El Origen"',
      descripcion: 'Café de granos locales, mesas tranquilas y panadería artesanal para estudiar o trabajar.',
      latitud: 4.3928,
      longitud: -76.0701,
      direccion: 'Av. Libertador 1234, Barrio Norte',
      horario: '08:00 - 20:00',
      telefono: '+57 300 123 4567',
      categoria: 'Cafetería'
    },
    {
      nombre: 'Parque Central',
      descripcion: 'Espacio verde amplio con senderos, sombra y zonas para caminar al atardecer.',
      latitud: 4.3945,
      longitud: -76.0731,
      direccion: 'Calle 12 con Carrera 10',
      horario: '05:30 - 22:00',
      telefono: null,
      categoria: 'Parque'
    },
    {
      nombre: 'Museo de la Memoria',
      descripcion: 'Un recorrido íntimo por la historia local con salas inmersivas y visitas guiadas.',
      latitud: 4.3898,
      longitud: -76.0686,
      direccion: 'Cra 8 # 11-20',
      horario: '10:00 - 18:30',
      telefono: '+57 320 555 8899',
      categoria: 'Cultura'
    },
    {
      nombre: 'Tienda del Barrio',
      descripcion: 'Una tienda de paso con café, bocadillos y todo lo básico para la ruta diaria.',
      latitud: 4.3914,
      longitud: -76.0752,
      direccion: 'Diagonal 4 con Calle 6',
      horario: '07:00 - 21:30',
      telefono: '+57 301 444 7766',
      categoria: 'Tienda'
    }
  ];

  const CATEGORIAS_DEFAULT = {
    cafeteria: { icono: '☕', color: '#7c3aed' },
    parque:    { icono: '🌳', color: '#16a34a' },
    cultura:   { icono: '🎭', color: '#db2777' },
    tienda:    { icono: '🛍️', color: '#0284c7' },
  };

  for (const p of demoPlaces) {
    const exists = await prisma.lugar.findFirst({ where: { nombre: p.nombre } });
    if (!exists) {
      const slug = p.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const defaults = CATEGORIAS_DEFAULT[slug] || { icono: '📍', color: '#0050cb' };

      let cat = await prisma.categoria.findUnique({ where: { slug } });
      if (!cat) {
        cat = await prisma.categoria.create({
          data: { nombre: p.categoria, slug, icono: defaults.icono, color: defaults.color },
        });
      }

      await prisma.lugar.create({
        data: {
          nombre: p.nombre,
          descripcion: p.descripcion,
          latitud: p.latitud,
          longitud: p.longitud,
          direccion: p.direccion,
          horario: p.horario,
          telefono: p.telefono,
          categoriaId: cat.id,
          creadorId: admin.id,
          puntuacionPromedio: parseFloat((Math.random() * (5 - 4) + 4).toFixed(1)),
          totalResenas: Math.floor(Math.random() * 100) + 10
        }
      });
      console.log(`Created place: ${p.nombre}`);
    }
  }
  
  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
