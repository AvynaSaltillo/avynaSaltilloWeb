import { supabase } from "../lib/supabase";

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    /* =========================
       ELEMENTS
    ========================= */

    const rangeFilter =
      document.getElementById(
        "rangeFilter"
      ) as HTMLSelectElement | null;

    /* =========================
       AUTH
    ========================= */

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {

      window.location.href =
        "/admin/login";

      return;
    }

    /* =========================
       PROFILE
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
          currency: "MXN"
        }
      ).format(Number(v || 0));
    }

    /* =========================
       RANGE
    ========================= */

    function getRangeDate(
      range: string
    ) {

      const now =
        new Date();

      const d =
        new Date();

      switch (range) {

        case "7d":
          d.setDate(
            now.getDate() - 7
          );
          break;

        case "3m":
          d.setMonth(
            now.getMonth() - 3
          );
          break;

        case "6m":
          d.setMonth(
            now.getMonth() - 6
          );
          break;

        case "1y":
          d.setFullYear(
            now.getFullYear() - 1
          );
          break;

        default:
          d.setMonth(
            now.getMonth() - 1
          );
      }

      return d.toISOString();
    }

    /* =========================
       LOAD DASHBOARD
    ========================= */

    async function loadDashboard() {

      const range =
        rangeFilter?.value || "1m";

      const from =
        getRangeDate(range);

      /* =========================
         ORDERS
      ========================= */

      let ordersQuery =
        supabase
          .from("orders")
          .select(`
            id,
            total,
            status,
            payment_type,
            created_at
          `)
          .gte(
            "created_at",
            from
          );

      // 🔥 admin normal
      if (profile?.role === "admin") {

        ordersQuery =
          ordersQuery.eq(
            "advisor_id",
            user?.id
          );
      }

      const {
        data: orders
      } = await ordersQuery;

      /* =========================
         CLIENTS
      ========================= */

      let clientsQuery =
        supabase
          .from("profiles")
          .select(`
            id,
            status
          `)
          .eq(
            "role",
            "client"
          )
          .eq(
            "status",
            "active"
          );

      if (profile?.role === "admin") {

        clientsQuery =
          clientsQuery.eq(
            "advisor_id",
            user?.id
          );
      }

      const {
        data: clients
      } = await clientsQuery;

      const list =
        orders || [];

      /* =========================
         KPIS
      ========================= */

      const totalSales =
        list.reduce(
          (a, b) =>
            a + Number(b.total || 0),
          0
        );

      const totalOrders =
        list.length;

      const pendingCredit =
        list
          .filter(
            o =>
              o.payment_type ===
              "credit"
          )
          .reduce(
            (a, b) =>
              a + Number(b.total || 0),
            0
          );

      const totalClients =
        clients?.length || 0;

      /* =========================
         RENDER
      ========================= */

      const sales =
        document.getElementById(
          "kpiSales"
        );

      const revenue =
        document.getElementById(
          "kpiRevenue"
        );

      const ordersKpi =
        document.getElementById(
          "kpiOrders"
        );

      const clientsKpi =
        document.getElementById(
          "kpiClients"
        );

      const creditKpi =
        document.getElementById(
          "kpiCredit"
        );

      if (sales) {
        sales.textContent =
          money(totalSales);
      }

      if (revenue) {
        revenue.textContent =
          money(totalSales);
      }

      if (ordersKpi) {
        ordersKpi.textContent =
          String(totalOrders);
      }

      if (clientsKpi) {
        clientsKpi.textContent =
          String(totalClients);
      }

      if (creditKpi) {
        creditKpi.textContent =
          money(pendingCredit);
      }
    }

    /* =========================
       FILTER EVENT
    ========================= */

    rangeFilter?.addEventListener(
      "change",
      loadDashboard
    );

    await loadDashboard();

  }
);