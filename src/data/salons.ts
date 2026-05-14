// src/data/salons.ts

export interface Salon {
  id: number;
  name: string;
  address: string;
  colony: string;
  city: string;
  state: string;
  phone?: string;
  featured?: boolean;
  services?: string[];
  horario?: string;
  lat: number;
  lng: number;
}

export const salons: Salon[] = [
    {
    id: 1,
    name: "Beauty Style by: Diana Cepeda",
    address: "Blvd. Pedro Figueroa 7",
    colony: "Real de Peña",
    city: "Saltillo",
    state: "Coahuila",
    phone: "8448701029",
    featured: true,
    services: [
      "Diagnóstico capilar",
      "Aplicación AVYNA",
      "Venta de productos"
    ],
    horario: "Lunes a viernes: 9:00 - 20:00, Sábados: 10:00 - 18:00",
    lat: 25.4710530257737, 
    lng: -100.97634111762014,
  },
  {
    id: 2,
    name: "MVM Salón",
    address: "Pavo Real 120",
    colony: "Las Maravillas",
    city: "Saltillo",
    state: "Coahuila",
    phone: "8443001150",
    featured: true,
    services: [
      "Diagnóstico capilar",
      "Aplicación AVYNA",
      "Venta de productos"
    ],
    horario: "Lunes a viernes: 9:00 - 20:00, Sábados: 10:00 - 18:00",
    lat: 25.42409057964763, 
    lng: -100.95813480781234,
  },
 
];