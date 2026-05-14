// src/scripts/orders.ts

import { supabase } from "../lib/supabase";

import {
  getDeliveryEstimate
} from "../utils/delivery-estimates";

import {
  getOrderTimeline
} from "../utils/order-timeline";

const editIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 20h9"/>
  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
</svg>
`;

const eyeIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
  <circle cx="12" cy="12" r="3"/>
</svg>
`;

type OrderItem = {
  id: string;

  product_name?: string;

  quantity?: number;

  unit_price?: number;

  subtotal?: number;
};

type Order = {
  id: string;

  created_at: string;

  total?: number;

  amount_due?: number;

  amount_paid?: number;

  payment_type?: string;

  payment_status?: string;

  delivery_status?: string;

  order_items?: OrderItem[];

  due_date?: string;

  week_key?: string;

  advisor_name?: string;
};

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    /* =========================
       DOM
    ========================= */

    const $ = (id: string) =>
      document.getElementById(id);

    const table =
      $("ordersTable");

    const searchInput =
      $("searchInput") as HTMLInputElement | null;

    const statusFilter =
      $("statusFilter") as HTMLSelectElement | null;

    const sortFilter =
      $("sortFilter") as HTMLSelectElement | null;

    const refreshBtn =
    
      $("refreshOrders") as HTMLButtonElement | null;

      const prevPage =
  $("prevPage") as HTMLButtonElement | null;

const nextPage =
  $("nextPage") as HTMLButtonElement | null;

const pageNumber =
  $("pageNumber");

const paginationInfo =
  $("paginationInfo");

    /* =========================
       STATE
    ========================= */

    let allOrders: Order[] = [];

    let currentPage = 1;

const perPage = 5;

    let modalOpen = false;

    /* =========================
       HELPERS
    ========================= */

    function money(v = 0) {

      return new Intl.NumberFormat(
        "es-MX",
        {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ).format(Number(v || 0));

    }

    function date(v: string) {

      const d = new Date(v);

      return d.toLocaleString(
        "es-MX",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }
      );

    }

    function setText(
      id: string,
      value: string
    ) {

      const el = $(id);

      if (el) {
        el.textContent = value;
      }

    }

    /* =========================
       DELIVERY BADGES
    ========================= */

    function badge(status = "") {

      const s =
        status.toLowerCase();

      if (s === "waiting_supplier") {

        return `
<span class="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
  Esperando proveedor
</span>
`;

      }

      if (s === "ordered_supplier") {

        return `
<span class="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
  Pedido realizado
</span>
`;

      }

     if (s === "on_route") {

  return `
    <span
      class="
        inline-flex whitespace-nowrap

        rounded-full

        border border-orange-500/20

        bg-orange-500/10

        px-3 py-1

        text-xs

        text-orange-300
      "
    >
      En ruta
    </span>
  `;

}

      if (s === "ready_delivery") {

        return `
<span class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
  Listo para entrega
</span>
`;

      }

      if (s === "delivered") {

        return `
<span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
  Entregado
</span>
`;

      }

      if (s === "cancelled") {

        return `
<span class="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
  Cancelado
</span>
`;

      }

      return `
<span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
  Registrado
</span>
`;

    }

    /* =========================
       PAYMENT BADGES
    ========================= */

    function paymentBadge(status = "") {

      const s =
        status.toLowerCase();

      if (s === "pending") {

        return `
<span class="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
  Pendiente
</span>
`;

      }

      if (s === "partial") {

        return `
<span class="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-300">
  Parcial
</span>
`;

      }

      if (s === "paid") {

        return `
<span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
  Pagado
</span>
`;

      }

      if (s === "overdue") {

        return `
<span class="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
  Vencido
</span>
`;

      }

      return `
<span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
  Sin definir
</span>
`;

    }
  
    function paymentTypeLabel(
  type = ""
){

  switch(type){

    case "cash":
      return "Contado";

    case "credit_15":
      return "Crédito 15 días";

    case "credit_30":
      return "Crédito 30 días";

    case "open_credit":
      return "Crédito abierto";

    default:
      return "Sin definir";

  }

}

    /* =========================
       KPIS
    ========================= */

    function renderStats(
      list: Order[]
    ) {

      const totalOrders =
        list.length;

        const totalAmount =
  list.reduce(
    (acc, item) => {

      return (
        acc +
        Number(item.total || 0)
      );

    },
    0
  );

      const totalBalance =
        list.reduce(
          (acc, item) => {

            return (
              acc +
              Number(item.amount_due || 0)
            );

          },
          0
        );

      setText(
        "ordersTotal",
        String(totalOrders)
      );

      setText(
        "ordersAmount",
        money(totalAmount)
      );

      setText(
        "ordersBalance",
        money(totalBalance)
      );

    }

    /* =========================
       MODAL
    ========================= */

    function showDetails(
      order: Order
    ) {

      if (modalOpen) return;

      modalOpen = true;

      document.body.style.overflow =
        "hidden";

      document
        .querySelectorAll(
          "#orderDetailsModal"
        )
        .forEach((m) => m.remove());

      const items =
        order.order_items || [];

      const lines =
        items.map((item) => {

          return `
<div class="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0 px-5 py-5">

  <div class="min-w-0 flex-1">

    <p class="truncate text-sm font-medium">
      ${item.product_name || "Producto"}
    </p>

    <p class="mt-1 text-xs text-white/40">
      ${item.quantity || 0} × ${money(item.unit_price || 0)}
    </p>

  </div>

  <div class="shrink-0 text-right">

    <p class="text-sm font-semibold whitespace-nowrap">
      ${money(item.subtotal || 0)}
    </p>

  </div>

</div>
`;

        }).join("");



     const overdue =

  order.payment_type !==
  "open_credit"

  &&

  order.due_date

  &&

  Number(order.amount_due || 0) > 0

  &&

  new Date(
    order.due_date
  ).getTime() < Date.now();

  
  const modal =
        document.createElement("div");

      modal.id =
        "orderDetailsModal";

      modal.className = `
fixed inset-0 z-[9999]
flex items-center justify-center
bg-black/70 backdrop-blur-sm
p-4
`;

/* =========================
   DELIVERY TRACKER
========================= */

const steps = [

  {
    key:
      "waiting_supplier",

    label:
      "Proveedor",

    icon:
      "🕓"
  },

  {
    key:
      "ordered_supplier",

    label:
      "Pedido",

    icon:
      "📦"
  },

  {
    key:
      "ready_delivery",

    label:
      "Listo",

    icon:
      "✅"
  },

  {
    key:
      "on_route",

    label:
      "Ruta",

    icon:
      "🚚"
  },

  {
    key:
      "delivered",

    label:
      "Entregado",

    icon:
      "✔"
  }

];

const currentIndex =
  steps.findIndex(
    step =>
      step.key ===
      order.delivery_status
  );

  const estimate =
  getDeliveryEstimate(
    order
  );

modal.innerHTML = `

<div
  class="
    w-full
    max-w-4xl

    overflow-hidden

    rounded-[2rem]

    border
    border-white/10

    bg-[#09090B]/95

    shadow-[0_20px_80px_rgba(0,0,0,0.65)]

    backdrop-blur-2xl
  "
>

  <!-- HEADER -->

  <div
    class="
      flex
      items-start
      justify-between
      gap-4

      border-b
      border-white/5

      px-5
      py-5

      md:px-7
    "
  >

    <div>

      <p
        class="
          text-[11px]
          uppercase
          tracking-[0.32em]
          text-white/35
        "
      >
        Pedido
      </p>

      <h2
        class="
          mt-2

          text-3xl
          font-semibold
          tracking-tight

          md:text-4xl
        "
      >
        #${order.id.slice(0, 8).toUpperCase()}
      </h2>

    </div>

    <button
      id="closeOrderModal"

      class="
        flex
        h-11
        w-11

        shrink-0

        items-center
        justify-center

        rounded-2xl

        border
        border-white/10

        text-lg
        text-white/60

        transition

        hover:bg-white/10
        hover:text-white
      "
    >
      ✕
    </button>

  </div>

  <!-- BODY -->

  <div
    class="
      max-h-[82vh]

      overflow-y-auto

      px-5
py-4

md:px-8
md:py-8
    "
  >

    <!-- TOP GRID -->

    <div
      class="
        grid
        grid-cols-1
        gap-4

        lg:grid-cols-3
      "
    >

      <!-- DATE -->

      <div
        class="
          rounded-[1.5rem]

          border
          border-white/10

          bg-white/[0.03]

          p-4
        "
      >

        <div class="flex items-center gap-3">

          <div
            class="
              flex
              h-11
              w-11

              shrink-0

              items-center
              justify-center

              rounded-2xl

              border
              border-emerald-500/20

              bg-emerald-500/10

              text-lg
            "
          >
            📅
          </div>

          <div class="min-w-0">

            <p class="text-sm text-white/45">
              Fecha
            </p>

            <p
              class="
                mt-1

                text-base
                font-medium
                leading-relaxed
              "
            >
              ${date(order.created_at)}
            </p>

          </div>

        </div>

      </div>

      <!-- PAYMENT -->

      <div
        class="
          rounded-[1.5rem]

          border
          border-white/10

          bg-white/[0.03]

          p-4
        "
      >

        <div class="flex items-center gap-3">

          <div
            class="
              flex
              h-11
              w-11

              shrink-0

              items-center
              justify-center

              rounded-2xl

              border
              border-yellow-500/20

              bg-yellow-500/10

              text-lg
            "
          >
            💳
          </div>

          <div>

            <p class="text-sm text-white/45">
              Pago
            </p>

            <div class="mt-2">
              ${paymentBadge(order.payment_status || "")}
            </div>

          </div>

        </div>

      </div>

      <!-- TERMS -->

      <div
        class="
          rounded-[1.5rem]

          border
          border-white/10

          bg-white/[0.03]

          p-4
        "
      >

        <div class="flex items-center gap-3">

          <div
            class="
              flex
              h-11
              w-11

              shrink-0

              items-center
              justify-center

              rounded-2xl

              border
              border-violet-500/20

              bg-violet-500/10

              text-lg
            "
          >
            %
          </div>

          <div class="min-w-0">

            <p class="text-sm text-white/45">
              Condición
            </p>

            <p
              class="
                mt-1

                text-base
                font-medium
                leading-relaxed
              "
            >

              ${
                order.payment_type ===
                "cash"

                  ? "Contado"

                : order.payment_type ===
                  "credit_15"

                  ? "50% entrega + 50% a 15 días"

                : order.payment_type ===
                  "credit_30"

                  ? "50% entrega + 50% a 30 días"

                : order.payment_type ===
                  "open_credit"

                  ? "Crédito abierto"

                : "Sin definir"
              }

            </p>

          </div>

        </div>

      </div>

    </div>

<!-- STATUS HEADER -->

<div
  class="
    mb-8
    mt-8

    flex

    flex-col

    gap-4

    md:flex-row
    md:items-end
    md:justify-between
  "
>

  <!-- LEFT -->

  <div>

    <p
      class="
        text-[11px]

        uppercase

        tracking-[0.22em]

        text-white/30
      "
    >
      Estado actual
    </p>

    <h3
      class="
        mt-2

        text-[22px]

md:text-[28px]

        font-semibold

        tracking-[-0.03em]

        text-white
      "
    >
      ${estimate.title}
    </h3>

    <p
      class="
        mt-2

        max-w-[480px]

        text-sm

        leading-relaxed

        text-white/55
      "
    >
      ${estimate.description}
    </p>

  </div>

  <!-- ETA -->

<div
  class="
    max-w-[240px]

    rounded-[1.5rem]

    border
    border-white/8

    bg-white/[0.02]

    px-5
    py-4
  "
>

    <p
      class="
        text-[10px]

        uppercase

        tracking-[0.22em]

        text-white/30
      "
    >
      Entrega estimada
    </p>

    <p
      class="
        mt-2

        text-[16px]

        font-semibold

        tracking-[-0.02em]

        text-white
      "
    >
      ${estimate.description}
    </p>

    <p
      class="
        mt-1

        text-xs

        text-white/40
      "
    >
      ${
  order.delivery_status ===
  "delivered"

    ? "Entrega completada exitosamente"

  : order.delivery_status ===
    "on_route"

    ? "Tu pedido llegará pronto"

  : order.delivery_status ===
    "ready_delivery"

    ? (
        order.advisor_name
          ? `${order.advisor_name} está coordinando tu entrega`
          : "Tu asesor está coordinando tu entrega"
      )

  : order.delivery_status ===
    "ordered_supplier"

    ? "Tu pedido está siendo preparado en Guadalajara"

  : "Esperando confirmación de proveedor"
}
    </p>

  </div>

</div>

<!-- CLEAN PREMIUM TRACKER -->

<div
  class="
    mt-10

    overflow-x-auto
  

bg-transparent

    scrollbar-none
  "
>

  <div
    class="
      relative

      flex

      min-w-[680px]

md:min-w-[760px]

      items-center

      justify-between
    "
  >

    ${steps.map((step, index) => {

      const active =
        index <= currentIndex;

      const current =
        index === currentIndex;

      const timeline =
        getOrderTimeline(order);

      const event =
        timeline.find(
          item =>
            item.key === step.key
        );

      const titles: Record<
        string,
        string
      > = {

        waiting_supplier:
          "Confirmado",

        ordered_supplier:
          "Preparación",

        ready_delivery:
          "Listo",

        on_route:
          "En camino",

        delivered:
          "Entregado"

      };

      const descriptions: Record<
        string,
        string
      > = {

        waiting_supplier:
          "Pedido recibido",

        ordered_supplier:
          "Solicitado al proveedor",

        ready_delivery:
          "Disponible para entrega",

        on_route:
          "Tu pedido va en camino",

        delivered:
          "Entrega completada"

      };

      return `

<div
  class="
    relative

    flex
    w-full
    flex-col
    max-w-[170px]

    items-center
  "
>

  <!-- LINE -->

  ${
    index !== steps.length - 1

      ? `

<div
  class="
    absolute

    left-[50%]
    top-[5.5px]

    h-[2.5px]
    w-full

    ${
      active

        ? `
      bg-gradient-to-r
from-emerald-400/70
to-white/5
        `

        : `
          bg-white/10
        `
    }
  "
></div>

`

      : ""
  }

  <!-- DOT -->

  <div
    class="
      relative
      z-10

      h-[13px]
w-[13px]

      rounded-full

      transition-all

      ${
        current

          ? `
            bg-emerald-400

            shadow-[0_0_0_4px_rgba(16,185,129,0.12)]
          `

          : active

          ? `
            bg-emerald-500/80
          `

          : `
            bg-white/20
          `
      }
    "
  >

    ${
      current

        ? `

<div
  class="
    absolute

    inset-[-5px]

    rounded-full

    border
    border-emerald-400/20
  "
></div>

`

        : ""
    }

  </div>

  <!-- CONTENT -->

  <div
    class="
      mt-4

      flex
      h-[72px]

      flex-col

      items-center

      text-center
    "
  >

    <p
      class="
       text-[12px]

md:text-[13px]
        font-medium

        ${
          active
            ? "text-white"
            : "text-white/30"
        }
      "
    >
      ${titles[step.key]}
    </p>

    ${
      current

        ? `

<div class="mt-2">

  <p
    class="
      text-[12px]

      leading-relaxed

      text-white/50
    "
  >
    ${descriptions[step.key]}
  </p>

  ${
    event

      ? `

<p
  class="
    mt-3

    text-[9px]

md:text-[10px]

    uppercase

    tracking-[0.22em]

    text-white/20
  "
>
  ${event.time}
</p>

`

      : ""
  }

</div>

`

        : ""
    }

  </div>

</div>

`;

    }).join("")}

  </div>

</div>
    <!-- ITEMS -->

    <div
      class="
        mt-6

        overflow-hidden

        rounded-[1.75rem]

        border
        border-white/10

        bg-white/[0.02]
      "
    >

      ${lines}

    </div>

    <!-- TOTALS -->

    <div
      class="
        mt-6

        flex
        flex-col
        gap-5

        rounded-[1.75rem]

        border
        border-white/10

        bg-white/[0.03]

        p-5

        md:flex-row
        md:items-center
        md:justify-between
      "
    >

      <div>

        <p class="text-sm text-white/45">
          Total
        </p>

        <p
          class="
            mt-2

            text-4xl
            font-semibold
            tracking-tight
          "
        >
          ${money(order.total || 0)}
        </p>

      </div>

      <div class="text-left md:text-right">

        <p class="text-sm text-white/45">
          Saldo pendiente
        </p>

        <p
          class="
            mt-2

            text-4xl
            font-semibold
            tracking-tight

            ${
              Number(order.amount_due || 0) > 0
                ? "text-yellow-300"
                : "text-white"
            }
          "
        >
          ${money(order.amount_due || 0)}
        </p>

        ${overdue ? `

<div
  class="
    mt-3

    inline-flex

    rounded-full

    border
    border-red-500/20

    bg-red-500/10

    px-3
    py-1

    text-[10px]

    uppercase

    tracking-[0.25em]

    text-red-300
  "
>
  Vencido
</div>

` : ""}

      </div>

    </div>

  </div>

</div>

`;

      document.body.appendChild(
        modal
      );

      function close() {

        modal.remove();

        modalOpen = false;

        document.body.style.overflow =
          "";

      }

      modal
        .querySelector(
          "#closeOrderModal"
        )
        ?.addEventListener(
          "click",
          close
        );

      modal.addEventListener(
        "click",
        (e) => {

          if (e.target === modal) {
            close();
          }

        }
      );

      window.addEventListener(
        "keydown",
        (e) => {

          if (e.key === "Escape") {
            close();
          }

        },
        { once: true }
      );

    }

    /* =========================
       TABLE
    ========================= */

    function renderTable(
      list: Order[]
    ) {

      if (!table) return;

      if (!list.length) {

        table.innerHTML = `
<tr>
  <td colspan="7" class="py-10 text-center text-white/45">
    No tienes pedidos aún.
  </td>
</tr>
`;

        return;

      }

      table.innerHTML =
        list.map((item) => {

         const overdue =

  item.payment_type !==
  "open_credit"

  &&

  item.due_date

  &&

  Number(item.amount_due || 0) > 0

  &&

  new Date(
    item.due_date
  ).getTime() < Date.now();

          return `

<tr class="border-b border-white/5 transition hover:bg-white/[0.03]">

  <td class="px-4 py-5 font-medium">

    <div>

      <p>
       #${item.id.slice(0, 8).toUpperCase()}
      </p>

      <p class="mt-1 text-xs text-white/40">
  ${item.week_key || "Sin semana"}
</p>
    </div>

  </td>

  <td class="px-4 py-5 text-white/70">
    ${date(item.created_at)}
  </td>

  <td class="px-4 py-5">
    ${badge(item.delivery_status || "")}
  </td>

  <td class="px-4 py-5">
    ${paymentBadge(item.payment_status || "")}
  </td>

  <td class="px-4 py-5 font-semibold">
    ${money(item.total || 0)}
  </td>

  <td class="px-4 py-5 ${
    Number(item.amount_due || 0) > 0
      ? "text-yellow-300"
      : "text-white/70"
  }">

    <div class="flex flex-col gap-2">

      <span>
        ${money(item.amount_due || 0)}
      </span>

      ${overdue ? `
<div class="inline-flex w-fit rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-300">
  Vencido
</div>
` : ""}

    </div>

  </td>

<td class="px-4 py-5 text-right">

<div class="flex items-center justify-end gap-2">

  <!-- VER -->

  <button
    data-id="${item.id}"

    class="
      view-order

      inline-flex items-center gap-2

      rounded-2xl

      border border-white/10

      px-4 py-2

      text-sm text-white/75

      transition

      hover:bg-white/10
      hover:text-white
    "
  >

    ${eyeIcon}

    Ver

  </button>

  <!-- EDIT -->

  ${
    item.delivery_status ===
    "waiting_supplier"

      ? `

<a
  href="/portal/new-order?order=${item.id}"

  class="
    inline-flex items-center gap-2

    rounded-2xl

    border border-cyan-500/20

    bg-cyan-500/10

    px-4 py-2

    text-sm text-cyan-200

    transition

    hover:bg-cyan-500/20
  "
>

  ${editIcon}

  Editar

</a>

`

      : ""

  }

</div>

</td>
</tr>

`;

        }).join("");

      document
        .querySelectorAll(".view-order")
        .forEach((btn) => {

          const clone =
            btn.cloneNode(true) as HTMLElement;

          btn.parentNode?.replaceChild(
            clone,
            btn
          );

          clone.addEventListener(
            "click",
            () => {

              const id =
                clone.dataset.id;

              const order =
                allOrders.find(
                  (o) => o.id === id
                );

              if (!order) return;

              showDetails(order);

            }
          );

        });

    }

    /* =========================
       FILTERS
    ========================= */

    function applyFilters() {

      let list = [
        ...allOrders
      ];

      const search =
        searchInput?.value
          .trim()
          .toLowerCase() || "";

      const status =
        statusFilter?.value || "";

      const sort =
        sortFilter?.value ||
        "recent";

      if (search) {

        list = list.filter(
          (item) => {

            return (

              String(item.id)
                .toLowerCase()
                .includes(search)

              ||

              (item.delivery_status || "")
                .toLowerCase()
                .includes(search)
                ||

(item.week_key || "")
  .toLowerCase()
  .includes(search)

            );

          }
        );

      }

      if (status) {

        list = list.filter(
          (item) => {

            return (
              item.delivery_status || ""
            ).toLowerCase() ===
            status.toLowerCase();

          }
        );

      }

      if (sort === "high") {

        list.sort(
          (a, b) => {

            return (
              Number(b.total || 0) -
              Number(a.total || 0)
            );

          }
        );

      }

      else if (
        sort === "low"
      ) {

        list.sort(
          (a, b) => {

            return (
              Number(a.total || 0) -
              Number(b.total || 0)
            );

          }
        );

      }

      else {

        list.sort(
          (a, b) => {

            return (
              new Date(
                b.created_at
              ).getTime()

              -

              new Date(
                a.created_at
              ).getTime()
            );

          }
        );

      }

          /* =========================
   PAGINATION
========================= */

const totalPages =
  Math.max(
    1,
    Math.ceil(
      list.length / perPage
    )
  );

if (
  currentPage > totalPages
) {
  currentPage = totalPages;
}

const start =
  (currentPage - 1) *
  perPage;

const end =
  start + perPage;

const paginated =
  list.slice(start, end);

/* UI */

if (pageNumber) {

  pageNumber.textContent =
    `Página ${currentPage}`;

}

if (paginationInfo) {

  paginationInfo.textContent =
    `${list.length === 0 ? 0 : start + 1} - ${Math.min(end, list.length)} de ${list.length}`;

}

if (prevPage) {

  prevPage.disabled =
    currentPage <= 1;

}

if (nextPage) {

  nextPage.disabled =
    currentPage >= totalPages;

}

      renderStats(list);

      renderTable(paginated);

    }

    /* =========================
       LOAD
    ========================= */

async function loadOrders() {


  try {

    if (table) {

      table.innerHTML = `
<tr>
  <td colspan="7" class="py-10 text-center text-white/45">
    Cargando pedidos...
  </td>
</tr>
`;

    }

    /* =========================
       AUTH
    ========================= */

    const {
      data: { user },
      error: authError
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {

      location.href =
        "/portal/login";

      return;

    }
    
    /* =========================
       ORDERS
    ========================= */

    const {
      data,
      error
    } =
      await supabase
      
        .from("orders")
.select(`
  id,
  created_at,
  advisor_name,
  total,

  amount_due,
  amount_paid,

  payment_type,
  payment_status,

  delivery_status,

  due_date,

  week_key,

  order_items (
            id,
            product_name,
            quantity,
            unit_price,
            subtotal
          ),
          activity_logs (
  *
)
        `)
        .eq(
          "client_id",
          user.id
        )
        .order("created_at", {
          ascending: false
        });

    if (error) {
      throw error;
    }

    allOrders =
      (data as Order[]) || [];

    applyFilters();

  } catch (err) {

    console.error(
      "ORDERS LOAD ERROR",
      err
    );

    if (table) {

      table.innerHTML = `
<tr>
  <td colspan="7" class="py-10 text-center text-red-300">
    No se pudieron cargar los pedidos.
  </td>
</tr>
`;

    }

  }


}

    /* =========================
       EVENTS
    ========================= */

    searchInput?.addEventListener(
      "input",
      applyFilters
    );

    statusFilter?.addEventListener(
      "change",
      applyFilters
    );

    sortFilter?.addEventListener(
      "change",
      applyFilters
    );

    refreshBtn?.addEventListener(
      "click",
      loadOrders
    );

    prevPage?.addEventListener(
  "click",
  () => {

    if (currentPage > 1) {

      currentPage--;

      applyFilters();

    }

  }
);

nextPage?.addEventListener(
  "click",
  () => {

    currentPage++;

    applyFilters();

  }
);

    /* =========================
       INIT
    ========================= */

    loadOrders();

    /* =========================
   REALTIME ORDERS
========================= */

const {
  data: { user }
} =
  await supabase.auth.getUser();

if (user?.id) {

  supabase

    .channel(
      "portal-orders-live"
    )

    .on(
      "postgres_changes",

      {
        event: "*",

        schema: "public",

        table: "orders"
      },

      async (payload) => {

        const row =
          payload.new as any;

        if (!row) {
          return;
        }

        if (
          row.client_id !==
          user.id
        ) {
          return;
        }

        /* =========================
           LIVE REFRESH
        ========================= */

        await loadOrders();

      }
    )

    .subscribe();

}

  }
);