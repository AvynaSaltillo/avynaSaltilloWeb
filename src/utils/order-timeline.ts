import dayjs from "dayjs";

import "dayjs/locale/es";

dayjs.locale("es");

function formatTime(
  value: string
) {

  return dayjs(value)
    .format(
      "DD MMM · hh:mm A"
    );

}

export function getOrderTimeline(
  order: any
) {

  const logs =
    (
      order.activity_logs || []
    )

    .sort(
      (a: any, b: any) =>

        new Date(
          a.created_at
        ).getTime()

        -

        new Date(
          b.created_at
        ).getTime()
    );

  const timeline = [];

  /* =========================
     CREATED
  ========================= */

  timeline.push({

    key:
      "waiting_supplier",

    label:
      "Pedido recibido",

    time:
      formatTime(
        order.created_at
      )

  });

  /* =========================
     STATUS LABELS
  ========================= */

  const statusMap: Record<
    string,
    string
  > = {

    ordered_supplier:
      "Proveedor confirmado",

    ready_delivery:
      "Llegó a oficina Saltillo",

    on_route:
      "Pedido en ruta",

    delivered:
      "Pedido entregado"

  };

  /* =========================
     STATUS CHANGES
  ========================= */

  logs.forEach(
    (log: any) => {

      if (
        log.type !==
        "delivery_status_changed"
      ) {

        return;

      }

      const status =

        log.metadata?.status

        ||

        log.metadata?.delivery_status

        ||

        null;

      if (!status) {
        return;
      }

      timeline.push({

        key:
          status,

        label:
          statusMap[
            status
          ] ||
          log.title,

        time:
          formatTime(
            log.created_at
          )

      });

    }
  );

  return timeline;

}