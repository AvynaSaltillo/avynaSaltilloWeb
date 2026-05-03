// src/scripts/new-order.ts
// ARCHIVO COMPLETO CORREGIDO

import { supabase } from "../lib/supabase";

type Product = {
  id: number | string;
  name: string;
  family?: string;
  priceSalon?: number;
  pricePublic?: number;
};

type CartItem = Product & {
  qty: number;
};

declare global {
  interface Window {
    __PRODUCTS__: Product[];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = window.__PRODUCTS__ || [];

  const $ = (id: string) => document.getElementById(id);

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

  let filtered = [...products];
  let cart: CartItem[] = [];

  let page = 1;
  let limit = 10;

  const advisors: Record<string, string> = {
    David: "528442564688",
    Daniel: "528441111111",
    Fernanda: "528443333333"
  };

  const isMobile = () => window.innerWidth < 1024;

  function money(v = 0) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0
    }).format(Number(v));
  }

  function qtyOf(id: number | string) {
    return cart.find((x) => String(x.id) === String(id))?.qty || 0;
  }

  function removeItem(id: string) {
    cart = cart.filter((x) => String(x.id) !== id);
    renderAll();
  }

  function updateQty(id: string, step: number) {
    const found = cart.find((x) => String(x.id) === id);

    if (!found && step > 0) {
      const item = products.find((x) => String(x.id) === id);
      if (!item) return;

      cart.push({
        ...item,
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

    renderAll();
  }

  function updateQtyDirect(id: string, qty: number) {
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
        ...item,
        qty
      });

      renderAll();
      return;
    }

    found.qty = qty;
    renderAll();
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
<div class="rounded-3xl border border-white/10 bg-white/[0.03] p-3 space-y-2">

<div class="flex justify-between gap-3">
<div class="min-w-0 flex-1">
<p class="text-[13px] font-medium leading-5 break-words">
${item.name}
</p>

<p class="mt-1 text-[12px] text-white/45">
${item.family || "-"}
</p>
</div>

<p class="text-[13px] font-semibold shrink-0">
${money(item.priceSalon || 0)}
</p>
</div>

<div class="flex justify-end items-center gap-2">

<button
class="remove-btn h-9 w-9 rounded-xl border border-red-400/20 text-red-300"
data-id="${item.id}">
✕
</button>

<button
class="qty-btn h-9 w-9 rounded-xl border border-white/10"
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
/>

<button
class="qty-btn h-9 w-9 rounded-xl border border-white/10"
data-id="${item.id}"
data-step="1">
+
</button>

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
class="qty-btn h-9 w-9 rounded-xl border border-white/10"
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
/>

<button
class="qty-btn h-9 w-9 rounded-xl border border-white/10"
data-id="${item.id}"
data-step="1">
+
</button>

<button
class="remove-btn h-9 w-9 rounded-xl border border-red-400/20 text-red-300"
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
<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
Sin productos agregados.
</div>`;
      totals();
      return;
    }

    cartBox.innerHTML = cart.map((item) => `
<div class="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">

<div class="flex items-start justify-between gap-2">

<p class="text-[13px] font-medium leading-5 pr-2">
${item.name}
</p>

<button
class="remove-btn h-8 w-8 rounded-xl border border-red-400/20 text-red-300 shrink-0"
data-id="${item.id}">
✕
</button>

</div>

<div class="mt-3 flex items-center justify-between gap-2">

<div class="flex items-center gap-1">

<button
class="qty-btn h-8 w-8 rounded-xl border border-white/10"
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
/>

<button
class="qty-btn h-8 w-8 rounded-xl border border-white/10"
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

  function totals() {
    let pub = 0;
    let salon = 0;

    cart.forEach((item) => {
      pub += Number(item.pricePublic || 0) * item.qty;
      salon += Number(item.priceSalon || 0) * item.qty;
    });

    const save = pub - salon;
    const units = cart.reduce((a, b) => a + b.qty, 0);

    if (publicTotal) publicTotal.textContent = money(pub);
    if (savingTotal) savingTotal.textContent = money(save);
    if (finalTotal) finalTotal.textContent = money(salon);
    if (cartCount) cartCount.textContent = `${units} items`;

    if (salon < 1500) {
      if (creditTitle) creditTitle.textContent = "Contado total";
      if (creditText) creditText.textContent = "Pedido menor a $1,500";
    } else if (salon < 10000) {
      if (creditTitle) creditTitle.textContent = "50% entrega + 50% a 15 días";
      if (creditText) creditText.textContent = `${money(salon / 2)} entrega y ${money(salon / 2)} después`;
    } else {
      if (creditTitle) creditTitle.textContent = "50% hoy + 50% a 30 días";
      if (creditText) creditText.textContent = `${money(salon / 2)} entrega y ${money(salon / 2)} después`;
    }

    return { salon };
  }

  async function sendOrder() {
    if (!cart.length) {
      alert("Agrega productos.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        location.href = "/auth/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name,first_name,advisor")
        .eq("id", user.id)
        .maybeSingle();

      const advisor = profile?.advisor || "David";
      const phone = advisors[advisor];
      const client =
        profile?.name ||
        profile?.first_name ||
        user.email;

      const sums = totals();

      let msg = `*PEDIDO AVYNA*%0A%0A`;
      msg += `Cliente: ${client}%0A`;
      msg += `Asesor: ${advisor}%0A%0A`;

      cart.forEach((item) => {
        msg += `${item.qty} x ${item.name}%0A`;
      });

      msg += `%0ATotal: ${money(sums.salon)}`;

      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");

    } catch {
      alert("No se pudo enviar.");
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
    cart = [];
    renderAll();
  });

  sendBtn?.addEventListener("click", sendOrder);

  window.addEventListener("resize", renderProducts);

  loadFamilies();
  applyFilters();
});