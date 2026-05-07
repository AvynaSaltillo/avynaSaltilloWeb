// src/scripts/admin-order-detail.ts

import { supabase } from "../lib/supabase";

declare global {
  interface Window {
    __ORDER_ID__: string;
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  const orderId = window.__ORDER_ID__;

  // ELEMENTS
  const orderTitle = document.getElementById("orderTitle");
  const orderDate = document.getElementById("orderDate");

  const clientName = document.getElementById("clientName");
  const businessName = document.getElementById("businessName");
  const advisorName = document.getElementById("advisorName");

  const paymentType = document.getElementById("paymentType");
  const orderTotal = document.getElementById("orderTotal");
  const orderBalance = document.getElementById("orderBalance");

  const statusBadge = document.getElementById("statusBadge");

  const addressLine = document.getElementById("addressLine");
  const colony = document.getElementById("colony");
  const cityState = document.getElementById("cityState");

  const itemsContainer = document.getElementById("itemsContainer");

  const markPaidBtn = document.getElementById("markPaid");
  const cancelBtn = document.getElementById("cancelOrder");

  function money(v = 0) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(v || 0));
  }

  function formatDate(v: string) {
    return new Date(v).toLocaleString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function paymentLabel(total = 0) {

    const amount = Number(total || 0);

    if (amount >= 10000) {
      return "Crédito 50% entrega + 50% 30 días";
    }

    if (amount >= 1500) {
      return "Crédito 50% entrega + 50% 15 días";
    }

    return "Contado";
  }

  function badge(status = "") {

    const s = status.toLowerCase();

    if (!statusBadge) return;

    statusBadge.className =
      "inline-flex rounded-full px-4 py-2 text-sm border";

    if (s === "pending") {

      statusBadge.classList.add(
        "border-yellow-500/20",
        "bg-yellow-500/10",
        "text-yellow-300"
      );

      statusBadge.textContent = "Pendiente";

      return;
    }

    if (s === "paid") {

      statusBadge.classList.add(
        "border-green-500/20",
        "bg-green-500/10",
        "text-green-300"
      );

      statusBadge.textContent = "Pagado";

      return;
    }

    if (s === "cancelled") {

      statusBadge.classList.add(
        "border-red-500/20",
        "bg-red-500/10",
        "text-red-300"
      );

      statusBadge.textContent = "Cancelado";

      return;
    }

    statusBadge.classList.add(
      "border-white/10",
      "bg-white/5",
      "text-white/70"
    );

    statusBadge.textContent = status;
  }

  async function loadOrder() {

    if (!orderId) return;

    const {
  data: { user }
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/auth/login";
  return;
}

const { data, error } = await supabase
  .from("orders")
  .select("*")
  .eq("id", orderId)
  .eq("advisor_id", user.id)
  .single();

    if (error || !data) {
      console.error(error);
      return;
    }

    // HEADER
    if (orderTitle) {
      orderTitle.textContent = `#${data.id}`;
    }

    if (orderDate) {
      orderDate.textContent =
        formatDate(data.created_at);
    }

    // CLIENT
    if (clientName) {
      clientName.textContent =
        data.client_name || "—";
    }

    if (businessName) {
      businessName.textContent =
        data.business_name || "—";
    }

    if (advisorName) {
      advisorName.textContent =
        data.advisor || "—";
    }

    // PAYMENT
    if (paymentType) {
      paymentType.textContent =
        paymentLabel(data.total);
    }

    if (orderTotal) {
      orderTotal.textContent =
        money(data.total);
    }

    if (orderBalance) {
      orderBalance.textContent =
        money(data.balance);
    }

    // ADDRESS
    if (addressLine) {
      addressLine.textContent =
        data.address_line || "—";
    }

    if (colony) {
      colony.textContent =
        data.colony || "—";
    }

    if (cityState) {
      cityState.textContent =
        `${data.city || ""}, ${data.state || ""}`;
    }

    // STATUS
    badge(data.status);

    // ITEMS
    if (itemsContainer) {

      const items = data.items || [];

      if (!items.length) {

        itemsContainer.innerHTML = `
          <div class="p-8 text-sm text-white/45">
            Sin productos
          </div>
        `;

      } else {

        itemsContainer.innerHTML = items.map((item: any) => {

          const total =
  Number(
    item.total
    || (
      Number(item.priceSalon || 0)
      * Number(item.qty || 0)
    )
  );

          return `
            <div class="flex items-center justify-between gap-5 p-7">

              <div>

                <p class="text-lg font-semibold">
                  ${item.name}
                </p>

                <p class="mt-2 text-sm text-white/45">
                  ${item.qty} × ${money(item.priceSalon || 0)}
                </p>

              </div>

              <div class="text-right">

                <p class="text-2xl font-semibold">
                  ${money(total)}
                </p>

              </div>

            </div>
          `;

        }).join("");

      }

    }

  }

  async function updateStatus(
    status: string,
    balance: number
  ) {

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        balance
      })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      return;
    }

    await loadOrder();

  }

  // PAID
  markPaidBtn?.addEventListener("click", async () => {

    const confirmed = confirm(
      "¿Marcar pedido como pagado?"
    );

    if (!confirmed) return;

    const btn =
  markPaidBtn as HTMLButtonElement;

btn.disabled = true;

    await updateStatus("paid", 0);

  });

  // CANCEL
  cancelBtn?.addEventListener("click", async () => {

    const confirmed = confirm(
      "¿Cancelar pedido?"
    );

    if (!confirmed) return;

    const btn =
  cancelBtn as HTMLButtonElement;

btn.disabled = true;

    const { data } = await supabase
      .from("orders")
      .select("total")
      .eq("id", orderId)
      .single();

    await updateStatus(
      "cancelled",
      Number(data?.total || 0)
    );

  });

  loadOrder();

});