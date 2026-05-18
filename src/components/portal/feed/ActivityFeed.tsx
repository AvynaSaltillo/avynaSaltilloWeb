import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FiShoppingBag,
  FiCreditCard,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";

type Activity = {

  type: string;

  title: string;

  created_at: string;

  amount?: number;

  order_id?: string;

  metadata?: any;

};

export default function ActivityFeed() {

  const [items, setItems] =
    useState<Activity[]>([]);

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {

    const loadAnalytics = () => {

      const analytics =
        (window as any)
          .portalAnalytics;

      if (
        analytics?.recentActivity
      ) {

        setItems(
          analytics.recentActivity
        );

      }

    };

    loadAnalytics();

    window.addEventListener(
      "portal-analytics-ready",
      loadAnalytics
    );

    return () => {

      window.removeEventListener(
        "portal-analytics-ready",
        loadAnalytics
      );

    };

  }, []);

  /* =========================
     ICONS
  ========================= */

  const getIcon = (
    type: string
  ) => {

    switch (type) {

      case "payment_received":
        return (
          <FiCreditCard size={16} />
        );

      case "order_delivered":
        return (
          <FiCheckCircle size={16} />
        );

      case "order_updated":
        return (
  <FiRefreshCw size={16} />
);

      case "payment_overdue":
        return (
          <FiAlertTriangle size={16} />
        );

      default:
        return (
          <FiShoppingBag size={16} />
        );

    }

  };

  /* =========================
     COLORS
  ========================= */

  const getColor = (
    type: string
  ) => {

    switch (type) {

      case "payment_received":

        return `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-300
        `;

      case "order_delivered":

        return `
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-300
        `;

      case "order_updated":

        return `
          border-violet-500/20
          bg-violet-500/10
          text-violet-300
        `;

      case "payment_overdue":

        return `
          border-red-500/20
          bg-red-500/10
          text-red-300
        `;

      default:

        return `
          border-white/10
          bg-white/3
          text-white/70
        `;

    }

  };

  /* =========================
     RELATIVE TIME
  ========================= */

  const getRelativeTime = (
    date: string
  ) => {

    const now =
      new Date().getTime();

    const created =
      new Date(date).getTime();

    const diff =
      Math.floor(
        (now - created) / 1000
      );

    if (diff < 60) {
      return "Hace unos segundos";
    }

    if (diff < 3600) {

      const mins =
        Math.floor(diff / 60);

      return `Hace ${mins} min`;

    }

    if (diff < 86400) {

      const hours =
        Math.floor(diff / 3600);

      return `Hace ${hours} h`;

    }

    const days =
      Math.floor(diff / 86400);

    return `Hace ${days} d`;

  };

  /* =========================
     GROUPED
  ========================= */

  const groupedItems =
    useMemo(() => {

      return items.slice(0, 25);

    }, [items]);

  /* =========================
     EMPTY
  ========================= */

  if (!groupedItems.length) {

    return (

      <div className="rounded-4xl border border-white/10 bg-white/3 p-6">

        <div className="flex items-center justify-between gap-3">

          <h2 className="text-2xl font-semibold">
            Actividad reciente
          </h2>

        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/40">

          Sin actividad disponible

        </div>

      </div>

    );

  }

  /* =========================
     RENDER
  ========================= */

  return (

    <div className="rounded-4xl border border-white/10 bg-white/3 p-6">

      <div className="flex items-center justify-between gap-3">

        <h2 className="text-2xl font-semibold">
          Actividad reciente
        </h2>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">

          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>

          En vivo

        </div>

      </div>

      <div
  className="
    mt-6

    max-h-[520px]

    space-y-3

    overflow-y-auto

    pr-2
  "
>

        {groupedItems.map(
          (item, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between

                gap-4

                rounded-2xl

                border
                border-white/10

                bg-black/20

                p-4

                transition

                hover:bg-white/3
              "
            >

              <div className="flex min-w-0 items-center gap-4">

                <div
                  className={`
                    grid

                    h-11
                    w-11

                    shrink-0

                    place-items-center

                    rounded-2xl

                    border

                    ${getColor(item.type)}
                  `}
                >

                  {getIcon(item.type)}

                </div>

                <div className="min-w-0">

                  <p className="truncate font-medium">

                    {item.title}

                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/40">

                    <span>
                      {getRelativeTime(
                        item.created_at
                      )}
                    </span>

                    {item.order_id && (

                      <>
                        <span>
                          •
                        </span>

                        <span>

                          #
                          {item.order_id
                            .slice(0, 8)
                            .toUpperCase()}

                        </span>
                      </>

                    )}

                  </div>

                </div>

              </div>

              <div className="shrink-0 text-right">

                <p className="font-medium">

                  {item.amount
                    ? `$${Number(
                        item.amount
                      ).toLocaleString(
                        "es-MX"
                      )}`
                    : "—"}

                </p>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}