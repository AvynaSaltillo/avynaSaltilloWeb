import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table =
    document.getElementById("clientsTable") as HTMLElement | null;

  const filterSelect =
    document.getElementById("filterStatus") as HTMLSelectElement | null;

  const modal =
    document.getElementById("clientModal") as HTMLElement | null;

  const modalContent =
    document.getElementById("modalContent") as HTMLElement | null;

  if (!table || !modal || !modalContent) return;

  let clients: any[] = [];
  let currentClient: any = null;

  /* =========================
     🔐 AUTH
  ========================= */

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {

    window.location.href =
      "/auth/login";

    return;
  }

  /* =========================
     🔥 PROFILE
  ========================= */

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from("profiles")
    .select(`
      id,
      role,
      status
    `)
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {

    console.error(profileError);

    await supabase.auth.signOut();

    window.location.href =
      "/auth/login";

    return;
  }

  /* =========================
     🔒 ROLE PROTECTION
  ========================= */

  if (
    profile.role !== "admin" &&
    profile.role !== "super_admin"
  ) {

    window.location.href =
      "/portal";

    return;
  }

  /* =========================
     🔒 STATUS PROTECTION
  ========================= */

  if (profile.status === "blocked") {

    await supabase.auth.signOut();

    window.location.href =
      "/auth/blocked";

    return;
  }

  const adminId = user.id;

  /* =========================
     BADGES
  ========================= */

 const badge = (type = "") => {

  if (type === "credit") {

    return `
      <span class="badge green">
        Crédito
      </span>
    `;
  }

if (type === "cash") {

  return `
    <span class="badge cash">
      Contado
    </span>
  `;
}

  return `
    <span class="badge yellow">
      Sin definir
    </span>
  `;
};

  const statusBadge = (status = "") => {

    if (status === "active") {

      return `
        <span class="badge green">
          Activo
        </span>
      `;
    }

    if (status === "blocked") {

      return `
        <span class="badge red">
          Bloqueado
        </span>
      `;
    }

    return `
      <span class="badge yellow">
        Pendiente
      </span>
    `;
  };

  const status: Record<string, string> = {

    active:
      `<span class="badge green">Activo</span>`,

    blocked:
      `<span class="badge red">Bloqueado</span>`,

    pending:
      `<span class="badge yellow">Pendiente</span>`
  };

  /* =========================
     LOAD CLIENTS
  ========================= */

  async function loadClients() {

    let query = supabase
      .from("profiles")
      .select(`
  id,
  first_name,
  last_name,
  email,
  city,
  business_name,
  payment_type,
  official_client_id,
  status,

  address_line,
  colony,
  state,
  postal_code
`)
      .eq("role", "client")
      .order("created_at", {
        ascending: false
      });

    /* 🔥 ADMIN SOLO VE SUS CLIENTES */

    if (profile?.role === "admin") {

      query = query.eq(
        "advisor_id",
        user!.id
      );
    }

    const {
      data,
      error
    } = await query;

    if (error) {

      console.error(
        "LOAD CLIENTS ERROR:",
        error
      );

      return;
    }

    console.log(
      "CLIENTS:",
      data
    );

    clients = data || [];

    render(clients);
  }

  /* =========================
     RENDER
  ========================= */

function render(list: any[]) {

  if (!table) return;

  const cards =
    document.getElementById(
      "clientsCards"
    ) as HTMLElement | null;

  /* ========================================
     EMPTY
  ========================================= */

  if (!list.length) {

    table.innerHTML = `
      <tr>

        <td
          colspan="6"
          class="py-10 text-center text-white/40"
        >
          Sin clientes
        </td>

      </tr>
    `;

    if (cards) {

      cards.innerHTML = `
        <div class="card p-5 text-center text-sm text-white/40">
          Sin clientes
        </div>
      `;
    }

    return;
  }

  /* ========================================
     DESKTOP TABLE
  ========================================= */

  table.innerHTML = list.map(client => {

    const displayName =
      `${client.first_name || ""} ${client.last_name || ""}`.trim()
      || client.name
      || "—";

    return `

      <tr class="border-b border-white/5 transition hover:bg-white/[0.03]">

        <td class="px-6 py-4">

          <div class="font-medium text-white">
            ${displayName}
          </div>

          ${
            client.business_name
              ? `
                <div class="mt-1 text-xs text-white/40">
                  ${client.business_name}
                </div>
              `
              : ""
          }

        </td>

        <td class="px-6 py-4">
          ${client.email || "—"}
        </td>

        <td class="px-6 py-4">
          ${client.city || "—"}
        </td>

        <td class="px-6 py-4">
          ${badge(client.payment_type)}
        </td>

        <td class="px-6 py-4">
          ${statusBadge(client.status)}
        </td>

        <td class="px-6 py-4 text-right">

          <div class="flex justify-end gap-2">

            ${
              client.status === "pending"

                ? `
                  <button
                    data-id="${client.id}"
                    class="btn-approve">
                    Aprobar
                  </button>
                `

                : client.status === "active"

                ? `
                  <button
                    data-id="${client.id}"
                    class="btn-block">
                    Bloquear
                  </button>
                `

                : `
                  <button
                    data-id="${client.id}"
                    class="btn-activate">
                    Reactivar
                  </button>
                `
            }

            <button
              data-id="${client.id}"
              class="btn-edit">
              Editar
            </button>

            <button
              data-id="${client.id}"
              class="btn-delete">
              Eliminar
            </button>

          </div>

        </td>

      </tr>

    `;
  }).join("");

  /* ========================================
     MOBILE CARDS
  ========================================= */

  if (cards) {

    cards.innerHTML = list.map(client => {

      const displayName =
        `${client.first_name || ""} ${client.last_name || ""}`.trim()
        || client.name
        || "—";

      return `

        <div class="card overflow-hidden">

          <!-- TOP -->
          <button
            data-expand="${client.id}"
            class="flex w-full items-start justify-between gap-3 p-4 text-left transition hover:bg-white/[0.02]"
          >

            <div class="min-w-0">

              <p class="truncate font-semibold text-white">
                ${displayName}
              </p>

              <p class="mt-1 truncate text-sm text-white/45">
                ${client.email || "—"}
              </p>

            </div>

            <div class="flex shrink-0 items-center gap-3">

              ${statusBadge(client.status)}

              <span class="text-white/30">
                ↓
              </span>

            </div>

          </button>

          <!-- EXPAND -->
          <div
            id="expand-${client.id}"
            class="hidden border-t border-white/5 p-4"
          >

            <!-- META -->
            <div class="grid grid-cols-2 gap-4 text-sm">

              <div>

                <p class="text-white/35">
                  Ciudad
                </p>

                <p class="mt-1 text-white">
                  ${client.city || "—"}
                </p>

              </div>

              <div>

                <p class="text-white/35">
                  Tipo
                </p>

                <div class="mt-1">
                  ${badge(client.payment_type)}
                </div>

              </div>

            </div>

            ${
              client.business_name
                ? `
                  <div class="mt-4">

                    <p class="text-sm text-white/35">
                      Negocio
                    </p>

                    <p class="mt-1 text-sm text-white">
                      ${client.business_name}
                    </p>

                  </div>
                `
                : ""
            }

            <!-- ACTIONS -->
            <div class="mt-5 grid grid-cols-2 gap-2">

              ${
                client.status === "pending"

                  ? `
                    <button
                      data-id="${client.id}"
                      class="btn-approve">
                      Aprobar
                    </button>
                  `

                  : client.status === "active"

                  ? `
                    <button
                      data-id="${client.id}"
                      class="btn-block">
                      Bloquear
                    </button>
                  `

                  : `
                    <button
                      data-id="${client.id}"
                      class="btn-activate">
                      Reactivar
                    </button>
                  `
              }

              <button
                data-id="${client.id}"
                class="btn-edit">
                Editar
              </button>

              <button
                data-id="${client.id}"
                class="btn-delete col-span-2">
                Eliminar
              </button>

            </div>

          </div>

        </div>

      `;
    }).join("");

    /* EXPAND EVENTS */

    document
      .querySelectorAll("[data-expand]")
      .forEach(btn => {

        btn.addEventListener("click", () => {

          const id =
            (btn as HTMLElement)
              .dataset.expand;

          const content =
            document.getElementById(
              `expand-${id}`
            );

          content?.classList.toggle(
            "hidden"
          );
        });
      });
  }

  attachEvents();
}
  /* =========================
     MODAL
  ========================= */

  function renderModal(client: any) {

    if (!modalContent) return;

modalContent.innerHTML = `

  <div class="space-y-6">

    <!-- TOP -->
    <div class="flex items-start justify-between gap-4">

      <div>

        <p class="text-2xl font-semibold text-white">
          Cliente
        </p>

        <div class="mt-2 flex flex-wrap items-center gap-2 text-sm">

          ${statusBadge(client.status)}

          <span class="text-white/25">
            •
          </span>

          <span class="text-white/55">
            ${client.email || "Sin correo"}
          </span>

        </div>

      </div>

      <button
        id="closeModal"
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/40 transition hover:bg-white/[0.05] hover:text-white"
      >
        ✕
      </button>

    </div>

    <!-- PERSONAL -->
    <div class="rounded-3xl border border-white/5 bg-white/[0.02] p-5">

      <p class="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/30">
        Información personal
      </p>

      <div class="grid gap-4 sm:grid-cols-2">

        <div>

          <label class="mb-2 block text-sm text-white/45">
            Nombre
          </label>

          <input
            id="editFirstName"
            value="${client.first_name || ""}"
            class="modal-input"
          />

        </div>

        <div>

          <label class="mb-2 block text-sm text-white/45">
            Apellido
          </label>

          <input
            id="editLastName"
            value="${client.last_name || ""}"
            class="modal-input"
          />

        </div>

        <div class="sm:col-span-2">

  <label class="mb-2 block text-sm text-white/45">
    Correo electrónico
  </label>

  <input
    id="editEmail"
    value="${client.email || ""}"
    class="modal-input"
  />

</div>

      </div>

    </div>

    <!-- CONTACT -->
<div class="rounded-3xl border border-white/5 bg-white/[0.02] p-5">

  <p class="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/30">
    Dirección
  </p>

  <div class="space-y-4">

    <!-- ADDRESS -->
    <div>

      <label class="mb-2 block text-sm text-white/45">
        Calle y número
      </label>

      <input
        id="editAddressLine"
        value="${client.address_line || ""}"
        class="modal-input"
      />

    </div>

    <!-- COLONY -->
    <div>

      <label class="mb-2 block text-sm text-white/45">
        Colonia
      </label>

      <input
        id="editColony"
        value="${client.colony || ""}"
        class="modal-input"
      />

    </div>

    <!-- GRID -->
    <div class="grid gap-4 sm:grid-cols-3">

      <div>

        <label class="mb-2 block text-sm text-white/45">
          Ciudad
        </label>

        <input
          id="editCity"
          value="${client.city || ""}"
          class="modal-input"
        />

      </div>

      <div>

        <label class="mb-2 block text-sm text-white/45">
          Estado
        </label>

        <input
          id="editState"
          value="${client.state || ""}"
          class="modal-input"
        />

      </div>

      <div>

        <label class="mb-2 block text-sm text-white/45">
          Código postal
        </label>

        <input
          id="editPostalCode"
          value="${client.postal_code || ""}"
          class="modal-input"
        />

      </div>

    </div>

  </div>

</div>

    <!-- BUSINESS -->
    <div class="rounded-3xl border border-white/5 bg-white/[0.02] p-5">

      <p class="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/30">
        Información comercial
      </p>

      <div class="space-y-4">

        <div>

          <label class="mb-2 block text-sm text-white/45">
            Negocio
          </label>

          <input
            id="editBusiness"
            value="${client.business_name || ""}"
            class="modal-input"
          />

        </div>

      </div>

    </div>

    <!-- SYSTEM -->
    <!-- SYSTEM -->
<div class="rounded-3xl border border-white/5 bg-white/[0.02] p-5">

  <p class="mb-4 text-[11px] uppercase tracking-[0.28em] text-white/30">
    Configuración del sistema
  </p>

  <div class="grid gap-4 sm:grid-cols-2">

    <div>

      <label class="mb-2 block text-sm text-white/45">
        Tipo de cliente
      </label>

      <select
        id="editPaymentType"
        class="modal-input"
      >

        <option
          value="credit"
          ${client.payment_type === "credit" ? "selected" : ""}
        >
          Crédito
        </option>

        <option
          value="cash"
          ${client.payment_type === "cash" ? "selected" : ""}
        >
          Contado
        </option>

      </select>

    </div>

    <div>

      <label class="mb-2 block text-sm text-white/45">
        Official Client ID
      </label>

      <input
        id="editOfficialId"
        value="${client.official_client_id || ""}"
        placeholder="Sin asignar"
        class="modal-input"
      />

    </div>

  </div>

</div>

    <!-- ACTIONS -->
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

      <button
        id="cancelEdit"
        class="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:bg-white/[0.06]"
      >
        Cancelar
      </button>

      <button
        id="saveClient"
        class="h-12 rounded-2xl bg-green-500 px-6 text-sm font-semibold text-black transition hover:brightness-110"
      >
        Guardar cambios
      </button>

    </div>

  </div>

`;

    attachModalEvents(client);
  }

  /* =========================
     MODAL EVENTS
  ========================= */

  function attachModalEvents(client: any) {

    const close = () => {

  modal?.classList.add(
    "hidden"
  );

  currentClient = null;

  /* 🔥 RESTORE SCROLL */

  document.body.style.overflow =
    "";

  document.documentElement.style.overflow =
    "";
};

    document
      .getElementById("closeModal")
      ?.addEventListener("click", close);

    document
      .getElementById("cancelEdit")
      ?.addEventListener("click", close);

    document
      .getElementById("modalOverlay")
      ?.addEventListener("click", close);

    document.onkeydown = (e) => {

      if (e.key === "Escape") {
        close();
      }
    };

    /* SAVE */

    document
  .getElementById("saveClient")
  ?.addEventListener("click", async () => {

    const btn =
      document.querySelector<HTMLButtonElement>(
        "#saveClient"
      );

    if (!btn) return;

    btn.innerHTML =
      "Guardando...";

    btn.classList.add(
      "opacity-70"
    );

    btn.disabled = true;

    /* ========================================
       INPUTS
    ========================================= */

    const updated = {

      first_name:
        (
          document.getElementById(
            "editFirstName"
          ) as HTMLInputElement
        )?.value || "",

      last_name:
        (
          document.getElementById(
            "editLastName"
          ) as HTMLInputElement
        )?.value || "",

      email:
        (
          document.getElementById(
            "editEmail"
          ) as HTMLInputElement
        )?.value || "",

      business_name:
        (
          document.getElementById(
            "editBusiness"
          ) as HTMLInputElement
        )?.value || "",

      address_line:
        (
          document.getElementById(
            "editAddressLine"
          ) as HTMLInputElement
        )?.value || "",

      colony:
        (
          document.getElementById(
            "editColony"
          ) as HTMLInputElement
        )?.value || "",

      city:
        (
          document.getElementById(
            "editCity"
          ) as HTMLInputElement
        )?.value || "",

      state:
        (
          document.getElementById(
            "editState"
          ) as HTMLInputElement
        )?.value || "",

      postal_code:
        (
          document.getElementById(
            "editPostalCode"
          ) as HTMLInputElement
        )?.value || "",

      official_client_id:
        (
          document.getElementById(
            "editOfficialId"
          ) as HTMLInputElement
        )?.value || "",

      payment_type:
        (
          document.getElementById(
            "editPaymentType"
          ) as HTMLSelectElement
        )?.value || "cash"
    };

    /* ========================================
       UPDATE
    ========================================= */

    const { error } =
      await supabase
        .from("profiles")
        .update(updated)
        .eq("id", client.id);

    if (error) {

      console.error(error);

      btn.innerHTML =
        "Error";

      btn.disabled = false;

      btn.classList.remove(
        "opacity-70"
      );

      return;
    }

    btn.innerHTML =
      "✓ Guardado";

    btn.classList.remove(
      "opacity-70"
    );

    btn.classList.add(
      "bg-green-400"
    );

    setTimeout(async () => {

      close();

      await loadClients();

    }, 700);
  });
  }

  /* =========================
     EVENTS
  ========================= */

  function attachEvents() {

    /* APPROVE */

    document
      .querySelectorAll(".btn-approve")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async () => {

            const id =
              (btn as HTMLElement)
                .dataset.id;

            await supabase
              .from("profiles")
              .update({
                status: "active"
              })
              .eq("id", id);

            await loadClients();
          }
        );
      });

    /* BLOCK */

    document
      .querySelectorAll(".btn-block")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async () => {

            const id =
              (btn as HTMLElement)
                .dataset.id;

            await supabase
              .from("profiles")
              .update({
                status: "blocked"
              })
              .eq("id", id);

            await loadClients();
          }
        );
      });

    /* ACTIVATE */

    document
      .querySelectorAll(".btn-activate")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async () => {

            const id =
              (btn as HTMLElement)
                .dataset.id;

            await supabase
              .from("profiles")
              .update({
                status: "active"
              })
              .eq("id", id);

            await loadClients();
          }
        );
      });

    /* EDIT */

    document
      .querySelectorAll(".btn-edit")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async (e) => {

            e.stopPropagation();

            const id =
              (btn as HTMLElement)
                .dataset.id;

            const { data } =
              await supabase
                .from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (!data) return;

            currentClient = data;

            renderModal(data);

           modal?.classList.remove(
  "hidden"
);

/* 🔥 LOCK SCROLL */

document.body.style.overflow =
  "hidden";

document.documentElement.style.overflow =
  "hidden";
          }
        );
      });

    /* ARCHIVE */

    document
      .querySelectorAll(".btn-delete")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          async () => {

            const id =
              (btn as HTMLElement)
                .dataset.id;

            if (
              !confirm(
                "¿Archivar cliente?"
              )
            ) {
              return;
            }

            await supabase
              .from("profiles")
              .update({
                status: "blocked"
              })
              .eq("id", id);

            await loadClients();
          }
        );
      });
  }

  /* =========================
     FILTER
  ========================= */

  function applyFilter() {

    let list = [...clients];

    const val =
      filterSelect?.value || "";

    if (val === "pending") {

      list = list.filter(
        c => c.status === "pending"
      );
    }

    if (val === "approved") {

      list = list.filter(
        c => c.status === "active"
      );
    }

    if (val === "blocked") {

      list = list.filter(
        c => c.status === "blocked"
      );
    }

    render(list);
  }

  filterSelect?.addEventListener(
    "change",
    applyFilter
  );

  await loadClients();

});