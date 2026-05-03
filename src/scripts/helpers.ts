export function money(v = 0) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(v);
}

export function getTerms(total: number) {
  if (total < 1500) {
    return {
      label: "Contado total",
      down: total,
      balance: 0
    };
  }

  if (total < 10000) {
    return {
      label: "50% hoy + 50% a 15 días",
      down: total / 2,
      balance: total / 2
    };
  }

  return {
    label: "50% hoy + 50% a 30 días",
    down: total / 2,
    balance: total / 2
  };
}