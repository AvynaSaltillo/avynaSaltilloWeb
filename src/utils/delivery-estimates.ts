import dayjs from "dayjs";

/* ========================================
   HELPERS
======================================== */

function formatDate(
  date: dayjs.Dayjs
) {

  return date
    .locale("es")
    .format("D MMM");

}

/* ========================================
   DELIVERY WINDOWS
======================================== */

const advisorWindows = {

  /* ====================================
     MICHELLE
     LISTO → +5 DÍAS MÁXIMO
  ==================================== */

  michelle: {

    min: 0,

    max: 5

  },

  /* ====================================
     ÁNGELES
  ==================================== */

  angeles: {

    min: 2,

    max: 8

  },

  /* ====================================
     BLANCA
  ==================================== */

  blanca: {

    min: 5,

    max: 8

  }

};

/* ========================================
   MAIN
======================================== */

export function getDeliveryEstimate(
  order: any
) {

  /* ====================================
     BASE DATE
     JUEVES OPERATIVO
  ==================================== */

const baseDate =

  order.week_key

    ? dayjs(
        order.week_key
      ).add(
        6,
        "day"
      )

    : dayjs(
        order.created_at
      );
  /* ====================================
     LLEGADA A OFICINA
     JUEVES → LUNES/MIÉRCOLES
  ==================================== */

  const officeArrivalStart =
    baseDate.add(
      4,
      "day"
    );

  const officeArrivalEnd =
    baseDate.add(
      6,
      "day"
    );

  /* ====================================
     ADVISOR
  ==================================== */

  const advisor =

    (
      order?.advisor_name ||
      ""
    )

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .toLowerCase()

      .trim();

  const window =

    advisor.includes(
      "michelle"
    )

      ? advisorWindows.michelle

      : advisor.includes(
          "angeles"
        )

      ? advisorWindows.angeles

      : advisorWindows.blanca;

  /* ====================================
     READY DATE
     SI YA ESTÁ LISTO,
     TOMAMOS updated_at
  ==================================== */

  const readyDate =

    order.delivery_status ===
    "ready_delivery"

      ? dayjs(
          order.updated_at
        )

      : officeArrivalStart;

  /* ====================================
     ENTREGA FINAL
  ==================================== */

  let deliveryStart =
    readyDate.add(
      window.min,
      "day"
    );

  let deliveryEnd =
    readyDate.add(
      window.max,
      "day"
    );

  /* ====================================
     STOCK MODE
     ENTREGA RÁPIDA
  ==================================== */

  const isStockOrder =

    order?.metadata
      ?.stock_available

    ||

    false;

  if (isStockOrder) {

    deliveryStart =
      dayjs(
        order.created_at
      );

    deliveryEnd =
      dayjs(
        order.created_at
      ).add(
        2,
        "day"
      );

  }

  /* ====================================
     STATUS LOGIC
  ==================================== */

  const status =
    order.delivery_status;

  let title =
    "";

  let description =
    "";

  /* ====================================
     WAITING SUPPLIER
  ==================================== */

  if (
    status ===
    "waiting_supplier"
  ) {

    title =
      "Llegada estimada a oficina";

    description =
      `${formatDate(officeArrivalStart)} → ${formatDate(officeArrivalEnd)}`;

  }

  /* ====================================
     ORDERED SUPPLIER
  ==================================== */

  else if (
    status ===
    "ordered_supplier"
  ) {

    title =
      "Entrega estimada";

    description =
      `${formatDate(deliveryStart)} → ${formatDate(deliveryEnd)}`;

  }

  /* ====================================
     READY DELIVERY
  ==================================== */

  else if (
    status ===
    "ready_delivery"
  ) {

    title =
      "Programando entrega";

    description =
      `${formatDate(deliveryStart)} → ${formatDate(deliveryEnd)}`;

  }

  /* ====================================
     ON ROUTE
  ==================================== */

  else if (
    status ===
    "on_route"
  ) {

    title =
      "Entrega en camino";

    description =
      "Tu pedido llega hoy a tu salón";

  }

  /* ====================================
     DELIVERED
  ==================================== */

  else if (
    status ===
    "delivered"
  ) {

    title =
      "Pedido entregado";

    description =
      "Entrega completada correctamente.";

  }

  /* ====================================
     FALLBACK
  ==================================== */

  else {

    title =
      "Procesando pedido";

    description =
      "Tu pedido sigue en preparación.";

  }

  return {

    title,

    description,

    officeArrivalStart,

    officeArrivalEnd,

    deliveryStart,

    deliveryEnd

  };

}