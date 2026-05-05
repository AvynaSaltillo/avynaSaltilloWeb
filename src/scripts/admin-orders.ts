import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table = document.getElementById("ordersTable");

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

  // 🔥 QUERY PRO (join real)
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

  if (!data || !table) return;

  // KPIs
  const totalOrders = data.length;
  const revenue = data.reduce((a, b) => a + Number(b.total || 0), 0);
  const pending = data
    .filter(o => o.status === "pending")
    .reduce((a, b) => a + Number(b.total || 0), 0);

  const avg = totalOrders ? revenue / totalOrders : 0;

  document.getElementById("kpiOrders").textContent = String(totalOrders);
  document.getElementById("kpiRevenue").textContent = money(revenue);
  document.getElementById("kpiPending").textContent = money(pending);
  document.getElementById("kpiAvg").textContent = money(avg);

  // TABLE
  table.innerHTML = data.map(order => `
    <tr class="border-b border-white/5 hover:bg-white/[0.03] transition">

      <td class="px-6 py-4 font-medium">
        #${order.id}
      </td>

      <td>
        ${order.profiles?.business_name || order.profiles?.name || "—"}
      </td>

      <td>
        ${badge(order.status)}
      </td>

      <td class="font-semibold">
        ${money(order.total)}
      </td>

      <td>
        ${date(order.created_at)}
      </td>

      <td class="text-right px-6">
        <a href="/admin/order/${order.id}" class="btn-action">
          Ver
        </a>
      </td>

    </tr>
  `).join("");

});