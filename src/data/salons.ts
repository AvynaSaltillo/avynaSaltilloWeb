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
  {
    id: 3,
    name: "Geminisse Salón",
    address: "C. Xicoténcatl 396",
    colony: "Zona Centro",
    city: "Saltillo",
    state: "Coahuila",
    phone: "8443001150",
    services: [
      "Diagnóstico capilar",
      "Aplicación AVYNA",
      "Venta de productos"
    ],
    horario: "Lunes a viernes: 9:00 - 20:00, Sábados: 10:00 - 18:00",
    lat: 25.420905,
    lng: -101.007127
  },
  { 
    id: 4,
    name: "Diosas Salón",
    address: "Calle San José de los Cerritos 100, Plaza Patio",
    colony: "Ex-hacienda",
    city: "Saltillo",
    state: "Coahuila",
    lat: 25.44463584122333, 
    lng: -100.96008321561396
  },
  {
    id: 5,
    name: "Francisco Salón",
    address: "Calle Manuel Pérez Treviño 585",
    colony: "Zona Centro",
    city: "Saltillo",
    state: "Coahuila",
    lat: 25.426176396762862, 
    lng: -101.00381385734025
  }

];