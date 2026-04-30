// src/data/diagnostic.ts

export const questions = {
  salon: [
    {
      id: "hairType",
      title: "Tipo de cabello de la clienta",
      multi: false,
      options: [
        { label: "Rizado", value: "rizado", icon: "curl" },
        { label: "Ondulado", value: "ondulado", icon: "wave" },
        { label: "Lacio", value: "lacio", icon: "sleek" },
        { label: "Afro", value: "afro", icon: "volume" }
      ]
    },

    {
      id: "scalp",
      title: "Tipo de cuero cabelludo",
      multi: false,
      options: [
        { label: "Sensible", value: "sensible", icon: "drop" },
        { label: "Normal", value: "normalscalp", icon: "circle" },
        { label: "Graso", value: "graso", icon: "shine" },
        { label: "Caspa", value: "caspa", icon: "shield" }
      ]
    },

    {
      id: "fall",
      title: "¿El cabello se cae o es débil?",
      multi: false,
      options: [
        { label: "Sí", value: "caida", icon: "leaf" },
        { label: "No", value: "estable", icon: "check" }
      ]
    },

    {
      id: "elasticity",
      title: "Al estirar una hebra húmeda...",
      multi: false,
      options: [
        { label: "Se rompe", value: "quiebre", icon: "break" },
        { label: "Se estira demasiado", value: "elastico", icon: "stretch" },
        { label: "No pasa nada", value: "establefibra", icon: "check" }
      ]
    },

    {
      id: "porosity",
      title: "¿Absorbe agua y se seca rápido?",
      multi: false,
      options: [
        { label: "Sí", value: "poroso", icon: "spark" },
        { label: "No", value: "normalporo", icon: "drop" }
      ]
    },

    {
      id: "texture",
      title: "Textura del cabello",
      multi: false,
      options: [
        { label: "Fino", value: "fino", icon: "feather" },
        { label: "Medio", value: "medio", icon: "layers" },
        { label: "Denso", value: "denso", icon: "grid" },
        { label: "Grueso", value: "grueso", icon: "square" }
      ]
    },

    {
      id: "length",
      title: "Largo del cabello",
      multi: false,
      options: [
        { label: "Corto", value: "corto", icon: "cut" },
        { label: "Medio", value: "medio_largo", icon: "minus" },
        { label: "Largo", value: "largo", icon: "line" },
        { label: "Extra largo", value: "xlargo", icon: "expand" }
      ]
    },

    {
      id: "wash",
      title: "Frecuencia de lavado",
      multi: false,
      options: [
        { label: "Diario", value: "lavadodiario", icon: "bubble" },
        { label: "Cada 2 días", value: "lavado2dias", icon: "calendar" },
        { label: "2 veces semana", value: "lavado2x", icon: "calendar" },
        { label: "1 vez semana", value: "lavado1x", icon: "calendar" }
      ]
    },

    {
      id: "goal",
      title: "Objetivo principal",
      multi: false,
      options: [
        { label: "Reparar", value: "meta_reparar", icon: "repair" },
        { label: "Brillo", value: "meta_brillo", icon: "spark" },
        { label: "Crecimiento", value: "meta_crecer", icon: "leaf" },
        { label: "Control Frizz", value: "meta_frizz", icon: "wave" },
        { label: "Mantener Color", value: "meta_color", icon: "palette" },
        { label: "Definir Rizos", value: "meta_rizos", icon: "curl" }
      ]
    },

    {
      id: "chemical",
      title: "Historial químico últimos 2 años",
      multi: true,
      max: 2,
      options: [
        { label: "Decoloración", value: "decolorado", icon: "ice" },
        { label: "Alaciado", value: "alaciado", icon: "sleek" },
        { label: "Tinte global", value: "tinte", icon: "palette" },
        { label: "Ondulado permanente", value: "permanente", icon: "curl" },
        { label: "Sin procesos", value: "virgen", icon: "leaf" }
      ]
    },

    {
      id: "heat",
      title: "Frecuencia de planchado",
      multi: false,
      options: [
        { label: "Diario", value: "caloralto", icon: "flame" },
        { label: "2-3 veces semana", value: "calormedio", icon: "heat" },
        { label: "1 vez semana", value: "calorbajo", icon: "sun" },
        { label: "Nunca", value: "sincalor", icon: "snow" }
      ]
    }
  ],

  client: [
    {
      id: "hairType",
      title: "¿Cómo es tu cabello?",
      multi: false,
      options: [
        { label: "Rizado", value: "rizado", icon: "curl" },
        { label: "Ondulado", value: "ondulado", icon: "wave" },
        { label: "Lacio", value: "lacio", icon: "sleek" },
        { label: "Afro", value: "afro", icon: "volume" }
      ]
    },

    {
      id: "scalp",
      title: "Tu cuero cabelludo es...",
      multi: false,
      options: [
        { label: "Sensible", value: "sensible", icon: "drop" },
        { label: "Normal", value: "normalscalp", icon: "circle" },
        { label: "Graso", value: "graso", icon: "shine" },
        { label: "Caspa", value: "caspa", icon: "shield" }
      ]
    },

    {
      id: "fall",
      title: "¿Sientes caída o debilidad?",
      multi: false,
      options: [
        { label: "Sí", value: "caida", icon: "leaf" },
        { label: "No", value: "estable", icon: "check" }
      ]
    },

    {
      id: "elasticity",
      title: "Cuando está mojado y lo estiras...",
      multi: false,
      options: [
        { label: "Se rompe", value: "quiebre", icon: "break" },
        { label: "Se estira mucho", value: "elastico", icon: "stretch" },
        { label: "Normal", value: "establefibra", icon: "check" }
      ]
    },

    {
      id: "length",
      title: "¿Qué tan largo está?",
      multi: false,
      options: [
        { label: "Corto", value: "corto", icon: "cut" },
        { label: "Medio", value: "medio_largo", icon: "minus" },
        { label: "Largo", value: "largo", icon: "line" },
        { label: "Extra largo", value: "xlargo", icon: "expand" }
      ]
    },

    {
      id: "wash",
      title: "¿Cada cuánto lo lavas?",
      multi: false,
      options: [
        { label: "Diario", value: "lavadodiario", icon: "bubble" },
        { label: "Cada 2 días", value: "lavado2dias", icon: "calendar" },
        { label: "2 veces semana", value: "lavado2x", icon: "calendar" },
        { label: "1 vez semana", value: "lavado1x", icon: "calendar" }
      ]
    },

    {
      id: "goal",
      title: "¿Qué quieres mejorar más?",
      multi: true,
      max: 2,
      options: [
        { label: "Repararlo", value: "meta_reparar", icon: "repair" },
        { label: "Brillo", value: "meta_brillo", icon: "spark" },
        { label: "Crecimiento", value: "meta_crecer", icon: "leaf" },
        { label: "Menos frizz", value: "meta_frizz", icon: "wave" },
        { label: "Cuidar color", value: "meta_color", icon: "palette" },
        { label: "Definir rizos", value: "meta_rizos", icon: "curl" }
      ]
    },

    {
      id: "chemical",
      title: "¿Has tenido procesos químicos?",
      multi: true,
      max: 2,
      options: [
        { label: "Decoloración", value: "decolorado", icon: "ice" },
        { label: "Alaciado", value: "alaciado", icon: "sleek" },
        { label: "Tinte", value: "tinte", icon: "palette" },
        { label: "Ninguno", value: "virgen", icon: "leaf" }
      ]
    },

    {
      id: "heat",
      title: "¿Usas plancha/secadora?",
      multi: false,
      options: [
        { label: "Mucho", value: "caloralto", icon: "flame" },
        { label: "A veces", value: "calormedio", icon: "heat" },
        { label: "Poco", value: "calorbajo", icon: "sun" },
        { label: "Nunca", value: "sincalor", icon: "snow" }
      ]
    }
  ]
};

export const familyScores = {
  argan: ["virgen", "rizado", "ondulado", "poroso"],
  ialuronico: ["decolorado", "quiebre", "elastico"],
  goji: ["tinte", "alaciado"],
  agave: ["sensible", "graso", "caspa"],
  abbondanza: ["caida"],
  xtyling: ["rizado", "ondulado", "permanente"],
  especiales: ["quiebre", "poroso"],
  profesional: ["decolorado", "quiebre"]
};