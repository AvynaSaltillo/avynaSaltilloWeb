import { supabase }
from "../lib/supabase";

const container =
  document.getElementById(
    "cyclesTable"
  );

function money(v = 0) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN"
    }
  ).format(v);

}

async function loadWeeks() {

  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      client_id,
      week_key,
      delivery_status,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (
    error ||
    !data
  ) {

    console.error(error);

    return;

  }

  if (!container) return;

  /* ========================================
     GROUP BY WEEK
  ======================================== */

  const grouped =
    Object.values(

      data.reduce(
        (acc: any, order: any) => {

          const key =
            order.week_key ||
            "Sin semana";

          if (!acc[key]) {

            acc[key] = {

              week_key: key,

              orders: []

            };

          }

          acc[key]
            .orders
            .push(order);

          return acc;

        },
        {}
      )

    );

  if (!grouped.length) {

    container.innerHTML = `
<div
  class="
    rounded-[2rem]
    border border-white/10
    bg-white/[0.04]
    p-10
    text-center text-white/45
  "
>
  No hay semanas registradas.
</div>
`;

    return;

  }

  container.innerHTML =
    grouped.map((week: any) => {

      const orders =
        week.orders || [];

      const total =
        orders.reduce(
          (
            acc: number,
            item: any
          ) => {

            return (
              acc +
              Number(
                item.total || 0
              )
            );

          },
          0
        );

      const clients =
        new Set(
          orders.map(
            (x: any) =>
              x.client_id
          )
        ).size;

      return `

<a
 href="/admin/cycles/${week.week_key}"

  class="
    group block

    rounded-[1.75rem]

    border border-white/10

    bg-gradient-to-b
    from-white/[0.05]
    to-transparent

    p-5

    transition-all duration-300

    hover:border-white/20
    hover:bg-white/[0.06]
  "
>

  <div class="flex items-start justify-between gap-4">

    <div>

      <p class="text-sm font-medium text-white/90">
        ${week.week_key}
      </p>

      <h3 class="mt-3 text-xl font-semibold tracking-tight">
        ${orders.length} pedidos
      </h3>

    </div>

    <div
      class="
        rounded-full
        border border-emerald-500/20
        bg-emerald-500/10
        px-3 py-1
        text-xs
        text-emerald-300
      "
    >
      Semana
    </div>

  </div>

  <div
    class="
      mt-5

      space-y-4

      rounded-2xl

      border border-white/5

      bg-black/20

      p-4
    "
  >

    <div class="flex items-center justify-between gap-4">

      <p class="text-sm text-white/45">
        Total semanal
      </p>

      <p class="text-lg font-semibold text-white">
        ${money(total)}
      </p>

    </div>

    <div class="flex items-center justify-between gap-4">

      <p class="text-sm text-white/45">
        Clientes
      </p>

      <p class="text-lg font-semibold text-cyan-300">
        ${clients}
      </p>

    </div>

  </div>

</a>

`;

    }).join("");

}

loadWeeks();