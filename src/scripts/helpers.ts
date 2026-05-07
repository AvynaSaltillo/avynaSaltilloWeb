export function money(value = 0) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(Number(value || 0));

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

export function properCase(
  value = ""
) {

  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => {

      return (
        word.charAt(0)
          .toUpperCase() +
        word.slice(1)
      );

    })
    .join(" ");

}