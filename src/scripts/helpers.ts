export function money(value = 0) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    Number(value || 0)
  );

}

export function getTerms(
  total: number
) {

  if (total < 1500) {

    return {
      label:
        "Contado total",

      down: total,

      balance: 0
    };

  }

  if (total < 10000) {

    return {
      label:
        "50% entrega + 50% a 15 días",

      down:
        total / 2,

      balance:
        total / 2
    };

  }

  return {

    label:
      "50% entrega + 50% a 30 días",

    down:
      total / 2,

    balance:
      total / 2

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

/* ========================================
   BUSINESS WEEK
   VIERNES 00:00
   → JUEVES 23:59
======================================== */

export function getBusinessWeek(
  input = new Date()
) {

  const date =
    new Date(input);

  const day =
    date.getDay();

  /*
    0 domingo
    1 lunes
    5 viernes
  */

 const diff =
  (day + 2) % 7;

  const start =
    new Date(date);

  start.setDate(
    start.getDate() - diff
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  const end =
    new Date(start);

  end.setDate(
    end.getDate() + 6
  );

  end.setHours(
    23,
    59,
    59,
    999
  );

  return {
    start,
    end
  };

}

/* ========================================
   WEEK KEY
======================================== */

export function getCurrentWeekKey(
  input = new Date()
) {

  const {
    start
  } =
    getBusinessWeek(input);

  const year =
    start.getFullYear();

  const month =
    String(
      start.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      start.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

/* ========================================
   DELIVERY FLOW
======================================== */

export const FLOW = [

  "waiting_supplier",

  "ordered_supplier",

  "ready_delivery",

  "on_route",

  "delivered"

];


/* ========================================
   PAYMENT HELPERS
======================================== */

export function isFormalCredit(
  type = ""
) {

  return [
    "credit_15",
    "credit_30"
  ].includes(type);

}

export function isOpenCredit(
  type = ""
) {

  return (
    type ===
    "open_credit"
  );

}

export function isCash(
  type = ""
) {

  return (
    type ===
    "cash"
  );

}

export function isOverdue(
  order: any
) {

  if (
    isOpenCredit(
      order?.payment_type
    )
  ) {

    return false;

  }

  if (
    !order?.due_date
  ) {

    return false;

  }

  return (

    Number(
      order.amount_due || 0
    ) > 0

    &&

    new Date(
      order.due_date
    ).getTime() < Date.now()

  );

}

export function paymentTypeLabel(
  type = ""
) {

  switch(type){

    case "cash":
      return "Contado";

    case "credit_15":
      return "50% entrega + 50% a 15 días";

    case "credit_30":
      return "50% entrega + 50% a 30 días";

    case "open_credit":
      return "Crédito abierto";

    default:
      return "Sin definir";

  }

}

export function paymentTypeClass(
  type = ""
) {

  switch(type){

    case "cash":
      return "cash";

    case "credit_15":
      return "credit15";

    case "credit_30":
      return "credit30";

    case "open_credit":
      return "open";

    default:
      return "";

  }

}