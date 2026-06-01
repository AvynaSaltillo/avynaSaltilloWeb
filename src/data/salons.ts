// src/data/salons.ts

export interface Salon {
  id: number;

  name: string;
  owner: string;

  address: string;
  colony: string;

  city: string;
  state: string;

  phone?: string;

  featured?: boolean;

  level?: "partner" | "select";

  approved?: boolean;

  stockLevel?: number;

  quizApproved?: boolean;

  image?: string;

  mapsUrl?: string;

  instagram?: string;

  specialties?: string[];

  services?: string[];

  horario?: string;

  lat: number;
  lng: number;
}

export const salons: Salon[] = [
    {
  id: 1,
  name: "Beauty Style",
  owner: "Diana Cepeda Carrizales", 
  address: "Blvd. Pedro Figueroa 7",
  colony: "Real de Peña",
  city: "Saltillo",
  state: "Coahuila",
  phone: "8448701029",
  featured: true,
  level: "select",
  approved: true,
  stockLevel: 8500,
  quizApproved: true,
  image: "/images/salons/beauty-style.jpg",
  mapsUrl:
    "https://maps.google.com/?q=25.4710530257737,-100.97634111762014",
  instagram:
    "https://instagram.com/beautystyle",
  specialties: [
    "Cabello dañado",
    "Coloración",
    "Hidratación"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación de tintes",
    "Diseño de color"
  ],
  horario:
    "Lunes a viernes: 10:00 AM - 7:00 PM, Sábado: 10:00 AM - 5:00 PM",
  lat: 25.4710530257737,
  lng: -100.97634111762014,
},
{
  id: 2,
  name: "MVM Salón",
  owner: "David Zapata",
  address: "Pavo Real 120",
  colony: "Las Maravillas",
  city: "Saltillo",
  state: "Coahuila",
  phone: "528443001150",
  featured: true,
  level: "partner",
  approved: true,
  stockLevel: 7000,
  quizApproved: true,
  image: "/images/salons/mvm.jpg",
  mapsUrl:
    "https://maps.google.com/?q=25.42409057964763,-100.95813480781234",
  instagram:
    "https://instagram.com/mvmsalon",
  specialties: [
    "Cabello procesado",
    "Hidratación",
    "Coloración"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Mediante cita previa",
  lat: 25.42409057964763,
  lng: -100.95813480781234,
},

{
  id: 3,
  name: "MVM Salón",
  owner: "David Zapata",
  address: "Pavo Real 120",
  colony: "Las Maravillas",
  city: "Saltillo",
  state: "Coahuila",
  phone: "528443001150",
  featured: true,
  level: "partner",
  approved: true,
  stockLevel: 7000,
  quizApproved: true,
  image: "/images/salons/mvm.jpg",
  mapsUrl:
    "https://maps.google.com/?q=25.42409057964763,-100.95813480781234",
  instagram:
    "https://instagram.com/mvmsalon",
  specialties: [
    "Cabello procesado",
    "Hidratación",
    "Coloración"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Mediante cita previa",
  lat: 25.42409057964763,
  lng: -100.95813480781234,
},
 
];