// src/scripts/dashboard.ts

import { supabase } from "../lib/supabase";
import { money } from "./helpers";
import { startCountdown } from "./countdown";

document.addEventListener("DOMContentLoaded", async () => {
  startCountdown();

  const $ = (id: string) =>
    document.getElementById(id);

  const setText = (
    id: string,
    value: string
  ) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const ordersBox = $("ordersList");

  /* =========================
     LOADING STATE
  ========================= */
  if (ordersBox) {
    ordersBox.innerHTML = `
      <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/45 animate-pulse">
        Cargando pedidos...
      </div>
    `;
  }

  try {
    /* =========================
       SESSION
    ========================= */
const {
  data: { user },
  error: authError
} = await supabase.auth.getUser();

if (authError || !user) {
  location.href = "/auth/login";
  return;
}

    /* =========================
       PROFILE
    ========================= */
    const {
      data: profile
    } =
      await supabase
        .from("profiles")
        .select(
          "first_name,approved"
        )
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
      location.href =
        "/auth/signup";
      return;
    }

    if (
      profile.approved !== true
    ) {
      location.href =
        "/auth/pending";
      return;
    }

    setText(
      "welcomeName",
      `Hola, ${profile.first_name || "Cliente"}`
    );

    /* =========================
       ORDERS
    ========================= */
    const {
      data: orders,
      error
    } =
      await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false
        });

    if (error) {
      throw error;
    }

    const list = orders || [];

    /* =========================
       METRICS
    ========================= */
    const now =
      new Date();

    const month =
      now.getMonth();

    const year =
      now.getFullYear();

    const monthOrders =
      list.filter(
        (item: any) => {
          const d =
            new Date(
              item.created_at
            );

          return (
            d.getMonth() ===
              month &&
            d.getFullYear() ===
              year
          );
        }
      );

    const monthTotal =
      monthOrders.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          Number(
            item.total || 0
          ),
        0
      );

    const pending =
      list.reduce(
        (
          acc: number,
          item: any
        ) =>
          acc +
          Number(
            item.balance || 0
          ),
        0
      );

    setText(
      "monthTotal",
      money(monthTotal)
    );

    setText(
      "ordersCount",
      String(list.length)
    );

    setText(
      "pendingBalance",
      money(pending)
    );

    /* =========================
       LAST ORDER SUMMARY
    ========================= */
    const last =
      list[0];

    if (last) {
      setText(
        "simTotal",
        money(last.total || 0)
      );

      const total =
        Number(
          last.total || 0
        );

      let label =
        "Contado total";

      let down =
        total;

      let balance =
        0;

      if (
        total >= 1500 &&
        total < 10000
      ) {
        label =
          "50% hoy + 50% a 15 días";

        down =
          total * 0.5;

        balance =
          total * 0.5;
      }

      if (
        total >= 10000
      ) {
        label =
          "50% hoy + 50% a 30 días";

        down =
          total * 0.5;

        balance =
          total * 0.5;
      }

      setText(
        "simLabel",
        label
      );

      setText(
        "simDown",
        money(down)
      );

      setText(
        "simBalance",
        money(balance)
      );

      setText(
        "nextDue",
        last.due_date
          ? new Date(
              last.due_date
            ).toLocaleDateString(
              "es-MX"
            )
          : "Sin saldo"
      );
    }

    /* =========================
       LIST RENDER
    ========================= */
    if (!ordersBox) return;

    if (!list.length) {
      ordersBox.innerHTML = `
        <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-white/45">
          Aún no tienes pedidos registrados.
        </div>
      `;
      return;
    }

    ordersBox.innerHTML =
      list
        .slice(0, 5)
        .map(
          (item: any) => `
          <a
            href="/portal/orders"
            class="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 transition hover:bg-white/[0.05]"
          >
            <div>
              <p class="font-medium">
                #${item.id}
              </p>

              <p class="mt-1 text-xs text-white/45">
                ${
                  item.status ||
                  "Registrado"
                }
              </p>
            </div>

            <div class="text-right">
              <p class="font-semibold">
                ${money(
                  item.total || 0
                )}
              </p>

              <p class="mt-1 text-xs text-white/35 group-hover:text-white/55">
                Ver detalle
              </p>
            </div>
          </a>
        `
        )
        .join("");

  } catch (error) {
    console.error(error);

    setText(
      "welcomeName",
      "Bienvenido"
    );

    setText(
      "monthTotal",
      "$0"
    );

    setText(
      "ordersCount",
      "0"
    );

    setText(
      "pendingBalance",
      "$0"
    );

    if (ordersBox) {
      ordersBox.innerHTML = `
        <div class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          No se pudo cargar tu información.
        </div>
      `;
    }
  }
});