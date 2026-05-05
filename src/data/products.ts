export type Product = {
  id: number;
  name: string;
  family: string;
  type: string;
  description: string;
  extra?: string;
  tag?: string;
  image: string;
  pricePublic?: number;
  priceSalon?: number;
  saving?: number;
};

export const products = [

  // ==================================================
  // DI ARGAN
  // ==================================================

{
  id: 1,
  name: "Shampoo Di Argan 250ml",
  family: "Argan",
  type: "Shampoo",
  description:
    "Tratamiento de nutrición intensa que lava eficaz y suavemente. Indicado para cabellos más deshidratados por su acción reconstructora y protectora.",
  tag: "",
  priceSalon: 171.5,
  pricePublic: 245,
  saving: 73.5,
  image: "/images/products/argan/argan-shampoo-250ml.png",
},

{
  id: 2,
  name: "Shampoo Di Argan 500ml",
  family: "Argan",
  type: "Shampoo",
  description:
    "Limpieza nutritiva con brillo superior. Ideal para mantenimiento frecuente en cabello seco y opaco.",
  tag: "",
  priceSalon: 227.5,
  pricePublic: 325,
  saving: 97.5,
  image: "/images/products/argan/argan-shampoo-500ml.png",
},

{
  id: 3,
  name: "Shampoo Di Argan 1000ml",
  family: "Argan",
  type: "Shampoo",
  description:
    "Formato profesional de alto rendimiento para salón. Nutre, limpia y protege la fibra capilar.",
  tag: "Pro",
  priceSalon: 357,
  pricePublic: 510,
  saving: 153,
  image: "/images/products/argan/argan-shampoo-1000ml.png",
},

{
  id: 4,
  name: "Maschera Di Argan 250ml",
  family: "Argan",
  type: "Mascarilla",
  description:
    "Tratamiento reparador intensivo ideal para cabellos opacos y deshidratados. Neutraliza radicales libres y aporta suavidad.",
  tag: "",
  priceSalon: 171.5,
  pricePublic: 245,
  saving: 73.5,
  image: "/images/products/argan/argan-maschera-250ml.png",
},

{
  id: 5,
  name: "Maschera Di Argan 500ml",
  family: "Argan",
  type: "Mascarilla",
  description:
    "Nutrición profunda con mayor rendimiento. Sella cutícula y mejora brillo inmediato.",
  tag: "",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/argan/argan-maschera-500ml.png",
},

{
  id: 6,
  name: "Maschera Di Argan 1000ml",
  family: "Argan",
  type: "Mascarilla",
  description:
    "Formato salón para protocolos intensivos de hidratación y reparación.",
  tag: "Pro",
  priceSalon: 343,
  pricePublic: 490,
  saving: 147,
  image: "/images/products/argan/argan-maschera-1000ml.png",
},

{
  id: 7,
  name: "Bifasico Di Argan 200ml",
  family: "Argan",
  type: "Leave In",
  description:
    "Tratamiento acondicionador instantáneo con acción hidratante y nutritiva. Enriquece el cabello con beneficios del Argán sin agregar peso.",
  tag: "Top",
  priceSalon: 234.5,
  pricePublic: 335,
  saving: 100.5,
  image: "/images/products/argan/argan-bifasico.png",
},

{
  id: 8,
  name: "Ricostruttore Di Argan 250ml",
  family: "Argan",
  type: "Reconstructor",
  description:
    "Tratamiento reparador instantáneo sin enjuague para cabellos muy secos y deshidratados. Nutre y repara la hebra capilar.",
  tag: "",
  priceSalon: 231,
  pricePublic: 330,
  saving: 99,
  image: "/images/products/argan/argan-ricostruttore.png",
},

{
  id: 9,
  name: "Fluido Di Argan 100ml",
  family: "Argan",
  type: "Sérum",
  description:
    "Tratamiento concentrado que previene puntas abiertas y envejecimiento capilar. Aporta brillo inmediato.",
  tag: "",
  priceSalon: 374.5,
  pricePublic: 535,
  saving: 160.5,
  image: "/images/products/argan/argan-fluido.png",
},

{
  id: 10,
  name: "Lisciante Di Argan 250ml",
  family: "Argan",
  type: "Protector Térmico",
  description:
    "Crema alisadora intensa para cabello rizado. Protege del calor de herramientas térmicas y controla humedad.",
  tag: "",
  priceSalon: 266,
  pricePublic: 380,
  saving: 114,
  image: "/images/products/argan/argan-lisciante-250ml.png",
},

{
  id: 11,
  name: "Lisciante Di Argan 1000ml",
  family: "Argan",
  type: "Protector Térmico",
  description:
    "Formato salón para brushing y secado profesional con protección térmica y brillo.",
  tag: "Pro",
  priceSalon: 721,
  pricePublic: 1030,
  saving: 309,
  image: "/images/products/argan/argan-lisciante-1000ml.png",
},

  // ==================================================
  // DI GOJI
  // ==================================================

{
  id: 12,
  name: "Shampoo Di Goji 250ml",
  family: "Goji",
  type: "Shampoo",
  description:
    "Especial para cabellos coloreados y decolorados. Lava suavemente mientras protege el color y aporta brillo.",
  tag: "",
  priceSalon: 161,
  pricePublic: 230,
  saving: 69,
  image: "/images/products/goji/goji-shampoo-250ml.png"
},

{
  id: 13,
  name: "Shampoo Di Goji 500ml",
  family: "Goji",
  type: "Shampoo",
  description:
    "Protección de color con mayor rendimiento para mantenimiento frecuente.",
  tag: "",
  priceSalon: 234.5,
  pricePublic: 335,
  saving: 100.5,
  image: "/images/products/goji/goji-shampoo-500ml.png"
},

{
  id: 14,
  name: "Shampoo Di Goji 1000ml",
  family: "Goji",
  type: "Shampoo",
  description:
    "Formato profesional para salón con protección intensa del color.",
  tag: "Pro",
  priceSalon: 364,
  pricePublic: 520,
  saving: 156,
  image: "/images/products/goji/goji-shampoo-1000ml.png"
},

{
  id: 15,
  name: "Maschera Di Goji 250ml",
  family: "Goji",
  type: "Mascarilla",
  description:
    "Tratamiento con enjuague que perfecciona procesos de coloración y sella la cutícula.",
  tag: "",
  priceSalon: 161,
  pricePublic: 230,
  saving: 69,
  image: "/images/products/goji/goji-maschera-250ml.png"
},

{
  id: 16,
  name: "Maschera Di Goji 500ml",
  family: "Goji",
  type: "Mascarilla",
  description:
    "Nutrición y brillo intenso para cabello teñido o decolorado.",
  tag: "",
  priceSalon: 238,
  pricePublic: 340,
  saving: 102,
  image: "/images/products/goji/goji-maschera-500ml.png"
},

{
  id: 17,
  name: "Maschera Di Goji 1000ml",
  family: "Goji",
  type: "Mascarilla",
  description:
    "Formato salón para tratamientos post-color y mantenimiento técnico.",
  tag: "Pro",
  priceSalon: 395.5,
  pricePublic: 565,
  saving: 169.5,
  image: "/images/products/goji/goji-maschera-1000ml.png"
},

{
  id: 18,
  name: "Bifasico Di Goji 200ml",
  family: "Goji",
  type: "Leave In",
  description:
    "Tratamiento ligero sin enjuague ideal para cabellos teñidos, tratados y delgados.",
  tag: "Top",
  priceSalon: 234.5,
  pricePublic: 335,
  saving: 100.5,
  image: "/images/products/goji/goji-bifasico.png"
},

{
  id: 19,
  name: "Ricostruttore Di Goji 250ml",
  family: "Goji",
  type: "Reconstructor",
  description:
    "Reparación instantánea sin enjuague para cabellos coloreados y estropeados.",
  tag: "",
  priceSalon: 231,
  pricePublic: 330,
  saving: 99,
  image: "/images/products/goji/goji-ricostruttore.png"
},

{
  id: 20,
  name: "Fluido Di Goji 100ml",
  family: "Goji",
  type: "Sérum",
  description:
    "Concentrado con propiedades del Goji. Suaviza, da brillo y mejora manejabilidad.",
  tag: "",
  priceSalon: 374.5,
  pricePublic: 535,
  saving: 160.5,
  image: "/images/products/goji/goji-fluido.png"
},

{
  id: 21,
  name: "Finale-X Di Goji 200ml",
  family: "Goji",
  type: "Protector Térmico",
  description:
    "Spray alisador anti-crespo con protección térmica. Ayuda a prolongar peinados lisos.",
  tag: "",
  priceSalon: 325.5,
  pricePublic: 465,
  saving: 139.5,
  image: "/images/products/goji/goji-finalex.png"
},

{
  id: 22,
  name: "Lozione Di Goji 12x10ml",
  family: "Goji",
  type: "Loción Estabilizadora",
  description:
    "Ideal después de procesos químicos. Regula pH, elimina residuos alcalinos y calma sensibilidad.",
  tag: "Pro",
  priceSalon: 427,
  pricePublic: 610,
  saving: 183,
  image: "/images/products/goji/goji-lozione.png"
},

{
  id: 23,
  name: "Stabilizzatore Di Goji 500ml",
  family: "Goji",
  type: "Sellador pH",
  description:
    "Tratamiento ácido equilibrante del pH con acción estabilizadora y selladora.",
  tag: "Pro",
  priceSalon: 189,
  pricePublic: 270,
  saving: 81,
  image: "/images/products/goji/goji-stabilizzatore.png"
},

{
  id: 108,
  name: "Additivex Zero",
  family: "Goji",
  type: "Tratamiento Profesional de limpieza profunda",
  description:
    "",
  extra:
    "",
  tag: "Pro",
  priceSalon: 301,
  pricePublic: 430,
  saving: 129,
  image: "/images/products/goji/goji-additivex-zero.png"
},

  // =========================
// PLATINO
// =========================

{
  id: 24,
  name: "Shampoo Platino 250ml",
  family: "Platino",
  type: "Shampoo Matizador",
  description:
    "Lava el cabello y atenúa reflejos amarillos de cabellos canosos, rubios claros o decolorados. Deja el cabello suave e hidratado.",
  tag: "",
  priceSalon: 182,
  pricePublic: 260,
  saving: 78,
  image: "/images/products/platino/platino-shampoo-250ml.png"
},

{
  id: 25,
  name: "Shampoo Platino 500ml",
  family: "Platino",
  type: "Shampoo Matizador",
  description:
    "Neutraliza tonos amarillos no deseados y mantiene rubios fríos con mayor rendimiento.",
  tag: "",
  priceSalon: 238,
  pricePublic: 340,
  saving: 102,
  image: "/images/products/platino/platino-shampoo-500ml.png"
},

{
  id: 26,
  name: "Shampoo Platino 1000ml",
  family: "Platino",
  type: "Shampoo Matizador",
  description:
    "Formato profesional para salón. Ideal para mantenimiento continuo de rubios y platinados.",
  tag: "Pro",
  priceSalon: 392,
  pricePublic: 560,
  saving: 168,
  image: "/images/products/platino/platino-shampoo-1000ml.png"
},

{
  id: 27,
  name: "Maschera Platino 250ml",
  family: "Platino",
  type: "Mascarilla Matizadora",
  description:
    "Complemento ideal del Shampoo Platino. Refuerza el efecto matizador dejando cabello suave e hidratado.",
  tag: "",
  priceSalon: 182,
  pricePublic: 260,
  saving: 78,
  image: "/images/products/platino/platino-maschera-250ml.png"
},

{
  id: 28,
  name: "Maschera Platino 500ml",
  family: "Platino",
  type: "Mascarilla Matizadora",
  description:
    "Nutrición intensa con pigmento matizador para neutralizar reflejos cálidos.",
  tag: "",
  priceSalon: 234.5,
  pricePublic: 335,
  saving: 100.5,
  image: "/images/products/platino/platino-maschera-500ml.png"
},

{
  id: 29,
  name: "Maschera Platino 1000ml",
  family: "Platino",
  type: "Mascarilla Matizadora",
  description:
    "Formato de salon para protocolos intensivos post decoloración.",
  tag: "",
  priceSalon: 364,
  pricePublic: 520,
  saving: 156,
  image: "/images/products/platino/platino-maschera-1000ml.png"
},

{
  id: 30,
  name: "Bifasico Platino 200ml",
  family: "Platino",
  type: "Leave In Matizador",
  description:
    "Acondicionador instantáneo de dos fases con acción hidratante, nutritiva y reparadora para cabellos decolorados, rubios cenizos y canos.",
  tag: "Top",
  priceSalon: 280.5,
  pricePublic: 400,
  saving: 119.5,
  image: "/images/products/platino/platino-bifasico.png"
},

{
  id: 31,
  name: "Ricostruttore Platino 250ml",
  family: "Platino",
  type: "Reconstructor",
  description:
    "Tratamiento reparador instantáneo con nutrición intensa para cabellos decolorados, rubios o platinados.",
  tag: "",
  priceSalon: 231,
  pricePublic: 330,
  saving: 99,
  image: "/images/products/platino/platino-ricostruttore.png"
},

{
  id: 32,
  name: "Fluido Platino 100ml",
  family: "Platino",
  type: "Sérum Matizador",
  description:
    "Tratamiento concentrado de Queratina Vegetal. Protege el cabello de factores externos y aporta brillo.",
  tag: "",
  priceSalon: 451.5,
  pricePublic: 645,
  saving: 193.5,
  image: "/images/products/platino/platino-fluido.png"
},
// =========================
// IALURONICO
// =========================

{
  id: 32,
  name: "Shampoo Ialuronico 250ml",
  family: "Ialuronico",
  type: "Shampoo Reparador",
  description:
    "Lava eficazmente y suavemente reestructurando la hebra capilar. Ideal para cabellos castigados.",
  tag: "",
  priceSalon: 171.5,
  pricePublic: 245,
  saving: 73.5,
  image: "/images/products/ialuronico/ialu-shampoo-250ml.png"
},

{
  id: 33,
  name: "Shampoo Ialuronico 500ml",
  family: "Ialuronico",
  type: "Shampoo Reparador",
  description:
    "Limpieza nutritiva con ácido hialurónico para cabello maltratado o decolorado.",
  tag: "",
  priceSalon: 220.5,
  pricePublic: 315,
  saving: 94.5,
  image: "/images/products/ialuronico/ialu-shampoo-500ml.png"
},

{
  id: 34,
  name: "Shampoo Ialuronico 1000ml",
  family: "Ialuronico",
  type: "Shampoo Reparador",
  description:
    "Formato profesional de alto rendimiento para protocolos reconstructivos.",
  tag: "Pro",
  priceSalon: 360.5,
  pricePublic: 515,
  saving: 154.5,
  image: "/images/products/ialuronico/ialu-shampoo-1000ml.png"
},

{
  id: 35,
  name: "Maschera Ialuronico 250ml",
  family: "Ialuronico",
  type: "Mascarilla Reparadora",
  description:
    "Tratamiento enriquecido con colágeno, ácido hialurónico y queratina. Nutre, hidrata y reconstruye.",
  tag: "",
  priceSalon: 171.5,
  pricePublic: 245,
  saving: 73.5,
  image: "/images/products/ialuronico/ialu-maschera-250ml.png"
},

{
  id: 36,
  name: "Maschera Ialuronico 500ml",
  family: "Ialuronico",
  type: "Mascarilla Reparadora",
  description:
    "Nutrición profunda para cabello sensibilizado con mayor rendimiento.",
  tag: "",
  priceSalon: 245,
  pricePublic: 350,
  saving: 105,
  image: "/images/products/ialuronico/ialu-maschera-500ml.png"
},

{
  id: 37,
  name: "Maschera Ialuronico 1000ml",
  family: "Ialuronico",
  type: "Mascarilla Reparadora",
  description:
    "Formato salón ideal para protocolos intensivos post decoloración.",
  tag: "Pro",
  priceSalon: 364,
  pricePublic: 520,
  saving: 156,
  image: "/images/products/ialuronico/ialu-maschera-1000ml.png"
},

{
  id: 38,
  name: "Bifasico Ialuronico 200ml",
  family: "Ialuronico",
  type: "Leave In",
  description:
    "Tratamiento ligero sin enjuague ideal para cabellos muy procesados y decolorados.",
  tag: "Top",
  priceSalon: 280,
  pricePublic: 400,
  saving: 120,
  image: "/images/products/ialuronico/ialu-bifasico.png"
},

{
  id: 39,
  name: "Ricostruttore Ialuronico 250ml",
  family: "Ialuronico",
  type: "Reconstructor",
  description:
    "Reparación instantánea con ácido hialurónico que nutre, hidrata y devuelve brillo.",
  tag: "",
  priceSalon: 231,
  pricePublic: 330,
  saving: 99,
  image: "/images/products/ialuronico/ialu-ricostruttore.png"
},

{
  id: 40,
  name: "Fluido Ialuronico 100ml",
  family: "Ialuronico",
  type: "Sérum",
  description:
    "Concentra propiedades del ácido hialurónico y queratina hidrolizada. Facilita peinado y controla deshidratación.",
  tag: "",
  priceSalon: 374.5,
  pricePublic: 535,
  saving: 160.5,
  image: "/images/products/ialuronico/ialu-fluido.png"
},

{
  id: 41,
  name: "Finale Ialuronico 200ml",
  family: "Ialuronico",
  type: "Protector Térmico",
  description:
    "Spray reparador extremo con colágeno, ácido hialurónico y proteínas. Ideal con plancha o tenaza.",
  tag: "",
  priceSalon: 182,
  pricePublic: 260,
  saving: 78,
  image: "/images/products/ialuronico/ialu-finale.png"
},


// =========================
// ABBONDANZA
// =========================

{
  id: 43,
  name: "Shampoo Abbondanza 250ml",
  family: "Abbondanza",
  type: "Shampoo Anticaída",
  description:
    "Tratamiento especial para cabellos escasos. Fortalece el cabello y ayuda a prevenir la caída.",
  tag: "",
  priceSalon: 171.5,
  pricePublic: 245,
  saving: 73.5,
  image: "/images/products/abbondanza/shampoo-abbondanza-250ml.png"
},

{
  id: 44,
  name: "Shampoo Abbondanza 1000ml",
  family: "Abbondanza",
  type: "Shampoo Anticaída",
  description:
    "Formato profesional de alto rendimiento para cabellos débiles, con caída o poca densidad.",
  tag: "Pro",
  priceSalon: 357,
  pricePublic: 510,
  saving: 153,
  image: "/images/products/abbondanza/shampoo-abbondanza-1000ml.png"
},

{
  id: 45,
  name: "Lozione Abbondanza",
  family: "Abbondanza",
  type: "Ampolletas Anticaída",
  description:
    "Shock intensivo contra caída persistente del cabello. Enriquecido con Extracto de Romero y Ortiga. Acción tonificante y nutritiva.",
  extra:
    "Modo de uso: aplicar sobre cuero cabelludo limpio, masajear y usar 3 veces por semana.",
  tag: "Top",
  priceSalon: 483,
  pricePublic: 690,
  saving: 207,
  image: "/images/products/abbondanza/lozione-abbondanza.png"
},

// =========================
// AGAVE
// =========================

{
  id: 46,
  name: "Shampoo Di Agave 500ml",
  family: "Agave",
  type: "Shampoo Purificante",
  description:
    "Libre de parabenos, sulfatos y alcohol. Ideal para cuero cabelludo sensible o graso.",
  tag: "",
  priceSalon: 227.5,
  pricePublic: 325,
  saving: 97.5,
  image: "/images/products/agave/agave-shampoo-500ml.png"
},

{
  id: 47,
  name: "Shampoo Di Agave 1000ml",
  family: "Agave",
  type: "Shampoo Purificante",
  description:
    "Formato salón con extracto de agave y aceites esenciales. Limpieza profunda y balanceada.",
  tag: "Pro",
  priceSalon: 357,
  pricePublic: 510,
  saving: 153,
  image: "/images/products/agave/agave-shampoo-1000ml.png"
},

{
  id: 48,
  name: "Maschera Di Agave 500ml",
  family: "Agave",
  type: "Mascarilla Purificante",
  description:
    "Nutrición ligera para cuero cabelludo sensible. Mantiene pureza sin saturar el cabello.",
  tag: "",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/agave/agave-maschera-500ml.png"
},

{
  id: 49,
  name: "Maschera Di Agave 1000ml",
  family: "Agave",
  type: "Mascarilla Purificante",
  description:
    "Formato profesional con extracto de agave, menta y lavanda para uso continuo.",
  tag: "Pro",
  priceSalon: 343,
  pricePublic: 490,
  saving: 147,
  image: "/images/products/agave/agave-maschera-1000ml.png"
},

{
  id: 50,
  name: "Bifasico Di Agave 200ml",
  family: "Agave",
  type: "Leave In Purificante",
  description:
    "Sin enjuague. Hidrata, desenreda y refresca cuero cabelludo sensible.",
  tag: "Top",
  priceSalon: 234.5,
  pricePublic: 335,
  saving: 100.5,
  image: "/images/products/agave/agave-bifasico.png"
},

{
  id: 51,
  name: "Lozione Di Agave 50ml",
  family: "Agave",
  type: "Loción Concentrada",
  description:
    "Concentrado vegetal que potencia el efecto del shampoo. Ideal para cuero cabelludo débil o graso.",
  extra:
    "Modo de uso: aplicar en cuero cabelludo limpio y masajear. No enjuagar. 3 veces por semana.",
  tag: "",
  priceSalon: 420,
  pricePublic: 600,
  saving: 180,
  image: "/images/products/agave/agave-lozione.png"
},

// =========================
// TRATAMIENTOS ESPECIALES
// =========================

{
  id: 52,
  name: "Pozione 10",
  family: "Especiales",
  type: "Mascarilla 10 Beneficios",
  description:
    "Protege color, desenreda, previene puntas abiertas, facilita secado, aporta brillo y disciplina frizz.",
  extra:
    "Uso: aplicar en cabello húmedo de 5 a 7 rocíos. Incluye protección térmica.",
  tag: "Top",
  priceSalon: 280,
  pricePublic: 400,
  saving: 120,
  image: "/images/products/tratamientos/tratamientos-pozione10.png"
},

{
  id: 53,
  name: "Pozione Booster",
  family: "Especiales",
  type: "Tratamiento Intensivo",
  description:
    "Con ácido hialurónico, plex, queratina y proteína de arroz. Regenera cabello dañado y quebradizo.",
  extra:
    "Para cabellos muy dañados se recomienda dejar de medios a puntas sin enjuagar.",
  tag: "Pro",
  priceSalon: 343,
  pricePublic: 490,
  saving: 147,
  image: "/images/products/tratamientos/tratamientos-pozionebooster.png"
},

{
  id: 54,
  name: "Lozione Di Cheratina",
  family: "Especiales",
  type: "Ampolletas Reparadoras",
  description:
    "Ampolletas con queratina, manteca de karité y proteína de trigo. Aporta tono, brillo extraordinario y suavidad.",
  extra:
    "Frecuencia recomendada: 2 veces por semana.",
  tag: "",
  priceSalon: 427,
  pricePublic: 610,
  saving: 183,
  image: "/images/products/tratamientos/tratamientos-lozione.png"
},

{
  id: 55,
  name: "Shampoo Sólido Ialuronico 80g",
  family: "Sólidos",
  type: "Shampoo Sólido Reparador",
  description:
    "Shampoo sólido lavante y reestructurante para cabello dañado por procesos químicos, decoloración y agresiones ambientales.",
  extra:
    "Ingrediente activo: Ácido Hialurónico. Recomendado para cabello decolorado o maltratado.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-ialuronico-shampoo.png"
},

{
  id: 56,
  name: "Maschera Sólida Ialuronico 52g",
  family: "Sólidos",
  type: "Mascarilla Sólida Reparadora",
  description:
    "Mascarilla sólida intensiva que ayuda a reconstruir la hebra capilar, dejando el cabello más suave, brillante y fuerte.",
  extra:
    "Ingrediente activo: Ácido Hialurónico y proteína de trigo.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-ialuronico-maschera.png"
},

{
  id: 57,
  name: "Shampoo Sólido Di Litch 80g",
  family: "Sólidos",
  type: "Shampoo Sólido Protect Color",
  description:
    "Shampoo sólido antioxidante que protege el color, aporta hidratación y ayuda frente a daños solares.",
  extra:
    "Ingrediente activo: Extracto de Litchi. Ideal para cabellos teñidos.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-litchi-shampoo.png"
},

{
  id: 58,
  name: "Maschera Sólida Di Litch 52g",
  family: "Sólidos",
  type: "Mascarilla Sólida Color Care",
  description:
    "Mascarilla hidratante intensiva que suaviza el cabello teñido, sella cutícula y ayuda a mantener el color.",
  extra:
    "Ingrediente activo: Extracto de Litchi.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-litchi-maschera.png"
},

{
  id: 59,
  name: "Shampoo Sólido Di Argan 80g",
  family: "Sólidos",
  type: "Shampoo Sólido Nutritivo",
  description:
    "Shampoo sólido para cabellos deshidratados, secos u opacos. Lava suavemente fortaleciendo la fibra capilar.",
  extra:
    "Ingrediente activo: Aceite de Argán.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-argan-shampoo.png"
},

{
  id: 60,
  name: "Maschera Sólida Di Argan 52g",
  family: "Sólidos",
  type: "Mascarilla Sólida Nutritiva",
  description:
    "Tratamiento sólido intensivo con aceite de argán que ayuda a controlar frizz y aporta brillo sedoso.",
  extra:
    "Ingrediente activo: Aceite de Argán.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-argan-maschera.png"
},

{
  id: 61,
  name: "Shampoo Sólido Freschezza 80g",
  family: "Sólidos",
  type: "Shampoo Sólido Purificante",
  description:
    "Ideal para cuero cabelludo sensible o debilitado. Estimula crecimiento y fortalece la hebra capilar.",
  extra:
    "Ingrediente activo: Extracto de Ginseng y aminoácidos.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-freschezza-shampoo.png"
},

{
  id: 62,
  name: "Maschera Sólida Freschezza 52g",
  family: "Sólidos",
  type: "Mascarilla Sólida Acondicionadora",
  description:
    "Mascarilla sólida hidratante que mejora fuerza capilar y ayuda a reducir quiebre por debilidad.",
  extra:
    "Ingrediente activo: Extracto de Ginseng y aminoácidos.",
  tag: "Eco",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/solidos/solido-freschezza-maschera.png"
},

// =========================
// PROFESIONAL
// =========================

{
  id: 63,
  name: "Colore Zenzero 100ml",
  family: "Profesional",
  type: "Tinte Profesional Permanente",
  description:
    "Coloración profesional baja en amoníaco con Extracto de Argán y Vainilla. Cobertura uniforme, brillo intenso y alta fidelidad del color.",
  extra:
    "Incluye reflejos naturales, intensos, blancos y luminosos. Mezcla 1:1.5.",
  tag: "Pro",
  priceSalon: 165,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/colore-zenzero.png"
},

{
  id: 64,
  name: "Pastel Colors 100ml",
  family: "Profesional",
  type: "Matizador / Color Pastel",
  description:
    "Línea diseñada para crear rubios fríos, cenizos y matices pastel personalizados. Puede usarse solo o mezclado.",
  extra:
    "Mezcla 1:1.5 efecto intenso / 1:2 efecto pastel.",
  tag: "Trend",
  priceSalon: 165,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/pastel-colors.png"
},

{
  id: 65,
  name: "Pigmento Zenzero 250ml",
  family: "Color",
  type: "Color Directo Semipermanente",
  description:
    "Pigmento directo que aporta color, brillo y nutrición. Ideal para fantasía, mantenimiento de tonos y efectos creativos.",
  extra:
    "Colores disponibles: blanco, beige, amarillo, naranja, rojo, violeta, fucsia, azul, lavanda, gris y café.",
  tag: "Top",
  priceSalon: 259,
  pricePublic: 370,
  saving: 111,
  image: "/images/products/color/pigmento-zenzero.png"
},

{
  id: 66,
  name: "Oxycream 1000ml",
  family: "Profesional",
  type: "Crema Oxidante",
  description:
    "Crema oxidante estabilizada de textura cremosa que protege piel y fibra capilar durante coloración o decoloración.",
  extra:
    "Volúmenes disponibles: 6, 10, 20, 30 y 40 vol.",
  tag: "Pro",
  priceSalon: 237,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/oxycream.png"
},

{
  id: 67,
  name: "Oxycream Platino 1000ml",
  family: "Profesional",
  type: "Crema Oxidante Matizante",
  description:
    "Oxidante profesional con pigmento violeta ideal para técnicas de aclaración y neutralización de reflejos cálidos.",
  extra:
    "Especial para rubios fríos y tonos cenizos.",
  tag: "Pro",
  priceSalon: 237,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/oxycream-platino.png"
},

{
  id: 68,
  name: "Decolorato en Crema 250g",
  family: "Profesional",
  type: "Decolorante en Crema",
  description:
    "Decolorante cremoso de alta adherencia que aclara hasta 8 tonos mientras ayuda a proteger la fibra capilar.",
  extra:
    "Ideal para técnicas controladas y trabajos de precisión.",
  tag: "Pro",
  priceSalon: 375,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/decolorato-crema.png"
},

{
  id: 69,
  name: "Decolorato en Polvo 500g",
  family: "Profesional",
  type: "Polvo Decolorante Azul",
  description:
    "Polvo decolorante profesional que ayuda a neutralizar reflejos naranjas y reduce volatilidad durante la mezcla.",
  extra:
    "Aclara de forma uniforme y controlada.",
  tag: "Salon",
  priceSalon: 340,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/decolorato-polvo.png"
},

{
  id: 70,
  name: "Decolorato +9 500g",
  family: "Profesional",
  type: "Polvo Decolorante Lila",
  description:
    "Decolorante de alto poder aclarante que respeta la estructura del cabello logrando hasta 9 niveles de aclaración.",
  extra:
    "Ayuda a neutralizar amarillos no deseados.",
  tag: "Top",
  priceSalon: 382,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/decolorato-plus9.png"
},

{
  id: 71,
  name: "Decolorato Plex +9 500g",
  family: "Profesional",
  type: "Decolorante con Tecnología Plex",
  description:
    "Decolorante vegano de aclaración gradual hasta 9 tonos que ayuda a preservar la fibra capilar durante procesos técnicos.",
  extra:
    "35% menos rotura. Tecnología Plex. Vegano y sin aroma.",
  tag: "Nuevo",
  priceSalon: 427,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/color/decolorato-plex9.png"
},

{
  id: 42,
  name: "Refill Ialuronico 125ml",
  family: "Profesional",
  type: "Botox Capilar Profesional",
  description:
    "Uso Profesional - Inyección de nutrientes que rellenan la hebra capilar. Reestructura cabello muy maltratado, decolorado o deshidratado.",
  extra:
    "Modo de uso sugerido: Deshidratado 1 aplicación mensual. Dañado 4 aplicaciones seguidas y luego cada 2 semanas. Muy dañado 4 aplicaciones seguidas y luego semanal.",
  tag: "Pro",
  priceSalon: 1018.5,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/tratamientos/ialu-refill.png"
},

{
  id: 109,
  name: "Additivex Uno",
  family: "Profesional",
  type: "Tratamiento Profesional",
  description:
    "",
  extra:
    "",
  tag: "Pro",
  priceSalon: 1470,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/tratamientos/additivex-uno.png"
},

{
  id: 110,
  name: "Additivex Due",
  family: "Profesional",
  type: "Tratamiento Profesional",
  description:
    "",
  extra:
    "",
  tag: "Pro",
  priceSalon: 567,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/tratamientos/additivex-due.png"
},

{
  id: 111,
  name: "Additivex Tre",
  family: "Profesional",
  type: "Tratamiento Profesional",
  description:
    "",
  extra:
    "",
  tag: "Pro",
  priceSalon: 1470,
  pricePublic: 0,
  saving: 0,
  image: "/images/products/profesional/tratamientos/additivex-tre.png"
},

{
  id: 72,
  name: "Liquid Silk 100ml",
  family: "Xtyling",
  type: "Sérum Termoprotector",
  description:
    "Gotas ligeras para herramientas térmicas. Recubre la fibra capilar, ayuda contra deshidratación y aporta brillo inmediato.",
  extra:
    "Con queratina y semillas de lino. Protector térmico.",
  tag: "Top",
  priceSalon: 266,
  pricePublic: 380,
  saving: 114,
  image: "/images/products/xtyling/xtyling-liquidsilk.png"
},

{
  id: 73,
  name: "Liss Di Lino 150ml",
  family: "Xtyling",
  type: "Alisante Antifrizz",
  description:
    "Tratamiento para alisar y controlar cabellos rebeldes. Protege del calor de herramientas térmicas y humedad.",
  extra:
    "Efecto anti-humedad hasta 24 horas.",
  tag: "Pro",
  priceSalon: 245,
  pricePublic: 350,
  saving: 105,
  image: "/images/products/xtyling/xtyling-lissdilino.png"
},

{
  id: 74,
  name: "Xtyling Wet Look 300ml",
  family: "Xtyling",
  type: "Gel Efecto Húmedo",
  description:
    "Fluido modelador que aporta suavidad y elasticidad. Ideal para ondas, rizos y peinados con acabado wet.",
  extra:
    "Con Pantenol y proteína de seda.",
  tag: "Trend",
  priceSalon: 210,
  pricePublic: 300,
  saving: 90,
  image: "/images/products/xtyling/xtyling-wetlook.png"
},

{
  id: 75,
  name: "Fiber Paste 150ml",
  family: "Xtyling",
  type: "Cera Modeladora",
  description:
    "Cera de fijación flexible con brillo natural. Define peinados con precisión y textura profesional.",
  extra:
    "Ideal para estilos estructurados.",
  tag: "Barber",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/xtyling/xtyling-fiberpaste.png"
},

{
  id: 76,
  name: "Xtyling Curly 300ml",
  family: "Xtyling",
  type: "Crema para Rizos",
  description:
    "Crema definidora para rizos que controla frizz, aporta elasticidad y realza la forma natural del cabello.",
  extra:
    "Ideal para rizos y ondas.",
  tag: "Top",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/xtyling/xtyling-curly.png"
},

{
  id: 77,
  name: "Xtyling Mousse 300ml",
  family: "Xtyling",
  type: "Mousse Voluminizador",
  description:
    "Espuma ligera que aporta cuerpo, brillo y definición sin sensación pesada. Ayuda a proteger del ambiente.",
  extra:
    "Ideal para volumen y styling diario.",
  tag: "Salon",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/xtyling/xtyling-mousse.png"
},

{
  id: 78,
  name: "Gel Extra Forte 100ml",
  family: "Xtyling",
  type: "Gel Ultra Fuerte",
  description:
    "Gel capilar de fijación intensa para looks definidos y duraderos sin residuos visibles.",
  extra:
    "Disponible también en 500 ml.",
  tag: "Strong",
  priceSalon: 140,
  pricePublic: 200,
  saving: 60,
  image: "/images/products/xtyling/xtyling-gel-100.png"
},

{
  id: 79,
  name: "Gel Extra Forte 500ml",
  family: "Xtyling",
  type: "Gel Ultra Fuerte",
  description:
    "Formato profesional de fijación intensa para uso frecuente en salón o barbería.",
  extra:
    "Control prolongado sin resecar.",
  tag: "Pro",
  priceSalon: 224,
  pricePublic: 320,
  saving: 96,
  image: "/images/products/xtyling/xtyling-gel-500.png"
},

{
  id: 80,
  name: "Lacca Extra Forte 750ml",
  family: "Xtyling",
  type: "Spray Fijador",
  description:
    "Spray profesional de fijación fuerte que mantiene el peinado con brillo natural y sin residuos.",
  extra:
    "Aplicación ligera y secado rápido.",
  tag: "Salon",
  priceSalon: 252,
  pricePublic: 360,
  saving: 108,
  image: "/images/products/xtyling/xtyling-lacca.png"
},

// ===================
// SKIN
// ===================

{
  id: 81,
  name: "Facciale Di Argan 50ml",
  family: "Skin",
  type: "Crema Facial Hidratante",
  description:
    "Crema facial con Agua Termal, Aceite de Argán y Ácido Hialurónico. Hidrata profundamente y mejora luminosidad.",
  extra:
    "Ideal para rostro, frente y cuello.",
  tag: "Skin",
  priceSalon: 245,
  pricePublic: 350,
  saving: 105,
  image: "/images/products/skin/facciale-argan.png"
},

{
  id: 82,
  name: "Siero Ialuronico 6 x 3ml",
  family: "Skin",
  type: "Suero Facial Intensivo",
  description:
    "Ampolletas con aminoácidos y ácido hialurónico de efecto tensor e hidratación inmediata.",
  extra:
    "Uso normal o intensivo.",
  tag: "Skin",
  priceSalon: 315,
  pricePublic: 450,
  saving: 135,
  image: "/images/products/skin/siero-ialuronico.png"
},

{
  id: 83,
  name: "Sapone 100g",
  family: "Skin",
  type: "Jabón Facial / Corporal",
  description:
    "Jabón humectante de espuma cremosa que limpia suavemente dejando la piel fresca y luminosa.",
  extra:
    "Versiones: Argan, Goji, Ialuronico, Agave, Menta y Zenzero.",
  tag: "Skin",
  priceSalon: 98,
  pricePublic: 140,
  saving: 42,
  image: "/images/products/skin/sapone.png"
},

{
  id: 84,
  name: "Cleansing Wipes 332g",
  family: "Skin",
  type: "Toallas Desmaquillantes",
  description:
    "Toallas micelares con Extracto de Argán y Ácido Hialurónico. Limpian, hidratan y refrescan en un solo paso.",
  extra:
    "Prácticas para uso diario.",
  tag: "Skin",
  priceSalon: 154,
  pricePublic: 220,
  saving: 66,
  image: "/images/products/skin/cleansing-wipes.png"
},

// =========================
// MAKEUP (ID 85+)
// =========================

{
  id: 85,
  name: "Foundation",
  family: "Makeup",
  type: "Base Líquida",
  description:
    "Base ligera de acabado satinado mate. Unifica el tono, suaviza textura y aporta cobertura modulable con apariencia natural.",
  extra:
    "Tonos disponibles: Ivory, Nude, Sand, Toffee, Almond y Chestnut.",
  tag: "Top",
  priceSalon: 189,
  pricePublic: 270,
  saving: 81,
  image: "/images/products/makeup/makeup-foundation.png"
},

{
  id: 86,
  name: "Powder Foundation",
  family: "Makeup",
  type: "Base Compacta en Polvo",
  description:
    "Polvo compacto matificante de larga duración. Reduce brillo e imperfecciones dejando acabado uniforme.",
  extra:
    "Tonos disponibles: Light, Medium, Dark y Deep.",
  tag: "Pro",
  priceSalon: 196,
  pricePublic: 280,
  saving: 84,
  image: "/images/products/makeup/makeup-powder-foundation.png"
},

{
  id: 87,
  name: "Concealer",
  family: "Makeup",
  type: "Corrector",
  description:
    "Corrector de alta pigmentación para cubrir ojeras, manchas e imperfecciones con acabado suave y natural.",
  extra:
    "Tonos disponibles: Light y Medium.",
  tag: "Top",
  priceSalon: 133,
  pricePublic: 190,
  saving: 57,
  image: "/images/products/makeup/makeup-concealer.png"
},

{
  id: 88,
  name: "Contour Stick",
  family: "Makeup",
  type: "Contorno e Iluminador",
  description:
    "Barra doble función para esculpir y resaltar facciones. Fórmula cremosa de fácil difuminado.",
  extra:
    "Incluye tono Contour + Highlight.",
  tag: "Trend",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/makeup/makeup-contourstick.png"
},

{
  id: 89,
  name: "Blush",
  family: "Makeup",
  type: "Rubor Compacto",
  description:
    "Rubor sedoso con mezcla de pigmentos y perlas finas que aporta color saludable y luminosidad.",
  extra:
    "Cobertura natural para todo tipo de piel.",
  tag: "Glow",
  priceSalon: 154,
  pricePublic: 220,
  saving: 66,
  image: "/images/products/makeup/makeup-blush-goldenpeach.png"
},

{
  id: 90,
  name: "Camouflage",
  family: "Makeup",
  type: "Polvo Traslúcido",
  description:
    "Polvo suelto de acabado perfeccionador. Minimiza brillo, fija maquillaje y suaviza líneas finas.",
  extra:
    "Textura ligera y sedosa.",
  tag: "Pro",
  priceSalon: 168,
  pricePublic: 240,
  saving: 72,
  image: "/images/products/makeup/makeup-camouflage.png"
},

{
  id: 91,
  name: "Natural Glam Kit",
  family: "Makeup",
  type: "Kit de Maquillaje",
  description:
    "Set completo en tonos neutros para look natural glam. Ideal para uso diario o regalo.",
  extra:
    "Incluye sombras, lip fluid y eye shadow.",
  tag: "Kit",
  priceSalon: 350,
  pricePublic: 2500,
  saving: 1,
  image: "/images/products/makeup/makeup-naturalglamkit.png"
},

{
  id: 92,
  name: "Bronzer",
  family: "Makeup",
  type: "Bronceador Compacto",
  description:
    "Bronceador en polvo que aporta calidez al rostro con acabado uniforme y natural.",
  extra:
    "Ideal para contorno suave o efecto sun kissed.",
  tag: "Glow",
  priceSalon: 154,
  pricePublic: 220,
  saving: 66,
  image: "/images/products/makeup/makeup-bronzer.png"
},

{
  id: 93,
  name: "Eye Primer",
  family: "Makeup",
  type: "Primer de Ojos",
  description:
    "Base para sombras que mejora adherencia, duración e intensidad del color.",
  extra:
    "Ayuda a evitar pliegues.",
  tag: "Pro",
  priceSalon: 126,
  pricePublic: 180,
  saving: 54,
  image: "/images/products/makeup/makeup-eye-primer.png"
},

{
  id: 94,
  name: "Primer",
  family: "Makeup",
  type: "Pre-Base Facial",
  description:
    "Primer facial que suaviza poros y prepara la piel para una aplicación uniforme.",
  extra:
    "Versiones: Green y Apricot.",
  tag: "Top",
  priceSalon: 147,
  pricePublic: 210,
  saving: 63,
  image: "/images/products/makeup/makeup-primer-green.png"
},

{
  id: 95,
  name: "Argan Oil Gloss",
  family: "Makeup",
  type: "Gloss Tratamiento",
  description:
    "Gloss nutritivo con Aceite de Argán que hidrata labios mientras aporta brillo natural.",
  extra:
    "Ideal para uso diario.",
  tag: "Care",
  priceSalon: 119,
  pricePublic: 170,
  saving: 51,
  image: "/images/products/makeup/makeup-argan-oil-gloss.png"
},

{
  id: 96,
  name: "Lip Gloss",
  family: "Makeup",
  type: "Gloss de Color",
  description:
    "Brillo labial de textura suave con acabado luminoso y efecto volumen visual.",
  extra:
    "Tonos: Pink, Orange, Purple y Cherry.",
  tag: "Trend",
  priceSalon: 119,
  pricePublic: 170,
  saving: 51,
  image: "/images/products/makeup/makeup-lip-loss.png"
},

{
  id: 97,
  name: "Eyebrow Powder",
  family: "Makeup",
  type: "Polvo para Ceja",
  description:
    "Polvo definidor para rellenar cejas con acabado natural y larga duración.",
  extra:
    "Tonos: Medium y Dark.",
  tag: "Brow",
  priceSalon: 140,
  pricePublic: 200,
  saving: 60,
  image: "/images/products/makeup/makeup-eyebrow-powder.png"
},

{
  id: 98,
  name: "Eyebrow Pencil",
  family: "Makeup",
  type: "Lápiz para Ceja",
  description:
    "Lápiz retráctil preciso para diseñar, definir y rellenar cejas fácilmente.",
  extra:
    "Acabado natural.",
  tag: "Brow",
  priceSalon: 105,
  pricePublic: 150,
  saving: 45,
  image: "/images/products/makeup/makeup-eyebrow-pencil.png"
},

{
  id: 99,
  name: "Matte Lipstick",
  family: "Makeup",
  type: "Labial Mate",
  description:
    "Labial altamente pigmentado con acabado mate cómodo y larga duración.",
  extra:
    "Tonos: Electric Pink, Red y Raspberry.",
  tag: "Lip",
  priceSalon: 126,
  pricePublic: 180,
  saving: 54,
  image: "/images/products/makeup/makeup-matte-lipstick.png"
},

{
  id: 100,
  name: "Frost Lipstick",
  family: "Makeup",
  type: "Labial Satinado",
  description:
    "Labial con brillo satinado y textura cremosa que aporta color elegante.",
  extra:
    "Tonos: Frost Orange y Frost Pink.",
  tag: "Lip",
  priceSalon: 126,
  pricePublic: 180,
  saving: 54,
  image: "/images/products/makeup/makeup-frost-lipstick.png"
},

{
  id: 101,
  name: "Lip Pencil",
  family: "Makeup",
  type: "Lápiz Labial",
  description:
    "Lápiz retráctil para perfilar labios con precisión y mayor duración del color.",
  extra:
    "Tonos: Red y Brown.",
  tag: "Lip",
  priceSalon: 105,
  pricePublic: 150,
  saving: 45,
  image: "/images/products/makeup/makeup-lip-pencil.png"
},

{
  id: 102,
  name: "Lip Fluid",
  family: "Makeup",
  type: "Labial Líquido",
  description:
    "Labial líquido de textura cremosa y acabado flexible de larga duración.",
  extra:
    "Tonos: Nude y Rose.",
  tag: "Top",
  priceSalon: 133,
  pricePublic: 190,
  saving: 57,
  image: "/images/products/makeup/makeup-lipfluid.png"
},

{
  id: 103,
  name: "Máscara de Pestañas",
  family: "Makeup",
  type: "Mascara",
  description:
    "Máscara negra intensa que alarga, define y aporta volumen sin grumos.",
  extra:
    "Larga duración.",
  tag: "Eyes",
  priceSalon: 140,
  pricePublic: 200,
  saving: 60,
  image: "/images/products/makeup/makeup-mascara.png"
},

{
  id: 104,
  name: "Fiber Lash",
  family: "Makeup",
  type: "Primer de Pestañas",
  description:
    "Primer para pestañas que aumenta longitud y volumen antes de la máscara.",
  extra:
    "Efecto extensión.",
  tag: "Eyes",
  priceSalon: 126,
  pricePublic: 180,
  saving: 54,
  image: "/images/products/makeup/makeup-fiberlash.png"
},

{
  id: 105,
  name: "Eye Marker",
  family: "Makeup",
  type: "Delineador Plumón",
  description:
    "Delineador negro intenso de trazo preciso y secado rápido.",
  extra:
    "Acabado mate.",
  tag: "Eyes",
  priceSalon: 119,
  pricePublic: 170,
  saving: 51,
  image: "/images/products/makeup/makeup-eye-marker.png"
},

{
  id: 106,
  name: "Shadow Stick",
  family: "Makeup",
  type: "Sombra en Barra",
  description:
    "Sombra cremosa en formato lápiz de aplicación rápida y difuminado sencillo.",
  extra:
    "Tonos: Pearl y Copper.",
  tag: "Eyes",
  priceSalon: 154,
  pricePublic: 220,
  saving: 66,
  image: "/images/products/makeup/makeup-shadowstick-copper.png"
},

{
  id: 107,
  name: "Eye Shadow",
  family: "Makeup",
  type: "Sombra Compacta",
  description:
    "Sombras de alta adherencia y color intenso para looks naturales o dramáticos.",
  extra:
    "Amplia gama de tonos disponibles.",
  tag: "Eyes",
  priceSalon: 154,
  pricePublic: 220,
  saving: 66,
  image: "/images/products/makeup/makeup-eye-shadownude .png"
},

{
  id: 112,
  name: "Beauty Blender",
  family: "Accessories",
  type: "Esponja de Maquillaje",
  description:
    "Esponja de alta suavidad para aplicar base, corrector y productos líquidos con acabado uniforme.",
  extra:
    "Uso húmedo o seco.",
  tag: "Top",
  priceSalon: 84,
  pricePublic: 120,
  saving: 36,
  image: "/images/products/accessories/beauty-blender.png"
},

{
  id: 113,
  name: "Brocha Kabuki",
  family: "Accessories",
  type: "Brocha Facial",
  description:
    "Brocha densa ideal para base líquida, polvo o bronceador con acabado profesional.",
  extra:
    "Cerdas suaves de alta densidad.",
  tag: "Pro",
  priceSalon: 140,
  pricePublic: 200,
  saving: 60,
  image: "/images/products/accessories/brocha-kabuki.png"
},

{
  id: 114,
  name: "Set de Brochas x5",
  family: "Accessories",
  type: "Kit de Brochas",
  description:
    "Set básico para rostro y ojos. Ideal para uso diario o para iniciar kit profesional.",
  extra:
    "Incluye brochas faciales y precisión.",
  tag: "Kit",
  priceSalon: 245,
  pricePublic: 350,
  saving: 105,
  image: "/images/products/accessories/set-brochas-5.png"
},

{
  id: 115,
  name: "Pestañas Postizas Natural",
  family: "Accessories",
  type: "Pestañas",
  description:
    "Diseño ligero y natural para dar longitud y volumen sutil.",
  extra:
    "Reutilizables.",
  tag: "Trend",
  priceSalon: 77,
  pricePublic: 110,
  saving: 33,
  image: "/images/products/accessories/pestanas-natural.png"
},

{
  id: 116,
  name: "Pestañas Postizas Glam",
  family: "Accessories",
  type: "Pestañas",
  description:
    "Mayor volumen y definición para looks intensos o de noche.",
  extra:
    "Reutilizables.",
  tag: "Glow",
  priceSalon: 91,
  pricePublic: 130,
  saving: 39,
  image: "/images/products/accessories/pestanas-glam.png"
},

{
  id: 117,
  name: "Pegamento para Pestañas",
  family: "Accessories",
  type: "Adhesivo",
  description:
    "Adhesivo de larga duración para pestañas postizas con secado rápido.",
  extra:
    "Transparente.",
  tag: "Top",
  priceSalon: 84,
  pricePublic: 120,
  saving: 36,
  image: "/images/products/accessories/glue-lashes.png"
},

{
  id: 118,
  name: "Sacapuntas Duo",
  family: "Accessories",
  type: "Herramienta",
  description:
    "Sacapuntas doble para lápices cosméticos estándar y jumbo.",
  extra:
    "Con depósito.",
  tag: "",
  priceSalon: 56,
  pricePublic: 80,
  saving: 24,
  image: "/images/products/accessories/sacapuntas-duo.png"
},

{
  id: 119,
  name: "Rizador de Pestañas",
  family: "Accessories",
  type: "Herramienta",
  description:
    "Rizador metálico ergonómico para curvatura definida y natural.",
  extra:
    "Incluye goma de repuesto.",
  tag: "",
  priceSalon: 105,
  pricePublic: 150,
  saving: 45,
  image: "/images/products/accessories/rizador.png"
},

{
  id: 120,
  name: "Cosmetic Bag",
  family: "Accessories",
  type: "Neceser",
  description:
    "Bolsa cosmetiquera ideal para organizar maquillaje y esenciales.",
  extra:
    "Compacta y resistente.",
  tag: "Top",
  priceSalon: 126,
  pricePublic: 180,
  saving: 54,
  image: "/images/products/accessories/cosmetic-bag.png"
},
];