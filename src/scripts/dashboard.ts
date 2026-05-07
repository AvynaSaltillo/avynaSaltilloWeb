// src/scripts/dashboard.ts

import { supabase } from "../lib/supabase";
import { money } from "./helpers";
import { startCountdown } from "./countdown";

import {
  properCase
} from "../scripts/helpers";

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
  "first_name,status,payment_type"
)
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
      location.href =
        "/auth/signup";
      return;
    }

   if (profile.status === "blocked") {
  await supabase.auth.signOut();
  location.href = "/auth/blocked";
  return;
}

if (profile.status !== "active") {
  location.href = "/auth/login";
  return;
}

    setText(
  "welcomeName",
  `Hola, ${properCase(profile.first_name || "Cliente")}`
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
        .eq("client_id", user.id)
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
        item.amount_due || 0
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

    const avgTicket =
  list.length > 0
    ? monthTotal / list.length
    : 0;

setText(
  "avgTicket",
  money(avgTicket)
);

    /* =========================
   COMMERCIAL ACCOUNT
========================= */

const activeOrders =
  list.filter((item: any) => {

    const status =
      String(
        item.delivery_status || ""
      ).toLowerCase();

    return (
      status !== "delivered" &&
      status !== "cancelled"
    );

  });

const overdue =
  list.some((item: any) => {

    if (!item.due_date) return false;

    return (
      Number(item.amount_due || 0) > 0 &&
      new Date(item.due_date).getTime() < Date.now()
    );

  });

setText(
  "commercialDue",
  money(pending)
);

setText(
  "activeOrders",
  String(activeOrders.length)
);

setText(
  "commercialType",

  profile.payment_type === "credit"
    ? "Crédito comercial"
    : "Pago de contado"
);

const last =
  list[0];

setText(
  "lastOrderDate",

  last?.created_at
    ? new Date(last.created_at)
        .toLocaleDateString("es-MX")
    : "—"
);

/* STATUS */

const commercialStatus =
  $("commercialStatus");

if (commercialStatus) {

  if (overdue) {

    commercialStatus.textContent =
      "Saldo vencido";

    commercialStatus.className =
      "inline-flex h-fit rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300";

  }

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