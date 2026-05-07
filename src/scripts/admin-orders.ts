// src/scripts/admin-orders.ts

import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table = document.getElementById("ordersTable");

  const searchInput =
    document.getElementById("searchInput") as HTMLInputElement;

  const statusFilter =
    document.getElementById("statusFilter") as HTMLSelectElement;

  const sortFilter =
    document.getElementById("sortFilter") as HTMLSelectElement;

  const refreshBtn =
    document.getElementById("refreshOrders");

  const kpiOrders =
    document.getElementById("kpiOrders");

  const kpiRevenue =
    document.getElementById("kpiRevenue");

  const kpiPending =
    document.getElementById("kpiPending");

  const kpiAvg =
    document.getElementById("kpiAvg");

  let orders: any[] = [];

  /* =========================
   🔐 AUTH
========================= */

const {
  data: { user }
} = await supabase.auth.getUser();

if (!user) {

  window.location.href =
    "/auth/login";

  return;
}

/* =========================
   🔥 PROFILE
========================= */

const {
  data: profile
} = await supabase
  .from("profiles")
  .select(`
    role,
    status
  `)
  .eq("id", user.id)
  .single();

if (
  profile?.role !== "admin" &&
  profile?.role !== "super_admin"
) {

  window.location.href =
    "/portal";

  return;
}

if (profile?.status === "blocked") {

  await supabase.auth.signOut();

  window.location.href =
    "/auth/blocked";

  return;
}

  function money(v = 0) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(v || 0));
  }

  function date(v: string) {
    return new Date(v).toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

function badge(status = "") {

  const s =
    String(status).toLowerCase();

  if (s === "waiting_supplier") {

    return `
      <span
        class="
          inline-flex whitespace-nowrap

          rounded-full

          border border-yellow-500/20

          bg-yellow-500/10

          px-3 py-1

          text-xs

          text-yellow-300
        "
      >
        Esperando proveedor
      </span>
    `;

  }

  if (s === "ordered_supplier") {

    return `
      <span
        class="
          inline-flex whitespace-nowrap

          rounded-full

          border border-sky-500/20

          bg-sky-500/10

          px-3 py-1

          text-xs

          text-sky-300
        "
      >
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
      <span
        class="
          inline-flex whitespace-nowrap

          rounded-full

          border border-emerald-500/20

          bg-emerald-500/10

          px-3 py-1

          text-xs

          text-emerald-300
        "
      >
        Listo entrega
      </span>
    `;

  }

  if (s === "delivered") {

    return `
      <span
        class="
          inline-flex whitespace-nowrap

          rounded-full

          border border-green-500/20

          bg-green-500/10

          px-3 py-1

          text-xs

          text-green-300
        "
      >
        Entregado
      </span>
    `;

  }

  if (s === "cancelled") {

    return `
      <span
        class="
          inline-flex whitespace-nowrap

          rounded-full

          border border-red-500/20

          bg-red-500/10

          px-3 py-1

          text-xs

          text-red-300
        "
      >
        Cancelado
      </span>
    `;

  }

  return `
    <span
      class="
        inline-flex whitespace-nowrap

        rounded-full

        border border-white/10

        bg-white/5

        px-3 py-1

        text-xs

        text-white/70
      "
    >
      ${status}
    </span>
  `;

}

  async function loadOrders() {

    if (!table) return;

    table.innerHTML = `
      <tr>
        <td colspan="6" class="py-16 text-center text-sm text-white/40">
          Cargando...
        </td>
      </tr>
    `;

    let query = supabase
  .from("orders")
  .select(`
    id,
    client_name,
    business_name,
    total,
    amount_paid,
    delivery_status,
    status,
    created_at,
    advisor_id
  `)
  .order("created_at", {
    ascending: false
  });

if (profile?.role === "admin") {

  query = query.eq(
    "advisor_id",
    user!.id
  );
}

const {
  data,
  error
} = await query;
    if (error) {
      console.error(
  "ORDERS ERROR",
  error
);

      table.innerHTML = `
        <tr>
          <td colspan="6" class="py-16 text-center text-sm text-red-400">
            Error cargando pedidos
          </td>
        </tr>
      `;

      return;
    }

    orders = data || [];

    render();
  }

  function render() {

    if (!table) return;

    let filtered = [...orders];

    // SEARCH
    const search =
      searchInput?.value
        ?.trim()
        .toLowerCase() || "";

    if (search) {
      filtered = filtered.filter((o) => {

        return (
          String(o.id).toLowerCase().includes(search) ||
          (o.client_name || "")
            .toLowerCase()
            .includes(search) ||
          (o.business_name || "")
            .toLowerCase()
            .includes(search)
        );

      });
    }

    // STATUS
    const status = statusFilter?.value || "";

    if (status) {
      filtered = filtered.filter(
        (o) => o.status === status
      );
    }

    // SORT
    const sort = sortFilter?.value || "recent";

    if (sort === "high") {
      filtered.sort((a, b) =>
        Number(b.total) - Number(a.total)
      );
    }

    if (sort === "low") {
      filtered.sort((a, b) =>
        Number(a.total) - Number(b.total)
      );
    }

    if (sort === "recent") {
      filtered.sort((a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }

    // KPIS
    const totalOrders = filtered.length;

    const revenue = filtered.reduce((a, b) => {
      return a + Number(b.total || 0);
    }, 0);

    const pending = filtered
      .filter((o) => o.status === "pending")
      .reduce((a, b) => {
        return a + Number(b.balance || 0);
      }, 0);

    const avg =
      totalOrders > 0
        ? revenue / totalOrders
        : 0;

    if (kpiOrders) {
      kpiOrders.textContent =
        String(totalOrders);
    }

    if (kpiRevenue) {
      kpiRevenue.textContent =
        money(revenue);
    }

    if (kpiPending) {
      kpiPending.textContent =
        money(pending);
    }

    if (kpiAvg) {
      kpiAvg.textContent =
        money(avg);
    }

    // EMPTY
    if (!filtered.length) {

      table.innerHTML = `
        <tr>
          <td colspan="6" class="py-16 text-center text-sm text-white/40">
            No hay pedidos
          </td>
        </tr>
      `;

      return;
    }

    // TABLE
table.innerHTML = filtered.map((order) => {

  const initials =
    (
      order.business_name ||
      order.client_name ||
      "A"
    )
    .split(" ")
    .map((w: any[]) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `

    <tr
      class="
        border-b border-white/5

        transition-all duration-300

        hover:bg-white/[0.03]
      "
    >

      <!-- ORDER -->
      <td class="px-6 py-5">

        <div class="flex items-center gap-4">

          <!-- AVATAR -->
          <div
            class="
              grid h-12 w-12 shrink-0 place-items-center

              rounded-2xl

              border border-white/10

              bg-white/[0.04]

              text-sm
              font-semibold
              text-white/80
            "
          >
            ${initials}
          </div>

          <!-- INFO -->
          <div class="min-w-0">

            <p class="font-medium text-white">
              #${String(order.id)
                .slice(0, 8)
                .toUpperCase()}
            </p>

            <p class="mt-1 text-xs text-white/35">
              Pedido comercial
            </p>

          </div>

        </div>

      </td>

      <!-- CLIENT -->
      <td class="px-6 py-5">

        <div class="flex flex-col">

          <span class="font-medium text-white">
            ${order.business_name || "—"}
          </span>

          <span class="mt-1 text-xs text-white/40">
            ${order.client_name || "—"}
          </span>

        </div>

      </td>

      <!-- STATUS -->
      <td class="px-6 py-5 whitespace-nowrap">
  ${badge(order.delivery_status)}
</td>

      <!-- TOTAL -->
      <td class="px-6 py-5">

        <div class="flex flex-col">

          <span class="text-lg font-semibold text-white">
            ${money(order.total)}
          </span>

          <span class="mt-1 text-xs text-white/35">
            Balance:
            ${money((
  Number(order.total || 0) -
  Number(order.amount_paid || 0)
) || 0)}
          </span>

        </div>

      </td>

      <!-- DATE -->
      <td class="px-6 py-5">

        <div class="flex flex-col">

          <span class="text-sm text-white/80">
            ${date(order.created_at)}
          </span>

          <span class="mt-1 text-xs text-emerald-300">
            Live
          </span>

        </div>

      </td>

      <!-- ACTION -->
      <td class="px-6 py-5 text-right">

        <a
          href="/admin/order/${order.id}"
          class="
            inline-flex h-11 items-center justify-center gap-2

            rounded-2xl

            border border-white/10

            bg-white/[0.04]

            px-5

            text-sm text-white/80

            transition-all duration-300

            hover:border-white/20
            hover:bg-white/[0.08]
            hover:text-white
          "
        >

          Ver pedido

        </a>

      </td>

    </tr>

  `;

}).join("");

  }

  searchInput?.addEventListener("input", render);

  statusFilter?.addEventListener("change", render);

  sortFilter?.addEventListener("change", render);

  refreshBtn?.addEventListener("click", loadOrders);

  loadOrders();

});