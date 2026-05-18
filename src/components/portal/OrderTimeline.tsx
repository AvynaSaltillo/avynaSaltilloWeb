import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiRefreshCw
} from "react-icons/fi";

dayjs.extend(relativeTime);

type Activity = {

  id: string;

  type: string;

  title: string;

  amount?: number;

  created_at: string;

};

type Props = {

  items: Activity[];

};

function getIcon(type: string) {

  switch (type) {

    case "order_created":
      return (
        <FiShoppingBag size={18} />
      );

    case "payment_received":
      return (
        <FiCreditCard size={18} />
      );

    case "order_delivered":
      return (
        <FiTruck size={18} />
      );

    default:
      return (
        <FiRefreshCw size={18} />
      );

  }

}

export default function OrderTimeline({
  items
}: Props) {

  if (!items?.length) {

    return (

      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/3
          p-6
          text-sm
          text-white/45
        "
      >
        Sin actividad reciente.
      </div>

    );

  }

  return (

    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/3
        p-6
      "
    >

      <div className="space-y-6">

        {items.map((item, index) => (

          <div
            key={item.id}
            className="relative flex gap-4"
          >

            {/* LINE */}

            {index !== items.length - 1 && (

              <div
                className="
                  absolute
                  left-[18px]
                  top-10
                  h-full
                  w-px
                  bg-white/10
                "
              />

            )}

            {/* ICON */}

            <div
              className="
                relative
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-black
                text-white/70
                shrink-0
              "
            >

              {getIcon(item.type)}

            </div>

            {/* CONTENT */}

            <div className="min-w-0 flex-1">

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>

                  <p className="font-medium text-white">

                    {item.title}

                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/45
                    "
                  >

                    {dayjs(
                      item.created_at
                    ).fromNow()}

                  </p>

                </div>

                {item.amount ? (

                  <div
                    className="
                      rounded-xl
                      border
                      border-emerald-500/20
                      bg-emerald-500/10
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-emerald-300
                    "
                  >

                    ${Number(
                      item.amount
                    ).toLocaleString(
                      "es-MX"
                    )}

                  </div>

                ) : null}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}