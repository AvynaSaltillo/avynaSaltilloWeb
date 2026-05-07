// src/scripts/orders.ts
// COMPLETO CORREGIDO + FIX MODAL DUPLICADO

import { supabase } from "../lib/supabase";

type Order = {
  id: string;

  created_at: string;

  status?: string;

  total?: number;

  balance?: number;

  payment_type?: string;

  advisor?: string;

  items?: any[];
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

    /* =========================
       STATE
    ========================= */

    let allOrders: Order[] = [];

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

      if (el)
        el.textContent = value;

    }

    /* =========================
       BADGES
    ========================= */

    function badge(status = "") {

      const s =
        status.toLowerCase();

      if (s.includes("pending")) {

        return `
<span class="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
  Pendiente
</span>
`;

      }

      if (
        s.includes("process") ||
        s.includes("preparing")
      ) {

        return `
<span class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
  Preparando
</span>
`;

      }

      if (
        s.includes("shipped") ||
        s.includes("sent")
      ) {

        return `
<span class="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-300">
  Enviado
</span>
`;

      }

      if (
        s.includes("delivered") ||
        s.includes("done")
      ) {

        return `
<span class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
  Entregado
</span>
`;

      }

      if (
        s.includes("cancel")
      ) {

        return `
<span class="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs text-red-300">
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

            return acc +
              Number(item.total || 0);

          },
          0
        );

      const totalBalance =
        list.reduce(
          (acc, item) => {

            return acc +
              Number(item.balance || 0);

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

      // 🔥 BLOQUEAR DUPLICADOS
      if (modalOpen) return;

      modalOpen = true;

      // 🔥 ELIMINAR EXISTENTES
      document
        .querySelectorAll(
          "#orderDetailsModal"
        )
        .forEach((m) => m.remove());

      const items =
        order.items || [];

const lines =
  items.map((item) => {

    return `
<div class="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">

  <div class="min-w-0 flex-1">

    <p class="truncate text-sm font-medium">
      ${item.name}
    </p>

    <p class="mt-1 text-xs text-white/40">
      ${item.qty} × ${money(item.priceSalon || 0)}
    </p>

  </div>

  <div class="shrink-0 text-right">

    <p class="text-sm font-semibold whitespace-nowrap">
      ${money(item.total || 0)}
    </p>

  </div>

</div>
`;

  }).join("");

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
        #${order.id}
      </h2>

    </div>

    <button
      id="closeOrderModal"
      class="h-10 w-10 shrink-0 rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10"
    >
      ✕
    </button>

  </div>

  <div class="mt-6 grid gap-4 sm:grid-cols-3">

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
        Estatus
      </p>

      <div class="mt-2">
        ${badge(order.status)}
      </div>

    </div>

    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <p class="text-xs text-white/40">
        Pago
      </p>

      <p class="mt-2 text-sm font-medium">

        ${
          order.payment_type === "cash"
            ? "Contado"

            : order.payment_type === "credit_15"
            ? "Crédito 50% entrega + 50% 15 días"

            : order.payment_type === "credit_30"
            ? "Crédito 50% entrega + 50% 30 días"

            : "—"
        }

      </p>

    </div>

  </div>

  <div class="mt-6 max-h-85 overflow-y-auto rounded-2xl border border-white/10 bg-white/2 px-4">

    ${lines}

  </div>

  <div class="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 p-5">

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
        Saldo
      </p>

      <p class="mt-2 text-xl font-semibold ${
        Number(order.balance || 0) > 0
          ? "text-yellow-300"
          : "text-white"
      }">
        ${money(order.balance || 0)}
      </p>

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

          if (e.target === modal)
            close();

        }
      );

      window.addEventListener(
        "keydown",
        (e) => {

          if (e.key === "Escape")
            close();

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
  <td colspan="6" class="py-10 text-center text-white/45">
    No tienes pedidos aún.
  </td>
</tr>
`;

        return;

      }

      table.innerHTML =
        list.map((item) => `

<tr class="border-b border-white/5 transition hover:bg-white/[0.03]">

  <td class="px-4 py-5 font-medium">

    <div>

      <p>
        #${item.id.slice(0, 8)}
      </p>

      <p class="mt-1 text-xs text-white/40">
        ${item.advisor || "AVYNA"}
      </p>

    </div>

  </td>

  <td class="px-4 py-5 text-white/70">
    ${date(item.created_at)}
  </td>

  <td class="px-4 py-5">
    ${badge(item.status)}
  </td>

  <td class="px-4 py-5 font-semibold">
    ${money(item.total || 0)}
  </td>

  <td class="px-4 py-5 ${
    Number(item.balance || 0) > 0
      ? "text-yellow-300"
      : "text-white/70"
  }">

    ${money(item.balance || 0)}

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

`).join("");

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

              (item.status || "")
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
              item.status || ""
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

      renderStats(list);

      renderTable(list);

    }

    /* =========================
       LOAD
    ========================= */

    async function loadOrders() {

      try {

        if (table) {

          table.innerHTML = `
<tr>
  <td colspan="6" class="py-10 text-center text-white/45">
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
            "/auth/login";

          return;

        }

        const {
          data,
          error
        } =
          await supabase
            .from("orders")
            .select("*")
            .eq(
              "user_id",
              user.id
            )
            .order(
              "created_at",
              {
                ascending: false
              }
            );

        if (error)
          throw error;

        allOrders =
          data || [];

        applyFilters();

      } catch (err) {

        console.error(err);

        if (table) {

          table.innerHTML = `
<tr>
  <td colspan="6" class="py-10 text-center text-red-300">
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

    /* =========================
       INIT
    ========================= */

    loadOrders();

  }
);