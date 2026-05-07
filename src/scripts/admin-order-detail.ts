// src/scripts/admin-order-detail.ts

import { supabase } from "../lib/supabase";

declare global {

  interface Window {
    __ORDER_ID__: string;
  }

}

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const orderId =
      window.__ORDER_ID__;

    /* ========================================
       ELEMENTS
    ========================================= */

    const $ = (id: string) =>
      document.getElementById(id);

    const orderTitle =
      $("orderTitle");

    const orderDate =
      $("orderDate");

    const clientName =
      $("clientName");

    const businessName =
      $("businessName");

    const paymentType =
      $("paymentType");

    const paymentStatus =
      $("paymentStatus");

    const subtotal =
      $("subtotal");

    const amountPaid =
      $("amountPaid");

    const amountDue =
      $("amountDue");

    const orderTotal =
      $("orderTotal");

    const deliveryStatus =
      $("deliveryStatus");

    const addressLine =
      $("addressLine");

    const colony =
      $("colony");

    const cityState =
      $("cityState");

    const itemsContainer =
      $("itemsContainer");

    const itemsCount =
      $("itemsCount");

    const timelineContainer =
      $("timelineContainer");

    const paymentsContainer =
  $("paymentsContainer");

    const whatsappBtn =
      $("whatsappBtn") as HTMLAnchorElement | null;

    const adminNotes =
      $("adminNotes") as HTMLTextAreaElement | null;

    const saveNotes =
      $("saveNotes");

    const markPreparing =
      $("markPreparing");

    const markDelivered =
      $("markDelivered");

    const registerPayment =
      $("registerPayment");

    const cancelOrder =
      $("cancelOrder");

    /* ========================================
       HELPERS
    ========================================= */

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

    function formatDate(v: string) {

      return new Date(v)
        .toLocaleString(
          "es-MX",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    }

    function paymentTypeLabel(
      type: string,
      total: number
    ) {

      if (type === "cash") {
        return "Contado";
      }

      if (total >= 10000) {
        return "50% entrega + 50% a 30 días";
      }

      return "50% entrega + 50% a 15 días";

    }

    function paymentBadge(
      status = ""
    ) {

      const s =
        status.toLowerCase();

      if (s === "paid") {

        return `
<div class="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
  Pagado
</div>
`;

      }

      if (s === "partial") {

        return `
<div class="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
  Pago parcial
</div>
`;

      }

      return `
<div class="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
  Pendiente
</div>
`;

    }

function deliveryBadge(
  status = ""
) {

  const s =
    status.toLowerCase();

  if (
    s === "waiting_supplier"
  ) {

    return `
<div class="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
  Esperando proveedor
</div>
`;

  }

  if (
    s === "ordered_supplier"
  ) {

    return `
<div class="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
  Pedido realizado
</div>
`;

  }

  if (
    s === "in_transit"
  ) {

    return `
<div class="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
  En tránsito
</div>
`;

  }

  if (
    s === "ready_delivery"
  ) {

    return `
<div class="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
  Listo para entrega
</div>
`;

  }

  if (
    s === "delivered"
  ) {

    return `
<div class="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
  Entregado
</div>
`;

  }

  if (
    s === "cancelled"
  ) {

    return `
<div class="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
  Cancelado
</div>
`;

  }

  return `
<div class="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
  Registrado
</div>
`;

}
    /* ========================================
       LOAD ORDER
    ========================================= */

    async function loadOrder() {

      if (!orderId) return;

      const {
        data: { user }
      } =
        await supabase.auth.getUser();

      if (!user) {

        location.href =
          "/admin/login";

        return;

      }

      const {
        data,
        error
      } =
        await supabase
          .from("orders")
          .select(`
            *,

            order_items (
              *
            ),

            order_payments (
  *
),

            profiles:client_id (
              phone
            )
          `)
          .eq(
            "id",
            orderId
          )
          .single();

      if (
        error ||
        !data
      ) {

        console.error(error);

        return;

      }

      /* ========================================
         HEADER
      ========================================= */

      if (orderTitle) {
        orderTitle.textContent =
          `#${data.id}`;
      }

      if (orderDate) {
        orderDate.textContent =
          formatDate(
            data.created_at
          );
      }

      /* ========================================
         CLIENT
      ========================================= */

      if (clientName) {
        clientName.textContent =
          data.client_name || "—";
      }

      if (businessName) {
        businessName.textContent =
          data.business_name || "—";
      }

      /* ========================================
         WHATSAPP
      ========================================= */

      if (
        whatsappBtn &&
        data.profiles?.phone
      ) {

        const phone =
          String(
            data.profiles.phone
          ).replace(/\D/g, "");

        whatsappBtn.href =
          `https://wa.me/52${phone}`;

      }

      /* ========================================
         PAYMENT
      ========================================= */

      if (paymentType) {

        paymentType.textContent =
          paymentTypeLabel(
            data.payment_type,
            data.total
          );

      }

      if (paymentStatus) {

        paymentStatus.innerHTML =
          paymentBadge(
            data.payment_status
          );

      }

      if (subtotal) {
        subtotal.textContent =
          money(
            data.subtotal || 0
          );
      }

      if (amountPaid) {
        amountPaid.textContent =
          money(
            data.amount_paid || 0
          );
      }

      if (amountDue) {
        amountDue.textContent =
          money(
            data.amount_due || 0
          );
      }

      if (orderTotal) {
        orderTotal.textContent =
          money(
            data.total || 0
          );
      }

      if (deliveryStatus) {

        deliveryStatus.innerHTML =
          deliveryBadge(
            data.delivery_status
          );

      }

      /* ========================================
         ADDRESS
      ========================================= */

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

      /* ========================================
         NOTES
      ========================================= */

      if (adminNotes) {

        adminNotes.value =
          data.notes || "";

      }

      /* ========================================
         ITEMS
      ========================================= */

      const items =
        data.order_items || [];

      if (itemsCount) {

        itemsCount.textContent =
          `${items.length} items`;

      }

      if (itemsContainer) {

        if (!items.length) {

          itemsContainer.innerHTML = `
<div class="p-8 text-sm text-white/45">
  Sin productos
</div>
`;

        }

        else {

          itemsContainer.innerHTML =
            items.map(
              (item: any) => {

                return `
<div class="flex items-center justify-between gap-5 p-6">

  <div class="min-w-0 flex-1">

    <p class="truncate text-lg font-semibold">
      ${item.product_name}
    </p>

    <p class="mt-2 text-sm text-white/45">
      ${item.quantity} × ${money(item.unit_price)}
    </p>

  </div>

  <div class="text-right">

    <p class="text-2xl font-semibold">
      ${money(item.subtotal)}
    </p>

  </div>

</div>
`;

              }
            ).join("");

        }

      }

      /* ========================================
   PAYMENTS
======================================== */

const payments =
  data.order_payments || [];

if (paymentsContainer) {

  if (!payments.length) {

    paymentsContainer.innerHTML = `
<div class="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/45">
  No hay pagos registrados
</div>
`;

  }

  else {

    paymentsContainer.innerHTML =
      payments.map(
        (payment: any) => {

          return `

<div class="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">

  <div>

    <p class="text-lg font-semibold text-emerald-300">
      ${money(payment.amount)}
    </p>

    <p class="mt-2 text-xs text-white/40">
      ${formatDate(payment.created_at)}
    </p>

  </div>

  <div class="text-right">

    <p class="text-sm text-white/70">
      ${payment.payment_method || "Transferencia"}
    </p>

    ${
      payment.reference

      ? `
<p class="mt-1 text-xs text-white/35">
  Ref: ${payment.reference}
</p>
`

      : ""
    }

  </div>

</div>

`;

        }
      ).join("");

  }

}

      /* ========================================
         TIMELINE
      ========================================= */

      if (timelineContainer) {

        timelineContainer.innerHTML = `

<div class="flex gap-4">

  <div class="mt-1 h-3 w-3 rounded-full bg-white"></div>

  <div>

    <p class="text-sm font-medium">
      Pedido registrado
    </p>

    <p class="mt-1 text-xs text-white/40">
      ${formatDate(data.created_at)}
    </p>

  </div>

</div>

${
  data.delivery_status === "preparing"

  ? `
<div class="flex gap-4">

  <div class="mt-1 h-3 w-3 rounded-full bg-sky-400"></div>

  <div>

    <p class="text-sm font-medium">
      Pedido en preparación
    </p>

  </div>

</div>
`

  : ""
}

${
  data.delivery_status === "delivered"

  ? `
<div class="flex gap-4">

  <div class="mt-1 h-3 w-3 rounded-full bg-emerald-400"></div>

  <div>

    <p class="text-sm font-medium">
      Pedido entregado
    </p>

  </div>

</div>
`

  : ""
}

`;

      }

    }

    /* ========================================
       UPDATE DELIVERY
    ========================================= */

    async function updateDelivery(
      status: string
    ) {

      const {
        error
      } =
        await supabase
          .from("orders")
          .update({

            delivery_status:
              status

          })
          .eq(
            "id",
            orderId
          );

      if (error) {

        console.error(error);

        return;

      }

      await loadOrder();

    }

    /* ========================================
       SAVE NOTES
    ========================================= */

    saveNotes?.addEventListener(
      "click",
      async () => {

        if (!adminNotes)
          return;

        const {
          error
        } =
          await supabase
            .from("orders")
            .update({

              notes:
                adminNotes.value

            })
            .eq(
              "id",
              orderId
            );

        if (error) {

          console.error(error);

          return;

        }

      }
    );

    /* ========================================
       EVENTS
    ========================================= */

    markPreparing?.addEventListener(
      "click",
      async () => {

        await updateDelivery(
  "ordered_supplier"
);

      }
    );

    markDelivered?.addEventListener(
      "click",
      async () => {

        await updateDelivery(
          "delivered"
        );

      }
    );

    cancelOrder?.addEventListener(
      "click",
      async () => {

        const confirmed =
          confirm(
            "¿Cancelar pedido?"
          );

        if (!confirmed)
          return;

        await updateDelivery(
          "cancelled"
        );

      }
    );

    /* ========================================
   PAYMENT MODAL
======================================== */

const paymentModal =
  $("paymentModal");

const paymentOverlay =
  $("paymentOverlay");

const closePaymentModal =
  $("closePaymentModal");

const cancelPaymentBtn =
  $("cancelPaymentBtn");

const submitPaymentBtn =
  $("submitPaymentBtn");

const paymentAmount =
  $("paymentAmount") as HTMLInputElement | null;

const paymentMethod =
  $("paymentMethod") as HTMLSelectElement | null;

const paymentReference =
  $("paymentReference") as HTMLInputElement | null;

const paymentNotes =
  $("paymentNotes") as HTMLTextAreaElement | null;

function openPaymentModal() {

  paymentModal?.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";

}

function closePayment() {

  paymentModal?.classList.add(
    "hidden"
  );

  document.body.style.overflow =
    "";

}

registerPayment?.addEventListener(
  "click",
  openPaymentModal
);

closePaymentModal?.addEventListener(
  "click",
  closePayment
);

cancelPaymentBtn?.addEventListener(
  "click",
  closePayment
);

paymentOverlay?.addEventListener(
  "click",
  closePayment
);

/* ========================================
   SUBMIT PAYMENT
======================================== */

submitPaymentBtn?.addEventListener(
  "click",
  async () => {

    const parsed =
      Number(
        paymentAmount?.value || 0
      );

    if (
      isNaN(parsed) ||
      parsed <= 0
    ) {

      alert(
        "Monto inválido"
      );

      return;

    }

    /* =========================
       CURRENT ORDER
    ========================= */

    const {
      data: currentOrder,
      error: orderError
    } =
      await supabase
        .from("orders")
        .select(`
          id,
          total,
          amount_paid,
          amount_due
        `)
        .eq(
          "id",
          orderId
        )
        .single();

    if (
      orderError ||
      !currentOrder
    ) {

      console.error(
        orderError
      );

      return;

    }

    /* =========================
       AUTH
    ========================= */

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    if (!user) return;

    /* =========================
       INSERT PAYMENT
    ========================= */

    const {
      error: paymentError
    } =
      await supabase
        .from("order_payments")
        .insert({

          order_id:
            orderId,

          amount:
            parsed,

          payment_method:
            paymentMethod?.value || "transfer",

          reference:
            paymentReference?.value || null,

          notes:
            paymentNotes?.value || null,

          created_by:
            user.id

        });

    if (paymentError) {

      console.error(
        paymentError
      );

      return;

    }

    /* =========================
       RECALCULATE
    ========================= */

    const newPaid =
      Number(
        currentOrder.amount_paid || 0
      ) + parsed;

    const newDue =
      Math.max(
        Number(
          currentOrder.total || 0
        ) - newPaid,
        0
      );

    let paymentStatus =
      "partial";

    if (newDue <= 0) {

      paymentStatus =
        "paid";

    }

    /* =========================
       UPDATE ORDER
    ========================= */

    const {
      error: updateError
    } =
      await supabase
        .from("orders")
        .update({

          amount_paid:
            newPaid,

          amount_due:
            newDue,

          payment_status:
            paymentStatus

        })
        .eq(
          "id",
          orderId
        );

    if (updateError) {

      console.error(
        updateError
      );

      return;

    }

    /* =========================
       RESET
    ========================= */

    if (paymentAmount) {
      paymentAmount.value = "";
    }

    if (paymentReference) {
      paymentReference.value = "";
    }

    if (paymentNotes) {
      paymentNotes.value = "";
    }

    closePayment();

    await loadOrder();

  }
);

    /* ========================================
       INIT
    ========================================= */

    loadOrder();

  }
);