import dayjs from "dayjs";

export function getClientAnalytics(
  orders: any[],
  profile?: any
) {

  /* =========================
     TOTALS
  ========================= */

  const totalSpent =
    orders.reduce(
      (sum, order) => {

        return (
          sum +
          Number(order.total || 0)
        );

      },
      0
    );

  const totalOrders =
    orders.length;

  const averageTicket =
    totalOrders > 0
      ? totalSpent / totalOrders
      : 0;

  const pendingBalance =
    orders.reduce(
      (sum, order) => {

        return (
          sum +
          Number(
            order.amount_due || 0
          )
        );

      },
      0
    );

  /* =========================
     ACTIVE ORDERS
  ========================= */

  const activeOrders =
    orders.filter(order => {

      return (
        order.delivery_status !==
          "delivered"
        &&
        order.delivery_status !==
          "cancelled"
      );

    });

  /* =========================
     OVERDUE
  ========================= */

  const overdueOrders =
    orders.filter(order => {

      if (
        order.payment_type ===
        "open_credit"
      ) {
        return false;
      }

      if (!order.due_date) {
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

    });

  /* =========================
     LAST ORDER
  ========================= */

  const lastOrder =
    [...orders]

      .sort((a, b) => {

        return (

          new Date(
            b.created_at
          ).getTime()

          -

          new Date(
            a.created_at
          ).getTime()

        );

      })[0];

  /* =========================
     MONTH TOTAL
  ========================= */

  const now =
    new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const monthOrders =
    orders.filter(order => {

      const d =
        new Date(
          order.created_at
        );

      return (

        d.getMonth() ===
          currentMonth

        &&

        d.getFullYear() ===
          currentYear

      );

    });

  const monthTotal =
    monthOrders.reduce(
      (sum, order) => {

        return (

          sum +
          Number(
            order.total || 0
          )

        );

      },
      0
    );

  /* =========================
     CHARTS
  ========================= */

  const salesMap =
    new Map();

  orders.forEach(order => {

    const label =
      dayjs(order.created_at)
        .format("DD MMM");

    const current =
      salesMap.get(label) || 0;

    salesMap.set(

      label,

      current +
      Number(order.total || 0)

    );

  });

  const salesByMonth =
    Array.from(
      salesMap.entries()
    )

    .map(([label, total]) => ({

      label,

      total

    }));

  /* =========================
     RETURN
  ========================= */

  return {

    kpis: {

      totalSpent,

      totalOrders,

      averageTicket,

      pendingBalance,

      activeOrders:
        activeOrders.length,

      overdueOrders:
        overdueOrders.length,

      overdue:
        overdueOrders.length > 0,

      monthTotal,

      lastOrderDate:
        lastOrder?.created_at || null

    },

    charts: {

      salesByMonth

    },

    commercial: {

      profile:
        profile?.credit_profile ||
        "cash_only"

    },

    /* 🔥 NOW COMES FROM activity_logs */

   recentActivity: [] as any[]

  };

}