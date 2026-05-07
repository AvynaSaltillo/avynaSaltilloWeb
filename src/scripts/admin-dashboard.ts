import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table =
    document.getElementById("ordersTable");

 const searchInput =
  document.querySelector<HTMLInputElement>(
    "#searchInput"
  );

  const statusFilter =
  document.querySelector<HTMLSelectElement>(
    "#statusFilter"
  );

  const sortFilter =
  document.querySelector<HTMLSelectElement>(
    "#sortFilter"
  );

  const refreshBtn =
  document.querySelector<HTMLButtonElement>(
    "#refreshOrders"
  );

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

  /* =========================
     MONEY
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

  /* =========================
     DATE
  ========================= */

  function date(v: string) {

    return new Date(v)
      .toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
  }

  /* =========================
     STATUS BADGE
  ========================= */

  function badge(status = "") {

    const s =
      status.toLowerCase();

    if (s === "pending") {

      return `
        <span class="badge yellow">
          Pendiente
        </span>
      `;
    }

    if (s === "paid") {

      return `
        <span class="badge green">
          Pagado
        </span>
      `;
    }

    if (s === "cancelled") {

      return `
        <span class="badge red">
          Cancelado
        </span>
      `;
    }

    return `
      <span class="badge">
        ${status}
      </span>
    `;
  }

  /* =========================
     LOAD ORDERS
  ========================= */

  async function loadOrders() {

    let query = supabase
      .from("orders")
      .select(`
        id,
        total,
        status,
        created_at,
        advisor_id,
        client_name,
        business_name
      `)
      .order(
        "created_at",
        { ascending: false }
      );

    // 🔥 ADMIN SOLO VE SUS PEDIDOS
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

      return;
    }

    orders = data || [];

    applyFilters();
  }

  /* =========================
     RENDER
  ========================= */

  function render(list: any[]) {

    if (!table) return;

    if (!list.length) {

      table.innerHTML = `
        <tr>

          <td
            colspan="6"
            class="py-10 text-center text-white/40"
          >
            Sin pedidos
          </td>

        </tr>
      `;

      updateStats([]);

      return;
    }

    table.innerHTML = list.map(o => `

      <tr class="border-b border-white/5 hover:bg-white/3 transition">

        <td class="px-6 py-4 font-medium">

          #${o.id}

        </td>

        <td class="px-6 py-4">

          <div class="font-medium">
            ${o.business_name || "—"}
          </div>

          <div class="text-xs text-white/40">
            ${o.client_name || ""}
          </div>

        </td>

        <td class="px-6 py-4">

          ${badge(o.status)}

        </td>

        <td class="px-6 py-4 font-semibold">

          ${money(o.total)}

        </td>

        <td class="px-6 py-4">

          ${date(o.created_at)}

        </td>

        <td class="px-6 py-4 text-right">

          <a
            href="/admin/order/${o.id}"
            class="btn-action"
          >
            Ver
          </a>

        </td>

      </tr>

    `).join("");

    updateStats(list);
  }

  /* =========================
     KPIS
  ========================= */

  function updateStats(list: any[]) {

    const totalOrders =
      list.length;

    const revenue =
      list.reduce(
        (a, b) =>
          a + Number(b.total || 0),
        0
      );

    const pending =
      list
        .filter(
          o => o.status === "pending"
        )
        .reduce(
          (a, b) =>
            a + Number(b.total || 0),
          0
        );

    const avg =
      totalOrders
        ? revenue / totalOrders
        : 0;

    const kpiOrders =
      document.getElementById(
        "kpiOrders"
      );

    const kpiRevenue =
      document.getElementById(
        "kpiRevenue"
      );

    const kpiPending =
      document.getElementById(
        "kpiPending"
      );

    const kpiAvg =
      document.getElementById(
        "kpiAvg"
      );

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
  }

  /* =========================
     FILTERS
  ========================= */

  function applyFilters() {

    let list = [...orders];

    const search =
      searchInput?.value
        .toLowerCase()
        .trim() || "";

    const status =
      statusFilter?.value || "";

    const sort =
      sortFilter?.value || "";

    /* SEARCH */

    if (search) {

      list = list.filter(o => {

        const business =
          (
            o.business_name || ""
          ).toLowerCase();

        const client =
          (
            o.client_name || ""
          ).toLowerCase();

        return (
          String(o.id)
            .includes(search)
          ||
          business.includes(search)
          ||
          client.includes(search)
        );
      });
    }

    /* STATUS */

    if (status) {

      list = list.filter(
        o => o.status === status
      );
    }

    /* SORT */

    if (sort === "high") {

      list.sort(
        (a, b) =>
          Number(b.total || 0)
          -
          Number(a.total || 0)
      );

    } else if (sort === "low") {

      list.sort(
        (a, b) =>
          Number(a.total || 0)
          -
          Number(b.total || 0)
      );
    }

    render(list);
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
    async () => {

      const btn =
        refreshBtn as HTMLButtonElement;

      btn.disabled = true;

      btn.classList.add(
        "opacity-70"
      );

      await loadOrders();

      btn.disabled = false;

      btn.classList.remove(
        "opacity-70"
      );
    }
  );

  await loadOrders();

});