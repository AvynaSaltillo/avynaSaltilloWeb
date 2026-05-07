// src/scripts/orders.ts

import { supabase } from "../lib/supabase";

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

  status?: string;

  total?: number;

  amount_due?: number;

  amount_paid?: number;

  payment_type?: string;

  payment_status?: string;

  delivery_status?: string;

  order_items?: OrderItem[];

  due_date?: string;
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

      if (s === "in_transit") {

        return `
<span class="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
  En tránsito
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
<div class="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">

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
        order.due_date
        && Number(order.amount_due || 0) > 0
        && new Date(order.due_date).getTime() < Date.now();

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

      modal.innerHTML = `

<div class="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

  <div class="flex items-start justify-between gap-4">

    <div>

      <p class="text-xs uppercase tracking-[0.3em] text-white/40">
        Pedido
      </p>

      <h2 class="mt-2 text-2xl font-semibold break-all">
        #${order.id.slice(0, 8).toUpperCase()}
      </h2>

    </div>

    <button
      id="closeOrderModal"
      class="h-10 w-10 shrink-0 rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10"
    >
      ✕
    </button>

  </div>

  <div class="mt-6 grid gap-4 sm:grid-cols-4">

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p class="text-xs text-white/40">
        Fecha
      </p>

      <p class="mt-2 text-sm font-medium">
        ${date(order.created_at)}
      </p>

    </div>

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p class="text-xs text-white/40">
        Delivery
      </p>

      <div class="mt-2">
        ${badge(order.delivery_status || order.status || "")}
      </div>

    </div>

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p class="text-xs text-white/40">
        Pago
      </p>

      <div class="mt-2">
        ${paymentBadge(order.payment_status || "")}
      </div>

    </div>

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p class="text-xs text-white/40">
        Condición
      </p>

      <p class="mt-2 text-sm font-medium">

        ${
          order.payment_type === "cash"

            ? "Contado"

            : Number(order.total || 0) >= 10000

            ? "50% entrega + 50% a 30 días"

            : "50% entrega + 50% a 15 días"
        }

      </p>

    </div>

  </div>

  <div class="mt-6 max-h-[340px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] px-4">

    ${lines}

  </div>

  <div class="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">

    <div>

      <p class="text-xs text-white/40">
        Total
      </p>

      <p class="mt-2 text-2xl font-semibold">
        ${money(order.total || 0)}
      </p>

    </div>

    <div class="text-right">

      <p class="text-xs text-white/40">
        Saldo pendiente
      </p>

      <p class="mt-2 text-xl font-semibold ${
        Number(order.amount_due || 0) > 0
          ? "text-yellow-300"
          : "text-white"
      }">
        ${money(order.amount_due || 0)}
      </p>

      ${overdue ? `
<div class="mt-3 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-300">
  Vencido
</div>
` : ""}

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
            item.due_date
            && Number(item.amount_due || 0) > 0
            && new Date(item.due_date).getTime() < Date.now();

          return `

<tr class="border-b border-white/5 transition hover:bg-white/[0.03]">

  <td class="px-4 py-5 font-medium">

    <div>

      <p>
        #${item.id.slice(0, 8)}
      </p>

      <p class="mt-1 text-xs text-white/40">
        Pedido registrado
      </p>

    </div>

  </td>

  <td class="px-4 py-5 text-white/70">
    ${date(item.created_at)}
  </td>

  <td class="px-4 py-5">
    ${badge(item.delivery_status || item.status || "")}
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

    <button
      data-id="${item.id}"
      class="view-order rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
    >
      Ver detalle
    </button>

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

        const {
          data,
          error
        } =
          await supabase
            .from("orders")
            .select(`
              id,
              created_at,

              total,

              amount_due,
              amount_paid,

              payment_type,
              payment_status,

              delivery_status,
              status,

              due_date,

              order_items (
                id,
                product_name,
                quantity,
                unit_price,
                subtotal
              )
            `)
            .eq("client_id", user.id)
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

        console.error(err);

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

  }
);