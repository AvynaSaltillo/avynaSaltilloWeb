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

  facebook?: string;

  specialties?: string[];

  services?: string[];

  horario?: string;

  lat: number;
  lng: number;
}

export const salons: Salon[] = [
  // Diana Cepeda Carrizales - Beauty Style
{
  id: 1,
  name: "Beauty Style",
  owner: "Diana Cepeda Carrizales", 
  address: "Blvd. Pedro Figueroa 7",
  colony: "Real de Peña",
  city: "Saltillo",
  state: "Coahuila",
  phone: "528448701029",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 30000,
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

// Maribel Reyes Pérez - Marybell Estética
{
  id: 2,
  name: "Marybell Estética",
  owner: "Maribel Reyes Pérez",
  address: "Av. Nogales 685",
  colony: "Los Nogales II",
  city: "Saltillo",
  state: "Coahuila",
  phone: "528441397999",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 45000,
  quizApproved: true,
  image: "/images/salons/marybell.png",
  mapsUrl:
    "https://maps.google.com/?q=25.39867160420586,-100.96855508858582",
  instagram:
    "https://www.instagram.com/marybell_estetica/",
  specialties: [
    "Diseño de color",
    "Tratamientos capilares",
    "Cortes de cabello"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Lunes a sábado: 10:00 AM - 8:00 PM",
  lat: 25.39867160420586,
  lng: -100.96855508858582,
},

// David Zapata - MVM Salón
{
  id: 3,
  name: "MVM Salón",
  owner: "David Zapata",
  address: "Pavo Real 120",
  colony: "Las Maravillas",
  city: "Saltillo",
  state: "Coahuila",
  phone: "528443001150",
  featured: false,
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

// Jorge Ventura - Hair -Salon Jorge Ventura
{
  id: 4,
  name: "Hair -Salon Jorge Ventura",
  owner: "Jorge Ventura",
  address: "Hidalgo 2415",
  colony: "República Norte, 25280",
  city: "Saltillo",
  state: "Coahuila",
  phone: "52⁠8441276955",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 8500,
  quizApproved: true,
  image: "/images/salons/jorgeventura.jpeg",
  mapsUrl:
    "https://maps.google.com/?q=25.44194467987081,-100.98844649043895",
  instagram:
    "https://www.instagram.com/hair_salon_jv",
  specialties: [
    "Diseño de color",
    "Tratamientos capilares",
    "Cortes de cabello"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Lunes a Viernes: 9:00 AM - 7:00 PM, Sábado: 9:00 AM - 6:00 PM",
  lat: 25.44194467987081,
  lng:  -100.98844649043895,
},

// Debani López - Atelier de Estilo
{
  id: 5,
  name: "Atelier de Estilo",
  owner: "Debani López",
  address: "Blvrd Mirasierra 65",
  colony: "Cd Mirasierra, 25016",
  city: "Saltillo",
  state: "Coahuila",
  phone: "52⁠8445053192",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 5000,
  quizApproved: true,
  image: "/images/salons/debani.jpg",
  mapsUrl:
    "https://maps.google.com/?q=25.428963978763253,-100.92419799946278",
  facebook:
    "https://www.facebook.com/debanitukitukituki.lopez/",
  specialties: [
    "Diseño de color",
    "Tratamientos capilares",
    "Cortes de cabello"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Lunes a Sábado 10:00 AM - 12:00 PM y 2:00 PM - 8:00 PM",
  lat: 25.428963978763253,
  lng:  -100.92419799946278,
},

// Martha Cardoso - Estética Geminesse
{
  id: 5,
  name: "Estética Geminesse",
  owner: "Martha Eugenia Cardoso Aguirre",
  address: "Xicoténcatl 396",
  colony: "Zona Centro, 25000",
  city: "Saltillo",
  state: "Coahuila",
  phone: "52⁠8443470627",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 4500,
  quizApproved: true,
  image: "/images/salons/martha.JPG",
  mapsUrl:
    "https://maps.google.com/?q=25.421013678090144,-101.00723595974875",
  instagram:
    "https://www.instagram.com/esteticageminesse/",
  specialties: [
    "Diseño de color",
    "Tratamientos capilares",
    "Cortes de cabello"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Lunes a Sábado 9:00 AM - 8:00 PM",
  lat: 25.421013678090144,
  lng:  -101.00723595974875,
},

  // Querén González - Scrunchies Ponchis
{
  id: 6,
  name: "Scrunchies Ponchis",
  owner: "Querén González",
  address: "U. de Zacatecas 148",
  colony: "Villa Universidad, 25069",
  city: "Saltillo",
  state: "Coahuila",
  phone: "52⁠8448816047",
  featured: false,
  level: "select",
  approved: true,
  stockLevel: 4500,
  quizApproved: true,
  image: "/images/salons/queren.jpeg",
  mapsUrl:
    "https://maps.google.com/?q=25.388605072946252,-100.99096454871277",
  instagram:
    "https://www.instagram.com/scrunchiesponchis/",
  specialties: [
    "Diseño de color",
    "Tratamientos capilares",
    "Cortes de cabello"
  ],
  services: [
    "Diagnóstico capilar",
    "Aplicación AVYNA",
    "Venta de productos"
  ],
  horario:
    "Lunes a Sábado 9:00 AM - 8:00 PM",
  lat: 25.388605072946252,
  lng:  -100.99096454871277,
},

];