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

    return `
      <span class="badge">
        Contado
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
        name,
        business_name,
        email,
        city,
        payment_type,
        status,
        role,
        official_client_id,
        advisor_id,
        created_at
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

      return;
    }

    table.innerHTML = list.map(client => {

      const displayName =
        `${client.first_name || ""} ${client.last_name || ""}`.trim()
        || client.name
        || "—";

      return `

        <tr class="border-b border-white/5 hover:bg-white/[0.03] transition">

          <td class="px-6 py-3">

            <div class="font-medium">
              ${displayName}
            </div>

            ${
              client.business_name
                ? `
                  <div class="text-xs text-white/40">
                    ${client.business_name}
                  </div>
                `
                : ""
            }

          </td>

          <td class="px-6 py-3">
            ${client.email || "—"}
          </td>

          <td class="px-6 py-3">
            ${client.city || "—"}
          </td>

          <td class="px-6 py-3">
            ${badge(client.payment_type)}
          </td>

          <td class="px-6 py-3">
            ${statusBadge(client.status)}
          </td>

          <td class="px-6 py-3 text-right">

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
                Archivar
              </button>

            </div>

          </td>

        </tr>

      `;
    }).join("");

    attachEvents();
  }

  /* =========================
     MODAL
  ========================= */

  function renderModal(client: any) {

    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-card">

        <div class="modal-header">

          <div class="flex flex-col gap-1">

            <h2 class="text-lg font-semibold tracking-tight">
              Cliente
            </h2>

            <div class="flex items-center gap-2 text-sm">

              ${status[client.status] || ""}

              <span class="text-white/30">•</span>

              <span class="text-white/50">
                ${client.email || ""}
              </span>

            </div>

          </div>

          <button
            id="modalCloseBtn"
            class="text-white/40 transition hover:text-white">

            ✕

          </button>

        </div>

        <div class="modal-body">

          <div class="modal-section">

            <p class="section-title">
              Información personal
            </p>

            <div class="grid">

              <input
                id="firstName"
                value="${client.first_name || ""}" />

              <input
                id="lastName"
                value="${client.last_name || ""}" />

            </div>

          </div>

          <div class="modal-section">

            <p class="section-title">
              Información comercial
            </p>

            <input
              id="business"
              value="${client.business_name || ""}" />

            <input
              id="city"
              value="${client.city || ""}" />

            <input
              id="clientId"
              value="${client.official_client_id || ""}" />

          </div>

          <div class="modal-section">

            <p class="section-title">
              Configuración
            </p>

            <select id="paymentType">

              <option
                value="credit"
                ${client.payment_type === "credit"
                  ? "selected"
                  : ""}>
                Crédito
              </option>

              <option
                value="cash"
                ${client.payment_type === "cash"
                  ? "selected"
                  : ""}>
                Contado
              </option>

            </select>

          </div>

        </div>

        <div class="modal-footer">

          <button
            id="cancelBtn"
            class="btn-ghost">
            Cancelar
          </button>

          <button
            id="saveBtn"
            class="btn-save">
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

      modal?.classList.add("hidden");

      currentClient = null;
    };

    document
      .getElementById("modalCloseBtn")
      ?.addEventListener("click", close);

    document
      .getElementById("cancelBtn")
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
      .getElementById("saveBtn")
      ?.addEventListener("click", async () => {

        const btn =
          document.querySelector<HTMLButtonElement>(
            "#saveBtn"
          );

        if (!btn) return;

        btn.innerHTML = "Guardando...";

        btn.classList.add("opacity-70");

        btn.setAttribute(
          "disabled",
          "true"
        );

        const firstNameInput =
          document.querySelector<HTMLInputElement>(
            "#firstName"
          );

        const lastNameInput =
          document.querySelector<HTMLInputElement>(
            "#lastName"
          );

        const businessInput =
          document.querySelector<HTMLInputElement>(
            "#business"
          );

        const cityInput =
          document.querySelector<HTMLInputElement>(
            "#city"
          );

        const clientIdInput =
          document.querySelector<HTMLInputElement>(
            "#clientId"
          );

        const paymentTypeInput =
          document.querySelector<HTMLSelectElement>(
            "#paymentType"
          );

        const updated = {

          first_name:
            firstNameInput?.value || "",

          last_name:
            lastNameInput?.value || "",

          business_name:
            businessInput?.value || "",

          city:
            cityInput?.value || "",

          official_client_id:
            clientIdInput?.value || "",

          payment_type:
            paymentTypeInput?.value || "cash"
        };

        const { error } = await supabase
          .from("profiles")
          .update(updated)
          .eq("id", client.id);

        if (error) {

          console.error(error);

          btn.innerHTML = "Error";

          btn.classList.remove("opacity-70");

          btn.removeAttribute("disabled");

          return;
        }

        btn.innerHTML = "✓ Guardado";

        btn.classList.remove("opacity-70");

        btn.classList.add("bg-green-500");

        setTimeout(async () => {

          close();

          await loadClients();

        }, 800);
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