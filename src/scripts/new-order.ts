// src/scripts/new-order.ts

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

document.addEventListener("DOMContentLoaded", async () => {
  const products =
    window.__PRODUCTS__ || [];

  const $ = (id: string) =>
    document.getElementById(id);

  const grid = $("productsGrid");
  const cartBox = $("cartItems");

  const search =
    $("searchInput") as HTMLInputElement | null;

  const family =
    $("familyFilter") as HTMLSelectElement | null;

  const limitSelect =
    $("limitSelect") as HTMLSelectElement | null;

  const pageInfo =
    $("pageInfo");

  const prevBtn =
    $("prevPage");

  const nextBtn =
    $("nextPage");

  const cartCount =
    $("cartCount");

  const publicTotal =
    $("publicTotal");

  const savingTotal =
    $("savingTotal");

  const finalTotal =
    $("finalTotal");

  const clearBtn =
    $("clearBtn");

  const sendBtn =
    $("sendBtn") as HTMLButtonElement | null;

  const creditTitle =
    $("creditTitle");

  const creditText =
    $("creditText");

  let filtered = [...products];
  let cart: CartItem[] = [];

  let page = 1;
  let limit = 10;

  /* ==============================
     WHATSAPP
  ============================== */
  const advisors: Record<
    string,
    string
  > = {
    David:
      "528442564688",
    Daniel:
      "528441111111",
    Fernanda:
      "528443333333"
  };

  /* ==============================
     HELPERS
  ============================== */
  function money(v = 0) {
    return new Intl.NumberFormat(
      "es-MX",
      {
        style:
          "currency",
        currency:
          "MXN",
        maximumFractionDigits: 0
      }
    ).format(Number(v));
  }

  function qtyOf(
    id: number | string
  ) {
    return (
      cart.find(
        (x) =>
          String(
            x.id
          ) ===
          String(id)
      )?.qty || 0
    );
  }

  /* ==============================
     FILTERS
  ============================== */
  function loadFamilies() {
    if (!family)
      return;

    const rows =
      [
        ...new Set(
          products
            .map(
              (x) =>
                x.family
            )
            .filter(
              Boolean
            )
        )
      ];

    family.innerHTML =
      `<option value="">Todas las líneas</option>` +
      rows
        .map(
          (x) =>
            `<option value="${x}">${x}</option>`
        )
        .join("");
  }

  function applyFilters() {
    const text =
      search?.value
        .trim()
        .toLowerCase() ||
      "";

    const fam =
      family?.value ||
      "";

    filtered =
      products.filter(
        (item) => {
          const byText =
            item.name
              .toLowerCase()
              .includes(
                text
              );

          const byFam =
            !fam ||
            item.family ===
              fam;

          return (
            byText &&
            byFam
          );
        }
      );

    page = 1;
    renderProducts();
  }

  /* ==============================
     PAGINATION
  ============================== */
  function currentRows() {
    const start =
      (page - 1) *
      limit;

    const end =
      start +
      limit;

    return filtered.slice(
      start,
      end
    );
  }

  function totalPages() {
    return Math.max(
      1,
      Math.ceil(
        filtered.length /
          limit
      )
    );
  }

  function updatePager() {
    if (pageInfo) {
      pageInfo.textContent =
        `${page} / ${totalPages()}`;
    }

    if (prevBtn) {
      prevBtn.toggleAttribute(
        "disabled",
        page <= 1
      );
    }

    if (nextBtn) {
      nextBtn.toggleAttribute(
        "disabled",
        page >=
          totalPages()
      );
    }
  }

  /* ==============================
     PRODUCTS TABLE
  ============================== */
  function renderProducts() {
    if (!grid)
      return;

    const rows =
      currentRows();

    if (!rows.length) {
      grid.innerHTML =
        `<div class="p-5 text-white/45">Sin resultados.</div>`;
      updatePager();
      return;
    }

    grid.innerHTML =
      rows
        .map(
          (item) => `
        <div class="grid grid-cols-[2fr_1fr_1fr_180px] gap-3 px-5 py-4 items-center hover:bg-white/[0.02] transition">

          <div class="min-w-0">
            <p class="truncate font-medium">
              ${item.name}
            </p>
          </div>

          <div class="text-sm text-white/55">
            ${
              item.family ||
              "-"
            }
          </div>

          <div class="font-medium">
            ${money(
              item.priceSalon ||
                0
            )}
          </div>

          <div class="flex items-center justify-center gap-2">

            <button
              class="qty-btn h-9 w-9 rounded-xl border border-white/10"
              data-id="${
                item.id
              }"
              data-step="-1"
            >
              -
            </button>

            <span class="w-8 text-center text-sm">
              ${qtyOf(
                item.id
              )}
            </span>

            <button
              class="qty-btn h-9 w-9 rounded-xl border border-white/10"
              data-id="${
                item.id
              }"
              data-step="1"
            >
              +
            </button>

          </div>

        </div>
      `
        )
        .join("");

    bindQty();
    updatePager();
  }

  /* ==============================
     CART
  ============================== */
  function updateQty(
    id: string,
    step: number
  ) {
    const found =
      cart.find(
        (x) =>
          String(
            x.id
          ) === id
      );

    if (
      !found &&
      step > 0
    ) {
      const item =
        products.find(
          (x) =>
            String(
              x.id
            ) === id
        );

      if (!item)
        return;

      cart.push({
        ...item,
        qty: 1
      });

      renderAll();
      return;
    }

    if (!found)
      return;

    found.qty +=
      step;

    if (
      found.qty <= 0
    ) {
      cart =
        cart.filter(
          (x) =>
            String(
              x.id
            ) !== id
        );
    }

    renderAll();
  }

  function renderCart() {
    if (!cartBox)
      return;

    if (!cart.length) {
      cartBox.innerHTML =
        `
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
          Sin productos agregados.
        </div>
      `;
      totals();
      return;
    }

    cartBox.innerHTML =
      cart
        .map(
          (item) => `
        <div class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">

          <div class="space-y-3">

            <div class="min-w-0">
              <p class="truncate font-medium text-sm">
                ${item.name}
              </p>
            </div>

            <div class="flex items-center justify-between gap-3">

              <div class="flex items-center gap-2">

                <button
                  class="qty-btn h-8 w-8 rounded-xl border border-white/10"
                  data-id="${item.id}"
                  data-step="-1"
                >
                  -
                </button>

                <span class="w-6 text-center text-sm">
                  ${item.qty}
                </span>

                <button
                  class="qty-btn h-8 w-8 rounded-xl border border-white/10"
                  data-id="${item.id}"
                  data-step="1"
                >
                  +
                </button>

              </div>

              <p class="text-sm font-medium">
                ${money(
                  Number(
                    item.priceSalon ||
                      0
                  ) *
                    item.qty
                )}
              </p>

            </div>

          </div>

        </div>
      `
        )
        .join("");

    bindQty();
    totals();
  }

  /* ==============================
     TOTALS + CREDIT
  ============================== */
  function totals() {
    let pub = 0;
    let salon = 0;

    cart.forEach(
      (item) => {
        pub +=
          Number(
            item.pricePublic ||
              0
          ) * item.qty;

        salon +=
          Number(
            item.priceSalon ||
              0
          ) * item.qty;
      }
    );

    const save =
      pub - salon;

    if (publicTotal)
      publicTotal.textContent =
        money(pub);

    if (savingTotal)
      savingTotal.textContent =
        money(save);

    if (finalTotal)
      finalTotal.textContent =
        money(salon);

    const units =
      cart.reduce(
        (
          a,
          b
        ) =>
          a +
          b.qty,
        0
      );

    if (cartCount) {
      cartCount.textContent =
        `${units} items`;
    }

    /* CREDIT RULES */
    if (
      salon < 1500
    ) {
      creditTitle &&
        (creditTitle.textContent =
          "Contado total");

      creditText &&
        (creditText.textContent =
          "Pedido menor a $1,500.");
    }

    else if (
      salon < 10000
    ) {
      creditTitle &&
        (creditTitle.textContent =
          "50% hoy + 50% a 15 días");

      creditText &&
        (creditText.textContent =
          `${money(
            salon / 2
          )} hoy y ${money(
            salon / 2
          )} después.`);
    }

    else {
      creditTitle &&
        (creditTitle.textContent =
          "50% hoy + 50% a 30 días");

      creditText &&
        (creditText.textContent =
          `${money(
            salon / 2
          )} hoy y ${money(
            salon / 2
          )} después.`);
    }

    return {
      public: pub,
      salon,
      saving: save
    };
  }

  /* ==============================
     SEND ORDER
  ============================== */
  async function sendOrder() {
    if (!cart.length) {
      alert(
        "Agrega productos."
      );
      return;
    }

    try {
      const {
        data: {
          user
        }
      } =
        await supabase.auth.getUser();

      if (!user) {
        location.href =
          "/auth/login";
        return;
      }

      const {
        data: profile
      } =
        await supabase
          .from(
            "profiles"
          )
          .select(
            "name,first_name,advisor"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();

      const advisor =
        profile?.advisor ||
        "David";

      const phone =
        advisors[
          advisor
        ] ||
        advisors.David;

      const client =
        profile?.name ||
        profile?.first_name ||
        user.email ||
        "Cliente";

      const sums =
        totals();

      let msg =
        `*PEDIDO AVYNA*%0A%0A`;

      msg += `Cliente: ${client}%0A`;
      msg += `Asesor: ${advisor}%0A%0A`;

      msg +=
        `*DETALLE*%0A`;

      cart.forEach(
        (
          item
        ) => {
          msg += `${item.qty} x ${item.name}%0A`;
        }
      );

      msg += `%0ATotal: ${money(
        sums.salon
      )}`;

      window.open(
        `https://wa.me/${phone}?text=${msg}`,
        "_blank"
      );

    } catch {
      alert(
        "No se pudo enviar."
      );
    }
  }

  /* ==============================
     EVENTS
  ============================== */

function bindQty() {
  document
    .querySelectorAll(".qty-btn")
    .forEach((btn) => {
      const clone =
        btn.cloneNode(true);

      btn.parentNode?.replaceChild(
        clone,
        btn
      );

      clone.addEventListener(
        "click",
        () => {
          const el =
            clone as HTMLElement;

          updateQty(
            el.dataset.id || "",
            Number(
              el.dataset.step || 0
            )
          );
        }
      );
    });
}
  function renderAll() {
    renderProducts();
    renderCart();
  }

  search?.addEventListener(
    "input",
    applyFilters
  );

  family?.addEventListener(
    "change",
    applyFilters
  );

  limitSelect?.addEventListener(
    "change",
    () => {
      limit = Number(
        limitSelect.value
      );

      page = 1;

      renderProducts();
    }
  );

  prevBtn?.addEventListener(
    "click",
    () => {
      if (
        page > 1
      ) {
        page--;
        renderProducts();
      }
    }
  );

  nextBtn?.addEventListener(
    "click",
    () => {
      if (
        page <
        totalPages()
      ) {
        page++;
        renderProducts();
      }
    }
  );

  clearBtn?.addEventListener(
    "click",
    () => {
      cart = [];
      renderAll();
    }
  );

  sendBtn?.addEventListener(
    "click",
    sendOrder
  );

  /* INIT */
  loadFamilies();
  applyFilters();
});