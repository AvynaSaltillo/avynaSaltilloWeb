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

    const s = status.toLowerCase();

    if (s === "pending") {
      return `
        <span class="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
          Pendiente
        </span>
      `;
    }

    if (s === "paid") {
      return `
        <span class="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-300">
          Pagado
        </span>
      `;
    }

    if (s === "cancelled") {
      return `
        <span class="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
          Cancelado
        </span>
      `;
    }

    return `
      <span class="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
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
    balance,
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
      console.error(error);

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
    table.innerHTML = filtered.map((order) => `

      <tr class="border-b border-white/5 hover:bg-white/3 transition">

        <td class="px-6 py-5 font-medium whitespace-nowrap">
          #${order.id}
        </td>

        <td class="px-6 py-5">

          <div class="flex flex-col">

            <span class="font-medium">
              ${order.business_name || "—"}
            </span>

            <span class="text-xs text-white/40 mt-1">
              ${order.client_name || "—"}
            </span>

          </div>

        </td>

        <td class="px-6 py-5">
          ${badge(order.status)}
        </td>

        <td class="px-6 py-5 font-semibold whitespace-nowrap">
          ${money(order.total)}
        </td>

        <td class="px-6 py-5 whitespace-nowrap text-sm text-white/60">
          ${date(order.created_at)}
        </td>

        <td class="px-6 py-5 text-right">

          <a
            href="/admin/order/${order.id}"
            class="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-sm text-white/80 transition hover:bg-white/10"
          >
            Ver
          </a>

        </td>

      </tr>

    `).join("");

  }

  searchInput?.addEventListener("input", render);

  statusFilter?.addEventListener("change", render);

  sortFilter?.addEventListener("change", render);

  refreshBtn?.addEventListener("click", loadOrders);

  loadOrders();

});