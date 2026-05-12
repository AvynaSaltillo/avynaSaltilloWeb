import { supabase } from "../lib/supabase";

const weekKey =
  (
    window as any
  ).__WEEK_KEY__;

/* =========================
   PAGINATION
========================= */

let currentPage = 1;

let perPage = 4;

/* =========================
   DOM
========================= */

const $ = (id: string) =>
  document.getElementById(id);

const title =
  $("cycleTitle");

const dates =
  $("cycleDates");

const ordersContainer =
  $("cycleOrders");

const consolidated =
  $("consolidatedProducts");

const pagination =
  $("ordersPagination");

const perPageSelect =
  $("perPage") as HTMLSelectElement;

/* KPIS */

const kpiOrders =
  $("kpiOrders");

const kpiRevenue =
  $("kpiRevenue");

const kpiDistributor =
  $("kpiDistributor");

const kpiDelivered =
  $("kpiDelivered");

/* =========================
   HELPERS
========================= */

function money(v = 0) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN"
    }
  ).format(v);

}

function date(v: string) {

  return new Date(v)
    .toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

}

function badge(
  status = ""
) {

  if (
    status === "delivered"
  ) {

    return `
<span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
  Entregado
</span>
`;

  }

  if (
    status === "on_route"
  ) {

    return `
<span class="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
  En ruta
</span>
`;

  }

  if (
    status === "ready_delivery"
  ) {

    return `
<span class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
  Pedido listo
</span>
`;

  }

  if (
    status === "ordered_supplier"
  ) {

    return `
<span class="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
  Pedido realizado
</span>
`;

  }

  return `
<span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
  Esperando proveedor
</span>
`;

}

function paymentBadge(
  status = ""
) {

  if (status === "paid") {

    return `
<span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
  Pagado
</span>
`;

  }

  if (
    status === "partial"
  ) {

    return `
<span class="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
  Parcial
</span>
`;

  }

  return `
<span class="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
  Pendiente
</span>
`;

}

/* =========================
   LOAD
========================= */

async function load() {

  if (!weekKey) {
    return;
  }

  const {
    data: orders,
    error
  } = await supabase
    .from("orders")
    .select(`

      id,

      client_name,
      business_name,

      total,
      amount_paid,
      amount_due,

      delivery_status,
      payment_status,

      created_at,

      week_key,

      order_items (
        id,
        product_name,
        quantity,
        subtotal
      )

    `)
    .eq(
      "week_key",
      weekKey
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (
    error ||
    !orders
  ) {

    console.error(error);

    return;

  }

  /* =========================
     HEADER
  ========================= */

if (title || dates) {

  const parts =
    weekKey.split("-");

  const startDate =
    new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      12
    );

  const endDate =
    new Date(startDate);

  endDate.setDate(
    endDate.getDate() + 6
  );

  const range =
    `${date(startDate.toISOString())} → ${date(endDate.toISOString())}`;

  if (title) {
    title.textContent =
      range;
  }

  if (dates) {
    dates.textContent =
      range;
  }

}

  const start =
    (currentPage - 1) * perPage;

  const end =
    start + perPage;

  const visibleOrders =
    orders.slice(start, end);

  const totalPages =
    Math.ceil(
      orders.length / perPage
    );

  /* =========================
     KPIS
  ========================= */

  const revenue =
    orders.reduce(
      (
        acc: number,
        item: any
      ) =>
        acc +
        Number(
          item.total || 0
        ),
      0
    );

  const distributor =
    revenue * 0.6;

  const delivered =
    orders.filter(
      (x: any) =>
        x.delivery_status ===
        "delivered"
    ).length;

  kpiOrders &&
    (kpiOrders.textContent =
      String(
        orders.length
      ));

  kpiRevenue &&
    (kpiRevenue.textContent =
      money(revenue));

  kpiDistributor &&
    (kpiDistributor.textContent =
      money(distributor));

  kpiDelivered &&
    (kpiDelivered.textContent =
      String(delivered));

  /* =========================
     CONSOLIDATED
  ========================= */

  const map =
    new Map();

  orders.forEach(
    (order: any) => {

      (
        order.order_items || []
      ).forEach(
        (item: any) => {

          const current =
            map.get(
              item.product_name
            ) || 0;

          map.set(
            item.product_name,
            current +
            Number(
              item.quantity || 0
            )
          );

        }
      );

    }
  );

  const products =
    Array.from(
      map.entries()
    ).sort(
      (
        a: any,
        b: any
      ) => b[1] - a[1]
    );

  if (consolidated) {

    consolidated.innerHTML =
      products.map(
        ([name, qty]) => {

          return `
<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

  <p class="text-sm text-white/40">
    Producto
  </p>

  <h3 class="mt-2 text-lg font-semibold">
    ${name}
  </h3>

  <p class="mt-4 text-2xl font-semibold">
    ${qty}
  </p>

  <p class="mt-1 text-xs uppercase tracking-[0.25em] text-white/30">
    Unidades
  </p>

</div>
`;

        }
      ).join("");

  }

  /* =========================
     ORDERS FEED
  ========================= */

  if (ordersContainer) {

    ordersContainer.innerHTML =
      visibleOrders.map(
        (order: any) => {

          const items =
            order.order_items || [];

          return `

<a
  href="/admin/order/${order.id}"

  class="
    group block

    rounded-[1.25rem]

    border border-white/10

    bg-white/[0.04]

    p-4

    transition-all duration-300

    hover:border-white/20
    hover:bg-white/[0.055]
  "
>

  <div class="flex items-start justify-between gap-3">

    <div>

      <p class="text-sm font-medium text-white/90">
        ${date(order.created_at)}
      </p>

      <p class="mt-1 text-lg font-semibold tracking-tight">
        ${order.client_name || "—"}
      </p>

      <p class="mt-2 text-xs text-white/60">
        ${order.business_name || "—"}
      </p>

    </div>

    <div class="shrink-0">

      ${badge(order.delivery_status)}

    </div>

  </div>

  <div
    class="
      mt-4

      overflow-hidden

      rounded-xl

      border border-white/5

      bg-black/20
    "
  >

    <div
      class="
        grid grid-cols-[52px_1fr_90px]

        border-b border-white/5

        px-3 py-2

        text-[11px]
        font-medium
        uppercase
        tracking-[0.2em]

        text-white/35
      "
    >

      <span>
        Qty
      </span>

      <span>
        Producto
      </span>

      <span class="text-right">
        Total
      </span>

    </div>

    <div
      class="
        max-h-[240px]

        overflow-y-auto
      "
    >

      ${items
        .map(
          (item: any) => {

            return `
<div
  class="
    grid grid-cols-[52px_1fr_90px]

    border-b border-white/5

    px-3 py-2.5

    text-sm
  "
>

  <div class="font-medium text-white/70">
    ${item.quantity}
  </div>

  <div class="pr-3 text-white/90">
    ${item.product_name}
  </div>

  <div class="text-right font-semibold text-white">
    ${money(item.subtotal || 0)}
  </div>

</div>
`;

          }
        )
        .join("")}

    </div>

  </div>

  <div
    class="
      mt-4

      border-t border-white/10

      pt-4
    "
  >

    <div class="flex items-center justify-between">

      <div>

        ${paymentBadge(order.payment_status)}

      </div>

      <div class="text-right">

        <p class="text-[11px] uppercase tracking-[0.2em] text-white/30">
          Total
        </p>

        <p class="mt-1 text-xl font-semibold">
          ${money(order.total)}
        </p>

      </div>

    </div>

    <div
      class="
        mt-4

        flex items-center justify-between
      "
    >

      <p class="text-xs text-white/35">
        Precio distribuidor
      </p>

      <p class="text-sm font-semibold text-cyan-300">
        ${money(
          Number(order.total || 0) * 0.6
        )}
      </p>

    </div>

  </div>

</a>

`;

        }
      ).join("");

  }

  /* =========================
     PAGINATION
  ========================= */

  if (pagination) {

    pagination.innerHTML =
      Array.from(
        { length: totalPages },
        (_, i) => {

          const page =
            i + 1;

          return `
<button
  data-page="${page}"

  class="
    h-10 min-w-[40px]

    rounded-xl

    border border-white/10

    px-3

    text-sm

    transition

    ${
      currentPage === page
      ? "bg-white text-black"
      : "bg-white/[0.04] text-white hover:bg-white/10"
    }
  "
>
  ${page}
</button>
`;

        }
      ).join("");

    pagination
      .querySelectorAll("button")
      .forEach((btn) => {

        btn.addEventListener(
          "click",
          () => {

            currentPage =
              Number(
                btn.getAttribute(
                  "data-page"
                )
              );

            load();

          }
        );

      });

  }

}

perPageSelect?.addEventListener(
  "change",
  () => {

    perPage =
      Number(
        perPageSelect.value
      );

    currentPage = 1;

    load();

  }
);

load();