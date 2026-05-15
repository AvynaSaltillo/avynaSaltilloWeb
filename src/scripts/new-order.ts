// src/scripts/new-order.ts
// ARCHIVO COMPLETO CORREGIDO

import { supabase } from "../lib/supabase";

import { createOrder } from "../services/orders.service";

import {
  createActivityLog
} from "../services/activity.service";

type Product = {
  id: string | number;

  name: string;

  family?: string;

  priceSalon?: number;

  pricePublic?: number;

  tag?: string;
};

type CartItem = {
  id: string | number;

  name: string;

  family?: string;

  priceSalon: number;

  pricePublic: number;

  tag?: string;

  qty: number;
};

type ProfileRole =
  | "super_admin"
  | "admin"
  | "client";

type ProfileStatus =
  | "active"
  | "pending"
  | "blocked";

declare global {
  interface Window {
    __PRODUCTS__: Product[];
  }
}

import {
  getCurrentWeekKey
} from "./helpers";


document.addEventListener(
  "DOMContentLoaded",
  async () => {

let products: Product[] = [];

/* ========================================
   WAIT PRODUCTS
======================================== */

async function waitProducts() {

  return new Promise<Product[]>(
    (resolve) => {

      const check = () => {

        if (
          window.__PRODUCTS__ &&
          window.__PRODUCTS__.length
        ) {

          resolve(
            window.__PRODUCTS__
          );

          return;

        }

        setTimeout(
          check,
          100
        );

      };

      check();

    }
  );

}

products =
  await waitProducts();

/* ========================================
   LOAD ORDER
======================================== */

  const $ = (id: string) =>
  document.getElementById(id);

  const grid = $("productsGrid");
  const cartBox = $("cartItems");

  const search = $("searchInput") as HTMLInputElement | null;
  const family = $("familyFilter") as HTMLSelectElement | null;

  const limitSelect = $("limitSelect") as HTMLSelectElement | null;
  const pageInfo = $("pageInfo");
  const prevBtn = $("prevPage");
  const nextBtn = $("nextPage");

  const cartCount = $("cartCount");
  const publicTotal = $("publicTotal");
  const savingTotal = $("savingTotal");
  const finalTotal = $("finalTotal");

  const clearBtn = $("clearBtn");
  const sendBtn = $("sendBtn") as HTMLButtonElement | null;

  const creditTitle = $("creditTitle");
  const creditText = $("creditText");

  const creditGiftIcon = $("creditGiftIcon");
const creditTitleText = $("creditTitleText");



  // MOBILE
const mobileItems = $("mobileItems");
const mobileTotal = $("mobileTotal");
const mobileOpenModal = $("mobileOpenModal");
const mobileClearBtn = $("mobileClearBtn");

// MODAL
const modalPanel = $("modalPanel");
const modal = $("cartModal");
const modalBackdrop = $("modalBackdrop");
const closeModal = $("closeModal");

const modalContent = $("modalCartContent");
const modalPublic = $("modalPublic");
const modalSaving = $("modalSaving");
const modalTotal = $("modalTotal");

const modalProgress = $("modalProgress");
const modalMinText = $("modalMinText");

const desktopProgress = $("desktopProgress");
const desktopMinText = $("desktopMinText");

const modalCreditTitle = $("modalCreditTitle");
const modalCreditText = $("modalCreditText");

const modalCreditTitleText = $("modalCreditTitleText");
const modalCreditGiftIcon = $("modalCreditGiftIcon");

const modalClearBtn = $("modalClearBtn");
const modalSendBtn = $("modalSendBtn");

const modalItems = $("modalItems");

let creditProfile =
  "cash_only";


let profileData: any = null;
  
let lastLevel = 0; // 0 = base, 1 = mínimo, 2 = pro

let plusActivated =
  false;

  let filtered = [...products];

let cart: CartItem[] = [];

let existingWeeklyOrder: any = null;

let orderLocked = false;

let page = 1;

let limit = 10;

/* ========================================
   LOAD PROFILE
======================================== */

async function loadProfile() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const {
    data: profile
  } = await supabase
    .from("profiles")
    .select(`
      id,
      role,
      status,
      credit_profile,
      advisor_id,
      name,
      first_name,
      last_name,
      business_name,
      address_line,
      colony,
      postal_code,
      city,
      state
    `)
    .eq("id", user.id)
    .single();

  if (!profile) return;

  profileData =
    profile;

  creditProfile =
    profile.credit_profile ||
    "cash_only";

  console.log(
    "CREDIT PROFILE:",
    creditProfile
  );

}

  const isMobile = () => window.innerWidth < 1024;

  function isModalOpen() {
  return modal && !modal.classList.contains("hidden");
}

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

  function qtyOf(id: number | string) {
    return cart.find((x) => String(x.id) === String(id))?.qty || 0;
  }



function removeItem(
  id: string | number
) {

  if (orderLocked) return;

  cart = cart.filter(
    (x) => String(x.id) !== id
  );

  renderAll();

}

function updateQty(
  id: string,
  step: number
) {

  if (orderLocked) return;
    const found = cart.find((x) => String(x.id) === id);

    if (!found && step > 0) {
      const item = products.find((x) => String(x.id) === id);
      if (!item) return;

      cart.push({
  id: item.id,

  name: item.name,

  family: item.family || "",

  tag:
    item.tag || "",

  priceSalon:
    Number(item.priceSalon || 0),

  pricePublic:
    Number(item.pricePublic || 0),

  qty: 1
});

      renderAll();
      return;
    }

    if (!found) return;

    found.qty += step;

    if (found.qty <= 0) {
      removeItem(id);
      return;
    }
    animateItem(id);


    renderAll();
  }
  

function updateQtyDirect(
  id: string,
  qty: number
) {

  if (orderLocked) return;
    
    qty = Math.max(0, Math.floor(qty || 0));

    const found = cart.find((x) => String(x.id) === id);

    if (qty === 0) {
      removeItem(id);
      return;
    }

    if (!found) {
      const item = products.find((x) => String(x.id) === id);
      if (!item) return;

      cart.push({
  id: item.id,

  name: item.name,

  family: item.family || "",

  tag:
    item.tag || "",

  priceSalon:
    Number(item.priceSalon || 0),

  pricePublic:
    Number(item.pricePublic || 0),

  qty: 1
});

      animateItem(id);
      renderAll();
      return;
    }

    found.qty = qty;
    renderAll();
  }

  

  async function loadExistingWeeklyOrder() {

    
  const {
    data: userData
  } = await supabase.auth.getUser();

  const user =
    userData?.user;

  if (!user?.id) return;

/* ========================================
   CICLO ACTUAL REAL
======================================== */

const now =
  new Date();
  /* ========================================
     BUSCAR PEDIDO ACTIVO
  ======================================== */

const {
  data: order
} = await supabase
  .from("orders")
  .select(`
    *,
    order_items (*)
  `)
  .eq(
    "client_id",
    user.id
  )
  .eq(
    "week_key",
    getCurrentWeekKey()
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
  )
  
  .limit(1)
  .maybeSingle();

if (!order) return;

/* ========================================
   IGNORAR CANCELADOS
======================================== */

if (
  order.delivery_status ===
  "cancelled"
) {

  existingWeeklyOrder =
    null;

  orderLocked = false;

  cart = [];

  renderAll();

  return;

}

existingWeeklyOrder =
  order;

  /* ========================================
     🔒 SI YA ESTÁ BLOQUEADO
  ======================================== */

  const lockedStatuses = [
    "ordered_supplier",
    "ready_delivery",
    "on_route",
    "delivered"
  ];

  const locked =
    lockedStatuses.includes(
      order.delivery_status
    );

    orderLocked = locked;

    clearBtn?.classList.toggle(
  "pointer-events-none",
  locked
);

clearBtn?.classList.toggle(
  "opacity-40",
  locked
);

mobileClearBtn?.classList.toggle(
  "pointer-events-none",
  locked
);

mobileClearBtn?.classList.toggle(
  "opacity-40",
  locked
);

modalClearBtn?.classList.toggle(
  "pointer-events-none",
  locked
);

modalClearBtn?.classList.toggle(
  "opacity-40",
  locked
);

  /* ========================================
     CARGAR ITEMS
  ======================================== */

cart =
  (order.order_items || [])
    .map((item: any) => {

      const original =
        products.find(
          (p) =>
            String(p.id) ===
            String(item.product_id)
        );

      return {

        id:
          item.product_id,

        name:
          item.product_name,

        family:
          original?.family || "",

        tag:
          original?.tag || "",

        priceSalon:
          Number(
            item.unit_price || 0
          ),

        pricePublic:
          Number(
            original?.pricePublic || 0
          ),

        qty:
          Number(
            item.quantity || 0
          )

      };

    });

  renderAll();

/* ========================================
   BANNER
======================================== */

const banner =
  document.getElementById(
    "weeklyOrderBanner"
  );

if (banner) {

  banner.classList.remove(
    "hidden"
  );

  banner.className = `
    mt-5
    rounded-[2rem]
    border
    px-5
    py-4
    text-sm
    ${
      locked
        ? "border-red-500/20 bg-red-500/10 text-red-200"
        : "border-cyan-500/20 bg-cyan-500/10 text-cyan-100"
    }
  `;

  banner.innerHTML =
    locked

      ? `
<div class="flex flex-col gap-1">

  <p class="font-semibold">
    Pedido semanal bloqueado
  </p>

  <p class="text-sm text-red-200/70">
    Tu pedido ya fue enviado al proveedor y no puede editarse.
  </p>

</div>
`

      : `
<div class="flex flex-col gap-1">

  <p class="font-semibold">
    Continuando pedido semanal
  </p>

  <p class="text-sm text-cyan-100/70">
    Puedes seguir editando tu pedido hasta que sea enviado al proveedor.
  </p>

</div>
`;

}

  /* ========================================
     BLOQUEAR BOTÓN
  ======================================== */

  if (
    locked &&
    sendBtn
  ) {

    sendBtn.disabled = true;

    sendBtn.textContent =
      "Pedido enviado";

    sendBtn.classList.add(
      "opacity-50",
      "cursor-not-allowed"
    );

  }

}

  function loadFamilies() {
    if (!family) return;

    const rows = [...new Set(products.map((x) => x.family).filter(Boolean))];

    family.innerHTML =
      `<option value="">Todas las líneas</option>` +
      rows.map((x) => `<option value="${x}">${x}</option>`).join("");
  }

  function applyFilters() {
    const text = search?.value.trim().toLowerCase() || "";
    const fam = family?.value || "";

    filtered = products.filter((item) => {
      const byText = item.name.toLowerCase().includes(text);
      const byFam = !fam || item.family === fam;
      return byText && byFam;
    });

    page = 1;
    renderProducts();
  }

  function currentRows() {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / limit));
  }

  function updatePager() {
    if (pageInfo) pageInfo.textContent = `${page} / ${totalPages()}`;
  }

  /* ======================
     PRODUCTS
  ====================== */
  function renderProducts() {
    if (!grid) return;

    const rows = currentRows();

    if (!rows.length) {
      grid.innerHTML = `<div class="p-4 text-sm text-white/45">Sin resultados.</div>`;
      updatePager();
      return;
    }

   if (isMobile()) {
  grid.innerHTML = rows.map((item) => `
<div class="p-2.5">
  <div class="rounded-3xl border border-white/10 bg-white/3 p-3">

    <div class="flex items-end justify-between gap-3">

      <!-- LEFT -->
      <div class="min-w-0 flex-1">

       <p class="text-[13px] font-medium leading-5 pr-2 flex items-center gap-2">

  ${item.name}

  ${
    item.tag === "Pro"
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full border border-sky-600 text-sky-600">
          PRO
        </span>`
      : ""
  }

</p>

        <p class="mt-1 text-[12px] text-white/45">
          ${item.family || "-"}
        </p>

        <!-- 🔥 PRECIO (YA ABAJO) -->
        <p class="mt-2 text-[15px] font-semibold text-white">
          ${money(item.priceSalon || 0)}
        </p>

      </div>

      <!-- RIGHT (ALINEADO CON PRECIO) -->
      <div class="flex items-center gap-2 self-end">

        <button
          class="remove-btn h-9 w-9 rounded-xl border border-red-400/20 text-red-300 ${orderLocked ? "disabled" : ""}"
          data-id="${item.id}">
          ✕
        </button>

        <button
          class="qty-btn h-9 w-9 rounded-xl border border-white/10    ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
          data-id="${item.id}"
          data-step="-1">

          -
        </button>

        <input
          type="number"
          min="0"
          value="${qtyOf(item.id)}"
          data-id="${item.id}"
          class="qty-input h-9 w-10 rounded-xl border border-white/10 bg-transparent text-center text-[12px] outline-none"
          ${orderLocked ? "disabled" : ""}
        />

        <button
          class="qty-btn h-9 w-9 rounded-xl border border-white/10  ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
          data-id="${item.id}"
          data-step="1">

          +
        </button>

      </div>

    </div>

  </div>
</div>
`).join("");
} else {
      /* HEADER Y ROW USAN MISMAS COLUMNAS */
      grid.innerHTML = rows.map((item) => `
<div class="grid grid-cols-[minmax(0,1fr)_110px_130px_210px] gap-3 px-6 py-4 items-center">

<div class="min-w-0">
<p class="truncate text-[14px] font-medium pr-3">
${item.name}
</p>
</div>

<div class="text-[13px] text-white/55 truncate">
${item.family || "-"}
</div>

<div class="text-[14px] font-semibold">
${money(item.priceSalon || 0)}
</div>

<div class="flex items-center justify-end gap-2">

<button
class="qty-btn h-9 w-9 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
data-id="${item.id}"
data-step="-1">

-
</button>

<input
type="number"
min="0"
value="${qtyOf(item.id)}"
data-id="${item.id}"
class="qty-input h-9 w-12 rounded-xl border border-white/10 bg-transparent text-center text-[12px] outline-none"
${orderLocked ? "disabled" : ""}
/>

<button
class="qty-btn h-9 w-9 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
data-id="${item.id}"
data-step="1">

+
</button>

<button
class="remove-btn h-9 w-9 rounded-xl border border-red-400/20 text-red-300 ${orderLocked ? "disabled" : ""}"
data-id="${item.id}">
✕
</button>

</div>
</div>
`).join("");
    }

    bindActions();
    updatePager();
  }

  /* ======================
     CART
  ====================== */
  function renderCart() {
    if (!cartBox) return;

    if (!cart.length) {
      cartBox.innerHTML = `
<div class="py-10 flex flex-col items-center text-center gap-3 text-white/40">

  <div class="text-3xl opacity-40">🛒</div>

  <p class="text-sm">Tu carrito está vacío</p>

  <p class="text-xs text-white/25">
    Agrega productos para comenzar tu pedido
  </p>

</div>
    `;
      totals();
      return;
    }

    cartBox.innerHTML = cart.map((item) => `
<div class="rounded-2xl border border-white/10 bg-white/3 px-3 py-3">

<div class="flex items-start justify-between gap-2">

<p class="text-[13px] font-medium leading-5 pr-2 flex items-center gap-2">

  ${item.name}

  ${
    item.tag === "Pro"
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/30 text-sky-400">
          PRO
        </span>`
      : ""
  }

</p>

<button
class="remove-btn h-8 w-8 rounded-xl border border-red-400/20 text-red-300 shrink-0 ${orderLocked ? "disabled" : ""}"
data-id="${item.id}">
✕
</button>

</div>

<div class="mt-3 flex items-center justify-between gap-2">

<div class="flex items-center gap-1">

<button
class="qty-btn h-8 w-8 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
data-id="${item.id}"
data-step="-1">

-
</button>

<input
type="number"
min="0"
value="${item.qty}"
data-id="${item.id}"
class="qty-input h-8 w-12 rounded-xl border border-white/10 bg-transparent text-center text-[12px] outline-none"
 ${orderLocked ? "disabled" : ""}
/>

<button
class="qty-btn h-8 w-8 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
data-id="${item.id}"
data-step="1">

+
</button>

</div>

<p class="text-[13px] font-semibold whitespace-nowrap">
${money(Number(item.priceSalon || 0) * item.qty)}
</p>

</div>

</div>
`).join("");

    bindActions();
    totals();
  }

function renderModal() {
  if (!modalContent) return;

  if (!cart.length) {
    modalContent.innerHTML = `
      <div class="py-10 flex flex-col items-center text-center gap-3 text-white/40">

  <div class="text-3xl opacity-40">🛒</div>

  <p class="text-sm">Tu carrito está vacío</p>

  <p class="text-xs text-white/25">
    Agrega productos para comenzar tu pedido
  </p>

</div>
    `;
    return;
  }

  modalContent.innerHTML = cart.map((item) => `
<div class="rounded-2xl border border-white/10 bg-white/3 px-3 py-3">

<div class="flex items-start justify-between gap-2">

<p class="text-[13px] font-medium leading-5 pr-2">
${item.name}
</p>

<button
class="remove-btn h-8 w-8 rounded-xl border border-red-400/20 text-red-300 shrink-0 flex items-center justify-center ${orderLocked ? "disabled" : ""}"
data-id="${item.id}">
<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
</svg>
</button>

</div>

<div class="mt-3 flex items-center justify-between gap-2">

<div class="flex items-center gap-1">

  <button
    class="qty-btn h-8 w-8 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
    data-id="${item.id}"
    data-step="-1">

    -
  </button>

  <input
    type="number"
    min="0"
    value="${item.qty}"
    data-id="${item.id}"
    class="qty-input h-8 w-12 rounded-xl border border-white/10 bg-transparent text-center text-[12px] outline-none"
    ${orderLocked ? "disabled" : ""}
  />

  <button
    class="qty-btn h-8 w-8 rounded-xl border border-white/10 ${orderLocked ? "opacity-40 pointer-events-none" : ""}"
    data-id="${item.id}"
    data-step="1">
    
    +
  </button>

</div>

<p class="text-[13px] font-semibold whitespace-nowrap text-right leading-tight">
  ${money(item.priceSalon || 0)} x ${item.qty}
  <br/>
  <span class="text-white">
    ${money(Number(item.priceSalon || 0) * item.qty)}
  </span>
</p>

</div>

</div>
`).join("");

  bindActions();
}

function openModal() {
  modal?.classList.remove("hidden");

  // 👇 esconder sticky
  const bar = document.getElementById("mobileCartBar");
  bar?.classList.add("opacity-0", "pointer-events-none");

  document.body.classList.add("overflow-hidden");

  requestAnimationFrame(() => {
    modalBackdrop?.classList.remove("bg-black/0");
    modalBackdrop?.classList.add("bg-black/70");

   modalPanel?.classList.remove("translate-y-full");
modalPanel?.classList.add("translate-y-0");
  });

  renderModal();
  totals();
}

function closeModalFn() {
  modalBackdrop?.classList.remove("bg-black/70");
  modalBackdrop?.classList.add("bg-black/0");

  modalPanel?.classList.remove("translate-y-0");
modalPanel?.classList.add("translate-y-full");

  // 👇 mostrar sticky otra vez
  const bar = document.getElementById("mobileCartBar");
  bar?.classList.remove("opacity-0", "pointer-events-none");

  document.body.classList.remove("overflow-hidden");

  setTimeout(() => {
    modal?.classList.add("hidden");
  }, 250);
}

function totals() {
  let pub = 0;
  let salon = 0;
  let currentLevel = 0;

  
let hasPublic = false;
let hasNoPublic = false;
let save = 0;

cart.forEach((item) => {
  const salonPrice = Number(item.priceSalon ?? 0);
  const publicPrice = Number(item.pricePublic);

  // total salón (todo)
  salon += salonPrice * item.qty;

  // 👇 SOLO si es válido
  if (!isNaN(publicPrice) && publicPrice > 0) {
    pub += publicPrice * item.qty;

    save += (publicPrice - salonPrice) * item.qty;

    hasPublic = true;
  } else {
    hasNoPublic = true;
  }
});

// seguridad
save = Math.max(save, 0);

  // ======================
// 🧠 CONTROL UX PRECIOS PUBLICOS
// ======================
const hasMixed =
  cart.some(p => p.pricePublic == null) && hasPublic;


  // 👇 TOTAL DE UNIDADES
  const units = cart.reduce((a, b) => a + b.qty, 0);
  const MIN = 1500;
  const PLUS = 10000;

  let percent = 0;
const salonRounded = Number(salon.toFixed(2));

if (salonRounded >= 10000) {
  currentLevel = 2;
} else if (salonRounded >= 1500) {
  currentLevel = 1;
}

const progress = Math.min(salonRounded / MIN, 1);
const remaining = Math.max(0,MIN - salonRounded);

// fase 1 (0 → 1500)
if (salonRounded <= MIN) {
  percent = (salonRounded / MIN) * 60; // ocupa 60% de la barra
}
// fase 2 (1500 → 10,000)
else {
  const extra = salonRounded - MIN;
  const range = PLUS - MIN;

  percent = 60 + Math.min(extra / range, 1) * 40;
}

  // ======================
  // DESKTOP
  // ======================
  if (desktopProgress) {
  desktopProgress.style.width = percent + "%";
  desktopProgress.classList.remove(
  "bg-white/40",
  "bg-green-400",
  "bg-purple-500"
);

if (salonRounded >= 10000) {
  desktopProgress.classList.add(
    "bg-purple-500",
    "shadow-[0_0_12px_rgba(168,85,247,0.6)]"
  );
} else if (salonRounded >= 1500) {
  desktopProgress.classList.add("bg-green-400");
} else {
  desktopProgress.classList.add("bg-white/40");
}
}

if (desktopMinText) {
  desktopMinText.classList.remove("text-green-400", "text-purple-500");

  if (salonRounded >= 10000) {
    desktopMinText.textContent = "Pedido plus alcanzado ✨";
    desktopMinText.classList.add("text-purple-500");
    

  } else if (salonRounded >= 1500) 
    {
  const remainingPlus = 10000 - salonRounded;

  desktopMinText.innerHTML = `
<div class="flex flex-col leading-tight">
  <span>Pedido mínimo alcanzado.</span>

  <span class="text-white/60 text-[12px] mt-1">
    Agrega <span class="text-purple-500 font-semibold">
      ${money(remainingPlus)}
    </span> para pedido plus
  </span>
</div>
`;
  
  desktopMinText.classList.add("text-green-400");
}
else {
  desktopMinText.textContent =
  `Faltan ${money(1500 - salonRounded)} para pedido mínimo`;
}

}
  if (publicTotal) publicTotal.textContent = money(pub);
  if (savingTotal) {
  if (!hasPublic) {
    savingTotal.textContent = "—";
savingTotal.classList.add("text-white/40");
  } else {
    savingTotal.textContent = money(save);
    savingTotal.classList.remove("text-white/40");
  }
}

const savingNotes = document.querySelectorAll(".saving-note");

savingNotes.forEach((el) => {
  if (hasMixed) {
  el.textContent = "Ganancia parcial";
} else {
  el.textContent = "";
}
});
  
if (finalTotal && creditTitle) {
  finalTotal.textContent = money(salonRounded);

  // 1️⃣ RESET
  finalTotal.classList.remove(
    "text-green-400",
    "text-purple-500",
    "text-white",
    "drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]",
    "drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]"
  );

  creditTitle.classList.remove(
    "text-green-400",
    "text-purple-500",
    "text-white",
    "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    "drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
  );

  // 2️⃣ NIVELES
  if (salonRounded >= 10000) {
    finalTotal.classList.add(
      "text-purple-500",
      "drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]"
    );

    creditTitle.classList.add(
      "text-purple-500",
      "drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
    );

  } else if (salonRounded >= 1500) {
    finalTotal.classList.add(
      "text-green-400",
      "drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]"
    );

    creditTitle.classList.add(
      "text-green-400",
      "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
    );

  } else {
    finalTotal.classList.add("text-white");
    creditTitle.classList.add("text-white");
  }

  // 3️⃣ POP SOLO SI CAMBIA NIVEL
  if (currentLevel !== lastLevel) {
    finalTotal.classList.remove("pop");
    void finalTotal.offsetWidth;
    finalTotal.classList.add("pop");
  }
}

  if (cartCount) {
  cartCount.textContent =
    units === 0
      ? "Sin artículos"
      : units === 1
      ? "1 artículo"
      : `${units} artículos`;
}

if (modalProgress) {
  modalProgress.style.width = percent + "%";
  modalProgress.classList.remove("bg-green-400", "bg-purple-500", "bg-white/40");

if (salonRounded >= 10000) {
  modalProgress.classList.add("bg-purple-500", "shadow-[0_0_12px_rgba(168,85,247,0.6)]");
} else if (salonRounded >= 1500) {
  modalProgress.classList.add("bg-green-400");
} else {
  modalProgress.classList.add("bg-white/40");
}
}

if (modalMinText) {

  modalMinText.classList.remove(
    "text-green-400",
    "text-purple-500"
  );

  if (salonRounded >= 10000) {

    modalMinText.textContent =
      "Pedido plus alcanzado ✨";

    modalMinText.classList.add(
      "text-purple-500"
    );

  }
  else if (salonRounded >= 1500) {

    const remainingPlus =
      10000 - salonRounded;

    modalMinText.innerHTML = `
<div class="flex flex-col leading-tight">
  <span>Pedido mínimo alcanzado.</span>

  <span class="text-white/60 text-[12px] mt-1">
    Agrega <span class="text-green-400 font-semibold">
      ${money(remainingPlus)}
    </span> para pedido plus
  </span>
</div>
`;

    modalMinText.classList.add(
      "text-green-400"
    );

  }
  else {

    modalMinText.textContent =
      `Faltan ${money(1500 - salonRounded)} para pedido mínimo`;

  }

}

/* ======================
   CREDIT (DESKTOP)
====================== */

const isCashOnly =
  creditProfile ===
  "cash_only";

const isOpenCredit =
  creditProfile ===
  "open_credit";

const isAutoTerms =
  creditProfile ===
  "auto_terms";

/* ======================
   RESET ICON
====================== */

creditGiftIcon?.classList.add(
  "hidden"
);

creditGiftIcon?.classList.remove(
  "gift-pop",
  "gift-glow",
  "gift-pulse",
  "gift-enter"
);

/* ======================
   CONTADO FORZOSO
====================== */

if (isCashOnly) {

  if (creditTitleText) {
    creditTitleText.textContent =
      "Pago de contado";
  }

  if (creditText) {
    creditText.textContent =
      "Tu cuenta opera únicamente de contado.";
  }

}

/* ======================
   CREDITO ABIERTO
====================== */

else if (isOpenCredit) {

  if (creditTitleText) {
    creditTitleText.textContent =
      "Crédito abierto";
  }

  if (creditText) {
    creditText.textContent =
      "Tu cuenta maneja pagos flexibles sin vencimiento fijo.";
  }

}

/* ======================
   CREDITO AUTOMATICO
====================== */

else if (isAutoTerms) {

  /* ======================
     MENOR A 1500
  ====================== */

  if (salonRounded < 1500) {

    if (creditTitleText) {
      creditTitleText.textContent =
        "Contado total";
    }

    if (creditText) {
      creditText.textContent =
        "Pedido menor a $1,500";
    }

  }

  /* ======================
     15 DIAS
  ====================== */

  else if (salonRounded < 10000) {

    if (creditTitleText) {
      creditTitleText.textContent =
        "50% entrega + 50% a 15 días";
    }

    if (creditText) {
      creditText.textContent =
        `${money(salon / 2)} hoy y ${money(salon / 2)} después`;
    }

  }

  /* ======================
     30 DIAS
  ====================== */

  else {

    if (creditTitleText) {
      creditTitleText.textContent =
        "50% entrega + 50% a 30 días + ";
    }

    if (creditText) {
      creditText.textContent =
        `${money(salon / 2)} hoy y ${money(salon / 2)} después`;
    }

if (creditGiftIcon) {

  creditGiftIcon.classList.remove(
    "hidden"
  );

  creditGiftIcon.classList.add(
    "gift-glow",
    "gift-pulse"
  );

  /* ======================
     SOLO AL ENTRAR A PLUS
  ====================== */

  if (!plusActivated) {

    plusActivated = true;

    void creditGiftIcon.offsetWidth;

    creditGiftIcon.classList.remove(
      "gift-enter"
    );

    creditGiftIcon.style.opacity =
      "0";

    creditGiftIcon.style.transform =
      "translateX(14px) scale(0.92)";

    requestAnimationFrame(() => {

      creditGiftIcon.style.opacity =
        "";

      creditGiftIcon.style.transform =
        "";

      creditGiftIcon.classList.add(
        "gift-enter"
      );

    });

    creditGiftIcon.classList.remove(
      "gift-pop"
    );

    void creditGiftIcon.offsetWidth;

    creditGiftIcon.classList.add(
      "gift-pop"
    );

  }

}

    }

  }



  const itemsText =
  units === 0
    ? "Sin artículos"
    : units === 1
    ? "1 artículo"
    : `${units} artículos`;

  // ======================
  // MOBILE STICKY
  // ======================
  if (mobileItems) mobileItems.textContent = itemsText;
  if (mobileTotal) {
  mobileTotal.textContent = money(salonRounded);

  mobileTotal.classList.remove(
    "text-green-400",
    "text-purple-500"
  );

 if (salonRounded >= 10000) {
  mobileTotal.classList.add(
    "text-purple-500",
    "drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
  );
} else if (salonRounded >= 1500) {
    mobileTotal.classList.add("text-green-400");
  }
}

  if (mobileClearBtn) {
    mobileClearBtn.classList.toggle("hidden", units === 0);
  }

  // ======================
  // MODAL
  // ======================
  if (modalItems) modalItems.textContent = itemsText;

 if (modalPublic) modalPublic.textContent = money(pub);

if (modalSaving) {
  if (!hasPublic) {
  modalSaving.textContent = "—";
  modalSaving.classList.add("text-white/40");
} else {
  modalSaving.textContent = money(save);
  modalSaving.classList.remove("text-white/40");
}

  // 💡 opcional: color dinámico pro
  modalSaving.classList.toggle("text-green-400", save > 0);
  modalSaving.classList.toggle("text-white/40", save <= 0);
}

if (modalTotal && modalCreditTitle) {
  modalTotal.textContent = money(salonRounded);

  // 1️⃣ RESET
  modalTotal.classList.remove(
    "text-green-400",
    "text-purple-500",
    "text-white",
    "drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]",
    "drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]"
  );

  modalCreditTitle.classList.remove(
    "text-green-400",
    "text-purple-500",
    "text-white",
    "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    "drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
  );

  // 2️⃣ NIVELES
  if (salonRounded >= 10000) {
    modalTotal.classList.add(
      "text-purple-500",
      "drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]"
    );

    modalCreditTitle.classList.add(
      "text-purple-500",
      "drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
    );

  } else if (salonRounded >= 1500) {
    modalTotal.classList.add(
      "text-green-400",
      "drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
    );

    modalCreditTitle.classList.add(
      "text-green-400",
      "drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
    );

  } else {
    modalTotal.classList.add("text-white");
    modalCreditTitle.classList.add("text-white");
  }

  // 3️⃣ POP
  if (currentLevel !== lastLevel) {
    modalTotal.classList.remove("pop");
    void modalTotal.offsetWidth;
    modalTotal.classList.add("pop");
  }
}

/* ======================
   MODAL CREDIT
====================== */

modalCreditGiftIcon?.classList.add(
  "hidden"
);

modalCreditGiftIcon?.classList.remove(
  "gift-pop",
  "gift-glow",
  "gift-pulse",
  "gift-enter"
);

/* ======================
   CONTADO FORZOSO
====================== */

if (isCashOnly) {

  if (modalCreditTitleText) {
    modalCreditTitleText.textContent =
      "Pago de contado";
  }

  if (modalCreditText) {
    modalCreditText.textContent =
      "Tu cuenta opera únicamente de contado.";
  }

}

/* ======================
   CREDITO ABIERTO
====================== */

else if (isOpenCredit) {

  if (modalCreditTitleText) {
    modalCreditTitleText.textContent =
      "Crédito abierto";
  }

  if (modalCreditText) {
    modalCreditText.textContent =
      "Tu cuenta maneja pagos flexibles sin vencimiento fijo.";
  }

}

/* ======================
   CREDITO AUTOMATICO
====================== */

else if (isAutoTerms) {

  /* ======================
     MENOR A 1500
  ====================== */

  if (salonRounded < 1500) {

    if (modalCreditTitleText) {
      modalCreditTitleText.textContent =
        "Contado total";
    }

    if (modalCreditText) {
      modalCreditText.textContent =
        "Pedido menor a $1,500";
    }

  }

  /* ======================
     15 DIAS
  ====================== */

  else if (salonRounded < 10000) {

    if (modalCreditTitleText) {
      modalCreditTitleText.textContent =
        "50% entrega + 50% a 15 días";
    }

    if (modalCreditText) {
      modalCreditText.textContent =
        `${money(salon / 2)} hoy y ${money(salon / 2)} después`;
    }

  }

  /* ======================
     30 DIAS
  ====================== */

  else {

    if (modalCreditTitleText) {
      modalCreditTitleText.textContent =
        "50% entrega + 50% a 30 días + ";
    }

    if (modalCreditText) {
      modalCreditText.textContent =
        `${money(salon / 2)} hoy y ${money(salon / 2)} después`;
    }

if (modalCreditGiftIcon) {

  modalCreditGiftIcon.classList.remove(
    "hidden"
  );

  modalCreditGiftIcon.classList.add(
    "gift-glow",
    "gift-pulse"
  );

  /* ======================
     SOLO AL ENTRAR A PLUS
  ====================== */

  if (!plusActivated) {

    plusActivated = true;

    void modalCreditGiftIcon.offsetWidth;

    modalCreditGiftIcon.classList.remove(
      "gift-enter"
    );

    modalCreditGiftIcon.style.opacity =
      "0";

    modalCreditGiftIcon.style.transform =
      "translateX(14px) scale(0.92)";

    requestAnimationFrame(() => {

      modalCreditGiftIcon.style.opacity =
        "";

      modalCreditGiftIcon.style.transform =
        "";

      modalCreditGiftIcon.classList.add(
          "gift-enter"
        );

    });

    modalCreditGiftIcon.classList.remove(
      "gift-pop"
    );

    void modalCreditGiftIcon.offsetWidth;

    modalCreditGiftIcon.classList.add(
      "gift-pop"
    );

  }

}

}

}

/* ======================
   RESET PLUS STATE
====================== */

if (
  salonRounded < 10000
) {

  plusActivated = false;

}

lastLevel = currentLevel;

  return { salon };
}

async function sendOrder() {

  if (!cart.length) {
    alert("Agrega productos.");
    return;
  }

  try {

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = "Enviando...";
    }

    // ======================
    // USER
    // ======================

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      location.href = "/auth/login";
      return;
    }

    // ======================
    // PROFILE
    // ======================

    const { data: profile } = await supabase
      .from("profiles")
     .select(`
  id,
  role,
  status,
  credit_profile,
  advisor_id,
  name,
  first_name,
  last_name,
  business_name,
  address_line,
  colony,
  postal_code,
  city,
  state
`)
      .eq("id", user.id)
      .single();

    if (!profile) {
      
      alert("No se pudo cargar perfil.");
      return;
    }

const role =
  profile.role as ProfileRole;

const status =
  profile.status as ProfileStatus;

if (status === "blocked") {

  await supabase.auth.signOut();

  location.href = "/auth/blocked";

  return;

}

if (status !== "active") {

  location.href = "/auth/pending";

  return;

}

if (role !== "client") {

  alert("Solo clientes pueden enviar pedidos.");

  return;

}

    

 // ======================
// ADMIN REAL
// ======================

const { data: admin } = await supabase
  .from("admins")
.select(`
  id,
  display_name,
  whatsapp
`)
.eq("profile_id", profile.advisor_id)
.single();

if (!admin) {
  alert("No se encontró asesor.");
  return;
}

const advisorName =
  admin.display_name || "AVYNA";

const phone =
  admin.whatsapp || "";

  // ======================
// CREATE ORDER
// ======================
console.log(profile);

const wasEditingExistingOrder =
  !!existingWeeklyOrder;

const {
  order,
  total
} = await createOrder({

  user,

  profile,

  cart,

  advisorName

});

await createActivityLog({

  client_id: user.id,

  order_id: order.id,

  type:

    wasEditingExistingOrder
      ? "order_updated"
      : "order_created",

  title:

    wasEditingExistingOrder
      ? "Pedido actualizado"
      : "Pedido creado",

  amount: total,

  metadata: {

    delivery_status:
      order.delivery_status,

    payment_type:
      order.payment_type

  }

});

    // ======================
    // WHATSAPP
    // ======================

  const orderTotal =
  Number(total || 0);

const lines: string[] = [];

lines.push("*PEDIDO AVYNA*");

lines.push();

lines.push(
  `Cliente: ${
    profile.name ||
    profile.first_name ||
    user.email
  }`
);

lines.push(
  `_Negocio: ${
    profile.business_name || "-"
  }_`
);

lines.push("");

lines.push("PRODUCTOS:");

cart.forEach((item) => {

  lines.push(
    `*${item.qty}x* ${item.name} — ${money(
      Number(item.priceSalon || 0) * item.qty
    )}`
  );

});

lines.push("");

lines.push(
  `*TOTAL SALÓN: ${money(orderTotal)}*`
);

const msg = encodeURIComponent(
  lines.join("\n")
);

window.open(
  `https://wa.me/${phone}?text=${msg}`,
  "_blank"
);

await supabase
  .from("orders")
  .update({
    whatsapp_sent: true
  })
  .eq("id", order.id);

    // ======================
    // RESET
    // ======================

    cart = [];

    renderAll();

    closeModalFn();

    showSuccess();

  }catch (err: any) {

  console.error(
    "ORDER ERROR",
    err
  );

  alert(
    err?.message ||
    "Error inesperado"
  );

} finally {

    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = "Enviar pedido";
    }

  }

}

  function bindActions() {
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      const clone = btn.cloneNode(true);
      btn.parentNode?.replaceChild(clone, btn);

      clone.addEventListener("click", () => {
  const el = clone as HTMLElement;

  

  updateQty(
    
    el.dataset.id || "",
    Number(el.dataset.step || 0)
  );

  if (isModalOpen()) {
    renderModal();
    totals();
  }
});

    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      const clone = btn.cloneNode(true);
      btn.parentNode?.replaceChild(clone, btn);

      clone.addEventListener("click", () => {
        const el = clone as HTMLElement;
        removeItem(el.dataset.id || "");
      });
    });

    document.querySelectorAll(".qty-input").forEach((input) => {
      const clone = input.cloneNode(true) as HTMLInputElement;
      input.parentNode?.replaceChild(clone, input);

      const save = () => {
        updateQtyDirect(
          
          clone.dataset.id || "",
          Number(clone.value)
        );
      };

      clone.addEventListener("change", save);
      clone.addEventListener("blur", save);
    });
  }

function renderAll() {
  renderProducts();
  renderCart();

  // 👇 clave
  if (isModalOpen()) {
    renderModal();
    totals();
  }
}

  search?.addEventListener("input", applyFilters);
  family?.addEventListener("change", applyFilters);

  limitSelect?.addEventListener("change", () => {
    limit = Number(limitSelect.value);
    page = 1;
    renderProducts();
  });

  prevBtn?.addEventListener("click", () => {
    if (page > 1) {
      page--;
      renderProducts();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (page < totalPages()) {
      page++;
      renderProducts();
    }
  });

  clearBtn?.addEventListener("click", () => {

      if (orderLocked) return;
    cart = [];
    renderAll();
  });

  sendBtn?.addEventListener("click", sendOrder);

  window.addEventListener("resize", renderProducts);

await loadProfile();

loadFamilies();

applyFilters();

renderCart();

totals();

/* ========================================
   LOAD EXISTING
======================================== */

await loadExistingWeeklyOrder();

  
  // MOBILE EVENTS
mobileOpenModal?.addEventListener("click", openModal);
modalBackdrop?.addEventListener("click", closeModalFn);
closeModal?.addEventListener("click", closeModalFn);

// limpiar
mobileClearBtn?.addEventListener("click", () => {
    if (orderLocked) return;
  cart = [];
  renderAll();
});

modalClearBtn?.addEventListener("click", () => {
    if (orderLocked) return;
  cart = [];
  renderAll();
  renderModal();
});

// enviar desde modal
modalSendBtn?.addEventListener("click", sendOrder);
});

function animateItem(
  id: string | number
) {
  const el = document
    .querySelector(`[data-id="${id}"]`)
    ?.closest("div");

  if (!el) return;

  el.classList.add("scale-[1.04]", "transition");

  setTimeout(() => {
    el.classList.remove("scale-[1.04]");
  }, 120);
}

function showSuccess() {

  const old = document.getElementById("successOverlay");

  if (old) old.remove();

  const div = document.createElement("div");

  div.id = "successOverlay";

  div.innerHTML = `
  
  <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4">

    <!-- BACKDROP -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <!-- CARD -->
    <div
      class="
        relative w-full max-w-md overflow-hidden
        rounded-[2rem]
        border border-white/10
        bg-gradient-to-b from-zinc-900 to-black
        p-7
        shadow-[0_0_80px_rgba(0,0,0,0.9)]
        animate-[fadeUp_.35s_ease]
      "
    >

      <!-- GLOW -->
      <div class="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl"></div>

      <!-- ICON -->
      <div class="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-400/20 bg-green-500/10">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 13l4 4L19 7"
          />
        </svg>

      </div>

      <!-- TEXT -->
      <div class="relative mt-6 text-center">

        <p class="text-[11px] uppercase tracking-[0.35em] text-green-400/80">
          Pedido enviado
        </p>

        <h2 class="mt-3 text-3xl font-semibold tracking-tight">
          Pedido registrado
        </h2>

        <p class="mt-3 text-sm leading-7 text-white/50">
          Tu pedido fue enviado correctamente al asesor AVYNA y quedó registrado en el sistema.
        </p>

      </div>

      <!-- ACTION -->
      <div class="relative mt-7 grid gap-3">

       <button
  id="goOrders"
  class="
    flex h-12 items-center justify-center
    rounded-2xl
    bg-white
    text-sm
    font-semibold
    text-black
    transition
    hover:scale-[1.02]
  "
>
  Ver pedidos
</button>

      </div>

    </div>

  </div>
  `;

  document.body.appendChild(div);

  document.body.classList.add("overflow-hidden");

  const close = () => {

    div.remove();

    document.body.classList.remove("overflow-hidden");

  };

  div
    .querySelector("#closeSuccess")
    ?.addEventListener("click", close);

    div
  .querySelector("#goOrders")
  ?.addEventListener(
    "click",
    () => {

      window.location.href =
        "/portal/orders?refresh=" +
        Date.now();

    }
  );

}