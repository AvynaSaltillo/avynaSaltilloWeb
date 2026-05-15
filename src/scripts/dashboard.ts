// src/scripts/dashboard.ts

import { supabase } from "../lib/supabase";

import { money } from "./helpers";

import { startCountdown } from "./countdown";

import { toast } from "sonner";

import {
  properCase
} from "../scripts/helpers";

import {
  getClientAnalytics
} from "../services/analytics.service";

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    startCountdown();

    await loadDashboard();

  }
);

/* =========================
   DASHBOARD LOADER
========================= */

async function loadDashboard() {

  const $ = (id: string) =>
    document.getElementById(id);

  const setText = (
    id: string,
    value: string
  ) => {

    const el = $(id);

    if (el) {
      el.textContent = value;
    }

  };

  const ordersBox =
    $("ordersList");

  /* =========================
     LOADING
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

    /* =========================
       PROFILE
    ========================= */

    const {
      data: profile
    } =
      await supabase

        .from("profiles")

        .select(`
          first_name,
          status,
          credit_profile
        `)

        .eq("id", user.id)

        .maybeSingle();

    if (!profile) {

      location.href =
        "/auth/signup";

      return;

    }

    if (
      profile.status ===
      "blocked"
    ) {

      await supabase.auth.signOut();

      location.href =
        "/auth/blocked";

      return;

    }

    if (
      profile.status !==
      "active"
    ) {

      location.href =
        "/auth/login";

      return;

    }

    setText(

      "welcomeName",

      `Hola, ${
        properCase(
          profile.first_name ||
          "Cliente"
        )
      }`

    );

    /* =========================
       ORDERS
    ========================= */

    const {
      data: orders,
      error: ordersError
    } =
      await supabase

        .from("orders")
.select("*")
.eq(
  "client_id",
  user.id
)
.neq(
  "delivery_status",
  "cancelled"
)
.order(
  "created_at",
  {
    ascending: false
  }
        );

    if (ordersError) {
      throw ordersError;
    }

    const list =
      orders || [];

    /* =========================
       ACTIVITY LOGS
    ========================= */

    const {
      data: activityLogs,
      error: activityError
    } =
      await supabase

        .from("activity_logs")

        .select("*")

        .eq(
          "client_id",
          user.id
        )

        .order(
          "created_at",
          {
            ascending: false
          }
        )

        .limit(15);

    if (activityError) {
      throw activityError;
    }

    /* =========================
       ANALYTICS
    ========================= */

    const analytics =
      getClientAnalytics(
        list,
        profile
      );

    analytics.recentActivity =
      activityLogs || [];

    /* =========================
       GLOBAL ANALYTICS
    ========================= */

    (
      window as any
    ).portalAnalytics =
      analytics;

    window.dispatchEvent(

      new CustomEvent(
        "portal-analytics-ready"
      )

    );

    /* =========================
       KPI RENDER
    ========================= */

    setText(
      "monthTotal",

      money(
        analytics.kpis
          .monthTotal
      )
    );

    setText(
      "ordersCount",

      String(
        analytics.kpis
          .totalOrders
      )
    );

    setText(
      "avgTicket",

      money(
        analytics.kpis
          .averageTicket
      )
    );

    /* =========================
       COMMERCIAL ACCOUNT
    ========================= */

    setText(
      "commercialDue",

      money(
        analytics.kpis
          .pendingBalance
      )
    );

    setText(
      "activeOrders",

      String(
        analytics.kpis
          .activeOrders
      )
    );

    setText(

      "commercialType",

      analytics.commercial
        .profile ===
        "auto_terms"

        ? "Crédito automático"

      : analytics.commercial
          .profile ===
          "open_credit"

        ? "Crédito abierto"

        : "Pago de contado"

    );

    setText(

      "lastOrderDate",

      analytics.kpis
        .lastOrderDate

        ? new Date(
            analytics.kpis
              .lastOrderDate
          ).toLocaleDateString(
            "es-MX"
          )

        : "—"

    );

    /* =========================
       COMMERCIAL STATUS
    ========================= */

    const commercialStatus =
      $("commercialStatus");

    if (commercialStatus) {

      if (
        analytics.kpis.overdue
      ) {

        commercialStatus.textContent =
          "Saldo vencido";

        commercialStatus.className =
          "inline-flex h-fit rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300";

      } else {

        commercialStatus.textContent =
          "Cuenta al corriente";

        commercialStatus.className =
          "inline-flex h-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300";

      }

    }

    /* =========================
       RECENT ORDERS
    ========================= */

    if (!ordersBox) {
      return;
    }

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

        .slice(0, 3)

        .map((item: any) => {

          const paymentLabel =

            item.payment_type ===
            "cash"

              ? "Contado"

            : item.payment_type ===
                "credit_15"

              ? "Crédito 15 días"

            : item.payment_type ===
                "credit_30"

              ? "Crédito 30 días"

            : item.payment_type ===
                "open_credit"

              ? "Crédito abierto"

              : "Registrado";

          return `

            <a
              href="/portal/orders"
              class="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 transition hover:bg-white/[0.05]"
            >

              <div>

                <p class="font-medium">
                  #${item.id.toUpperCase()}
                </p>

                <p class="mt-1 text-xs text-white/45">
                  ${paymentLabel}
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

          `;

        })

        .join("");

        /* =========================
   REALTIME ACTIVITY FEED
========================= */

supabase

  .channel(
    "portal-activity-feed"
  )

  .on(
    "postgres_changes",

    {
      event: "INSERT",

      schema: "public",

      table: "activity_logs"
    },

    (payload) => {

      const activity =
        payload.new as any;

      if (!activity) {
        return;
      }

      if (
        activity.client_id !==
        user.id
      ) {
        return;
      }

      const analytics =
        (window as any)
          .portalAnalytics;

      if (!analytics) {
        return;
      }

      analytics.recentActivity = [

        activity,

        ...(analytics
          .recentActivity || [])

      ].slice(0, 15);

      window.dispatchEvent(

        new CustomEvent(
          "portal-analytics-ready"
        )

      );

    }
  )

  .subscribe();

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
      "avgTicket",
      "$0"
    );

    setText(
      "commercialDue",
      "$0"
    );

    setText(
      "activeOrders",
      "0"
    );

    if (ordersBox) {

      ordersBox.innerHTML = `
        <div class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          No se pudo cargar tu información.
        </div>
      `;

    }

  }

}
