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

  const registerPayment =
        $("registerPayment");

      const registerPaymentCard =
  $("registerPaymentCard");

        const statusButtons =
    Array.from(
      document.querySelectorAll(
        ".status-btn"
      )
    ) as HTMLButtonElement[];

    const statusModal =
  $("statusModal");

const statusOverlay =
  $("statusOverlay");

const cancelStatusBtn =
  $("cancelStatusBtn");

const confirmStatusBtn =
  $("confirmStatusBtn");

const statusModalTitle =
  $("statusModalTitle");

  const mobileStatusTrigger =
  $("mobileStatusTrigger");

const mobileStatusDropdown =
  $("mobileStatusDropdown");

const mobileStatusArrow =
  $("mobileStatusArrow");

const mobileStatusLabel =
  $("mobileStatusLabel");

const mobileStatusDot =
  $("mobileStatusDot");

let pendingStatus = "";

const STATUS_LABELS: Record<string, string> = {

  waiting_supplier:
    "Esperando proveedor",

  ordered_supplier:
    "Pedido realizado",

  ready_delivery:
    "Listo para entrega",

  on_route:
    "En ruta",

  delivered:
    "Entregado"

};

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

      function paymentMethodLabel(
  method = ""
) {

  const m =
    method.toLowerCase();

  if (m === "cash") {
    return "Efectivo";
  }

  if (m === "card") {
    return "Tarjeta";
  }

  return "Transferencia";

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

    if (s === "waiting_supplier") {

      return `
  <div class="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
    Esperando proveedor
  </div>
  `;

    }

    if (s === "ordered_supplier") {

      return `
  <div class="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
    Pedido realizado
  </div>
  `;

    }

    if (s === "ready_delivery") {

      return `
  <div class="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
    Pedido listo
  </div>
  `;

    }

    if (s === "on_route") {

      return `
  <div class="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
    En ruta
  </div>
  `;

    }

    if (s === "delivered") {

      return `
  <div class="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
    Entregado
  </div>
  `;

    }

    if (s === "cancelled") {

      return `
  <div class="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
    Cancelado
  </div>
  `;

    }

    return `
  <div class="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
    Registrado
  </div>
  `;

  }

function updateMobileStatus(
  status = ""
) {

  if (!mobileStatusLabel) return;
  if (!mobileStatusDot) return;

  const map: Record<
    string,
    {
      label: string;
      color: string;
    }
  > = {

    waiting_supplier: {
      label:
        "Esperando proveedor",
      color:
        "bg-yellow-400"
    },

    ordered_supplier: {
      label:
        "Pedido realizado",
      color:
        "bg-sky-400"
    },

    ready_delivery: {
      label:
        "Pedido listo",
      color:
        "bg-cyan-400"
    },

    on_route: {
      label:
        "En ruta",
      color:
        "bg-orange-400"
    },

    delivered: {
      label:
        "Entregado",
      color:
        "bg-emerald-400"
    },

    cancelled: {
      label:
        "Cancelado",
      color:
        "bg-red-400"
    }

  };

  const current =
    map[status] ||
    map.waiting_supplier;

  mobileStatusLabel.textContent =
    current.label;

  mobileStatusDot.className =
    `h-3 w-3 rounded-full ${current.color}`;

}

function openStatusModal(
  status: string
) {

  pendingStatus = status;

  if (statusModalTitle) {

    statusModalTitle.textContent =
      `¿Cambiar estado a "${
        STATUS_LABELS[status]
      }"?`;

  }

  statusModal?.classList.remove(
    "hidden"
  );

}

function closeStatusModal() {

  statusModal?.classList.add(
    "hidden"
  );

  pendingStatus = "";

}

function showToast(
  message: string,
  type:
    | "success"
    | "error"
    | "info" = "info"
) {

  const existing =
    document.getElementById(
      "global-toast"
    );

  if (existing) {
    existing.remove();
  }

  const colors = {

    success:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",

    error:
      "border-red-500/20 bg-red-500/10 text-red-200",

    info:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-100"

  };

  const toast =
    document.createElement("div");

  toast.id =
    "global-toast";

  toast.className = `
fixed left-1/2 top-6 z-[999999]

flex items-center gap-3

rounded-2xl border

px-5 py-4

backdrop-blur-2xl

shadow-[0_10px_40px_rgba(0,0,0,0.45)]

transition-all duration-300

pointer-events-none

${colors[type]}
`;

  toast.style.opacity = "0";

  toast.style.transform =
    "translateX(-50%) translateY(-12px) scale(.96)";

  toast.innerHTML = `
<span class="text-sm font-medium whitespace-nowrap">
  ${message}
</span>
`;

  document.body.appendChild(
    toast
  );

  requestAnimationFrame(() => {

    toast.style.opacity = "1";

    toast.style.transform =
      "translateX(-50%) translateY(0) scale(1)";

  });

  setTimeout(() => {

    toast.style.opacity = "0";

    toast.style.transform =
      "translateX(-50%) translateY(-12px) scale(.96)";

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 2600);

}

function timelineDot(
  type = ""
) {

  if (type === "payment") {
    return "bg-emerald-400";
  }

  if (type === "delivery") {
    return "bg-cyan-400";
  }

  return "bg-white";
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

        if (paymentAmount) {

  paymentAmount.placeholder =
    money(
      data.amount_due || 0
    );

  paymentAmount.max =
    String(
      Number(data.amount_due || 0)
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
            updateButtons(
    data.delivery_status
  );

  updateMobileStatus(
  data.delivery_status
);

        }

        /* ========================================
    DYNAMIC BUTTON LABELS
  ======================================== */

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
  (data.order_payments || [])
    .sort(
      (
        a: any,
        b: any
      ) =>
        new Date(
          b.created_at
        ).getTime() -
        new Date(
          a.created_at
        ).getTime()
    );

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

 <div class="
  rounded-2xl

  border border-white/10

  bg-black/30

  p-5

  transition

  hover:border-white/15
  hover:bg-white/[0.03]
">

<div class="flex items-start justify-between gap-5">

  <div class="min-w-0">

    <p class="text-2xl font-semibold text-emerald-300">
      ${money(payment.amount)}
    </p>

    <div class="mt-3 flex flex-wrap items-center gap-2">

      <div class="
        rounded-full

        border border-white/10

        bg-white/[0.04]

        px-3 py-1

        text-xs text-white/60
      ">
        ${paymentMethodLabel(payment.payment_method)}
      </div>

      ${
        payment.reference

        ? `
<div class="
  rounded-full

  border border-white/10

  bg-white/[0.04]

  px-3 py-1

  text-xs text-white/40
">
  ${payment.reference}
</div>
`

        : ""
      }

    </div>

  </div>

  <p class="shrink-0 text-xs text-white/35">
    ${formatDate(payment.created_at)}
  </p>

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

  const timelineEvents: any[] = [];

  /* =========================
    CURRENT DELIVERY STATUS
  ========================= */

  if (
    data.delivery_status
  ) {

    timelineEvents.push({

      type: "delivery",

      label:
        STATUS_LABELS[
          data.delivery_status
        ] || "Estado actualizado",

      date:
        data.updated_at ||
        data.created_at

    });

  }

  /* =========================
    PAYMENTS
  ========================= */

  payments.forEach(
    (payment: any) => {

      timelineEvents.push({

        type: "payment",

        label:
          `Pago registrado • ${money(payment.amount)}`,

        date:
          payment.created_at

      });

    }
  );

  /* =========================
    ORDER CREATED
  ========================= */

  timelineEvents.push({

    type: "created",

    label:
      "Pedido registrado",

    date:
      data.created_at

  });

  /* =========================
    SORT DESC
  ========================= */

  timelineEvents.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  /* =========================
    RENDER
  ========================= */

  timelineContainer.innerHTML =
    timelineEvents.map(
      (event) => {

        return `

<div class="flex gap-4">

  <div class="
    mt-1 h-3 w-3 rounded-full

    ${timelineDot(event.type)}
  "></div>

  <div>

    <p class="text-sm font-medium">
      ${event.label}
    </p>

    <p class="mt-1 text-xs text-white/40">
      ${formatDate(event.date)}
    </p>

  </div>

</div>

`;

      }
    ).join("");

}

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
  ======================================== */

  /* ========================================
    STATUS FLOW
  ======================================== */

  const statusFlow = [
    "waiting_supplier",
    "ordered_supplier",
    "ready_delivery",
    "on_route",
    "delivered"
  ];

  /* ========================================
    BUTTON STATES
  ======================================== */

function updateButtons(
  current = ""
) {

  statusButtons.forEach(
    (btn) => {

      const status =
        btn.dataset.status || "";

      btn.disabled = false;

      btn.classList.remove(
        "active",
        "completed",
        "cancelled"
      );

      btn.style.opacity = "1";

      /* ===============================
         CURRENT ACTIVE
      =============================== */

      if (
        status === current
      ) {

        btn.classList.add(
          "active"
        );

      }

      /* ===============================
         DELIVERED
      =============================== */

      if (
        current === "delivered"
      ) {

        if (
          status === "delivered"
        ) {

          btn.classList.remove(
            "active"
          );

          btn.classList.add(
            "completed"
          );

          btn.disabled = true;

        }

        else {

          btn.disabled = true;

        }

      }

      /* ===============================
         CANCELLED
      =============================== */

      if (
        current === "cancelled"
      ) {

        if (
          status === "cancelled"
        ) {

          btn.classList.remove(
            "active"
          );

          btn.classList.add(
            "cancelled"
          );

        }

        else {

          btn.disabled = true;

        }

      }

    }
  );

}

  /* ========================================
    UPDATE DELIVERY
  ======================================== */

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
    EVENTS
  ======================================== */

statusButtons.forEach(
  (btn) => {

    btn.addEventListener(
      "click",
      async () => {

        if (
          btn.disabled
        ) {
          return;
        }

        const status =
          btn.dataset.status;

        if (!status)
          return;

        openStatusModal(
          status
        );

      }
    );

  }
);

confirmStatusBtn?.addEventListener(
  "click",
  async () => {

    if (!pendingStatus)
      return;

    await updateDelivery(
      pendingStatus
    );

    mobileStatusDropdown?.classList.add(
  "hidden"
);

mobileStatusArrow?.classList.remove(
  "rotate-180"
);

    closeStatusModal();

  }
);

cancelStatusBtn?.addEventListener(
  "click",
  closeStatusModal
);

statusOverlay?.addEventListener(
  "click",
  closeStatusModal
);

mobileStatusTrigger?.addEventListener(
  "click",
  () => {

    mobileStatusDropdown?.classList.toggle(
      "hidden"
    );

    mobileStatusArrow?.classList.toggle(
      "rotate-180"
    );

  }
);

document.addEventListener(
  "click",
  (e) => {

    const target =
      e.target as HTMLElement;

    if (
      !target.closest(
        "#mobileStatusTrigger"
      ) &&
      !target.closest(
        "#mobileStatusDropdown"
      )
    ) {

      mobileStatusDropdown?.classList.add(
        "hidden"
      );

      mobileStatusArrow?.classList.remove(
        "rotate-180"
      );

    }

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

paymentModal?.classList.remove(
  "pointer-events-none"
);

    document.body.style.overflow =
      "hidden";

  }

  function closePayment() {

    paymentModal?.classList.add(
  "hidden"
);

paymentModal?.classList.add(
  "pointer-events-none"
);

    document.body.style.overflow =
      "";

  }

registerPayment?.addEventListener(
  "click",
  openPaymentModal
);

registerPaymentCard?.addEventListener(
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

    /* =========================
      VALIDATION
    ========================= */

    if (
      isNaN(parsed) ||
      parsed <= 0
    ) {

     showToast(
  "Monto inválido",
  "error"
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

    const currentDue =
      Number(
        currentOrder.amount_due || 0
      );

    /* =========================
      OVERPAY PROTECTION
    ========================= */

    if (
      parsed > currentDue
    ) {

      showToast(
  `Máximo permitido: ${money(currentDue)}`,
  "error"
);

      if (paymentAmount) {

        paymentAmount.value =
          String(currentDue);

        paymentAmount.focus();

      }

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

    showToast(
  "Pago registrado correctamente",
  "success"
);

  }
);

      /* ========================================
        INIT
      ========================================= */

      loadOrder();

    }
  );