// src/scripts/orders.ts

import { supabase } from "../lib/supabase";

type Order = {
  id: number | string;
  created_at: string;
  status?: string;
  total?: number;
  balance?: number;
};

document.addEventListener("DOMContentLoaded", async () => {
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

  let allOrders: Order[] = [];

  /* =========================
     HELPERS
  ========================= */
  function money(v = 0) {
    return new Intl.NumberFormat(
      "es-MX",
      {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0
      }
    ).format(Number(v));
  }

  function date(v: string) {
    return new Date(v).toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  }

  function badge(status = "") {
    const s =
      status.toLowerCase();

    if (s.includes("pend")) {
      return `
        <span class="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
          Pendiente
        </span>
      `;
    }

    if (s.includes("pro")) {
      return `
        <span class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
          Proceso
        </span>
      `;
    }

    if (s.includes("env")) {
      return `
        <span class="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-300">
          Enviado
        </span>
      `;
    }

    if (
      s.includes("ent") ||
      s.includes("done")
    ) {
      return `
        <span class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          Entregado
        </span>
      `;
    }

    return `
      <span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
        Registrado
      </span>
    `;
  }

  function setText(
    id: string,
    value: string
  ) {
    const el = $(id);
    if (el) el.textContent = value;
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
        (acc, item) =>
          acc +
          Number(
            item.total || 0
          ),
        0
      );

    const totalBalance =
      list.reduce(
        (acc, item) =>
          acc +
          Number(
            item.balance || 0
          ),
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
     TABLE
  ========================= */
  function renderTable(
    list: Order[]
  ) {
    if (!table) return;

    if (!list.length) {
      table.innerHTML = `
        <tr>
          <td colspan="6" class="py-8 text-center text-white/45">
            No se encontraron pedidos.
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML =
      list.map(
        (item) => `
        <tr class="hover:bg-white/[0.02] transition">
          <td class="py-4 font-medium">
            #${item.id}
          </td>

          <td class="py-4 text-white/70">
            ${date(item.created_at)}
          </td>

          <td class="py-4">
            ${badge(item.status)}
          </td>

          <td class="py-4 font-medium">
            ${money(item.total || 0)}
          </td>

          <td class="py-4 ${
            Number(item.balance || 0) > 0
              ? "text-yellow-300"
              : "text-white/70"
          }">
            ${money(item.balance || 0)}
          </td>

          <td class="py-4 text-right">
            <button
              data-id="${item.id}"
              class="view-order rounded-xl border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Ver
            </button>
          </td>
        </tr>
      `
      ).join("");

    document
      .querySelectorAll(
        ".view-order"
      )
      .forEach((btn) => {
        btn.addEventListener(
          "click",
          () => {
            const id =
              (
                btn as HTMLElement
              ).dataset.id;

            alert(
              `Detalle pedido #${id}\n(Próximamente modal premium)`
            );
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
        (item) =>
          String(
            item.id
          ).includes(search) ||
          (
            item.status || ""
          )
            .toLowerCase()
            .includes(search)
      );
    }

    if (status) {
      list = list.filter(
        (item) =>
          (
            item.status || ""
          ).toLowerCase() ===
          status.toLowerCase()
      );
    }

    if (sort === "high") {
      list.sort(
        (a, b) =>
          Number(
            b.total || 0
          ) -
          Number(
            a.total || 0
          )
      );
    }

    else if (
      sort === "low"
    ) {
      list.sort(
        (a, b) =>
          Number(
            a.total || 0
          ) -
          Number(
            b.total || 0
          )
      );
    }

    else {
      list.sort(
        (a, b) =>
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
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
            <td colspan="6" class="py-8 text-center text-white/45">
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
            <td colspan="6" class="py-8 text-center text-red-300">
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

  loadOrders();
});