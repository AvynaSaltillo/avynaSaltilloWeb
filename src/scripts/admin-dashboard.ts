import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table = document.getElementById("ordersTable");
  const searchInput = document.getElementById("searchInput") as HTMLInputElement;
  const statusFilter = document.getElementById("statusFilter") as HTMLSelectElement;
  const sortFilter = document.getElementById("sortFilter") as HTMLSelectElement;
  const refreshBtn = document.getElementById("refreshOrders");

  let orders: any[] = [];

  function money(v = 0) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(Number(v));
  }

  function date(v: string) {
    return new Date(v).toLocaleDateString("es-MX");
  }

  function badge(status = "") {
    const s = status.toLowerCase();

    if (s === "pending")
      return `<span class="badge yellow">Pendiente</span>`;

    if (s === "paid")
      return `<span class="badge green">Pagado</span>`;

    if (s === "cancelled")
      return `<span class="badge red">Cancelado</span>`;

    return `<span class="badge">${status}</span>`;
  }

  async function loadOrders() {

    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        total,
        status,
        created_at,
        profiles (
          name,
          business_name
        )
      `)
      .order("created_at", { ascending: false });

    orders = data || [];
    applyFilters();
  }

  function render(list: any[]) {

    if (!table) return;

    if (!list.length) {
      table.innerHTML = `
        <tr>
          <td colspan="6" class="py-10 text-center text-white/40">
            Sin pedidos
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = list.map(o => `
      <tr class="border-b border-white/5 hover:bg-white/[0.03]">

        <td class="px-6 py-4 font-medium">
          #${o.id}
        </td>

        <td>
          ${o.profiles?.business_name || o.profiles?.name || "—"}
        </td>

        <td>
          ${badge(o.status)}
        </td>

        <td class="font-semibold">
          ${money(o.total)}
        </td>

        <td>
          ${date(o.created_at)}
        </td>

        <td class="text-right px-6">
          <a href="/admin/order/${o.id}" class="btn-action">
            Ver
          </a>
        </td>

      </tr>
    `).join("");

    updateStats(list);
  }

  function updateStats(list: any[]) {

    const totalOrders = list.length;

    const revenue = list.reduce((a, b) => a + Number(b.total || 0), 0);

    const pending = list
      .filter(o => o.status === "pending")
      .reduce((a, b) => a + Number(b.total || 0), 0);

    const avg = totalOrders ? revenue / totalOrders : 0;

    document.getElementById("kpiOrders").textContent = String(totalOrders);
    document.getElementById("kpiRevenue").textContent = money(revenue);
    document.getElementById("kpiPending").textContent = money(pending);
    document.getElementById("kpiAvg").textContent = money(avg);
  }

  function applyFilters() {

    let list = [...orders];

    const search = searchInput?.value.toLowerCase() || "";
    const status = statusFilter?.value;
    const sort = sortFilter?.value;

    if (search) {
      list = list.filter(o =>
        String(o.id).includes(search) ||
        (o.profiles?.business_name || "")
          .toLowerCase()
          .includes(search)
      );
    }

    if (status) {
      list = list.filter(o => o.status === status);
    }

    if (sort === "high") {
      list.sort((a, b) => b.total - a.total);
    } else if (sort === "low") {
      list.sort((a, b) => a.total - b.total);
    }

    render(list);
  }

  // EVENTS
  searchInput?.addEventListener("input", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);
  sortFilter?.addEventListener("change", applyFilters);
  refreshBtn?.addEventListener("click", loadOrders);

  await loadOrders();

});