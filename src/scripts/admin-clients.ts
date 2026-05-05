import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const table = document.getElementById("clientsTable") as HTMLElement;
  const filterSelect = document.getElementById("filterStatus") as HTMLSelectElement;

  const modal = document.getElementById("clientModal") as HTMLElement;
  const modalContent = document.getElementById("modalContent") as HTMLElement;

  let clients: any[] = [];
  let currentClient: any = null;

  /* BADGES */
  const badge = (type = "") =>
    type === "credit"
      ? `<span class="badge green">Crédito</span>`
      : `<span class="badge">Contado</span>`;

  const statusBadge = (status = "") => {
    if (status === "active") return `<span class="badge green">Activo</span>`;
    if (status === "blocked") return `<span class="badge red">Bloqueado</span>`;
    return `<span class="badge yellow">Pendiente</span>`;
  };

  /* LOAD */
  async function loadClients() {
    const { data, error } = await supabase
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
        official_client_id
      `)
      .eq("role", "client")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    clients = data || [];
    render(clients);
  }

  /* RENDER */
  function render(list: any[]) {

    if (!table) return;

    if (!list.length) {
      table.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-10 text-white/40">
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
            <div class="font-medium">${displayName}</div>
            ${
              client.business_name
                ? `<div class="text-xs text-white/40">${client.business_name}</div>`
                : ""
            }
          </td>

          <td class="px-6 py-3">${client.email || "—"}</td>

          <td class="px-6 py-3">${client.city || "—"}</td>

          <td class="px-6 py-3">${badge(client.payment_type)}</td>

          <td class="px-6 py-3">${statusBadge(client.status)}</td>

          <td class="px-6 py-3 text-right">
            <div class="flex justify-end gap-2">

              ${
                client.status === "pending"
                  ? `<button data-id="${client.id}" class="btn-approve">Aprobar</button>`
                  : client.status === "active"
                  ? `<button data-id="${client.id}" class="btn-block">Bloquear</button>`
                  : `<button data-id="${client.id}" class="btn-activate">Reactivar</button>`
              }

              <button data-id="${client.id}" class="btn-edit">Editar</button>
              <button data-id="${client.id}" class="btn-delete">Eliminar</button>

            </div>
          </td>

        </tr>
      `;
    }).join("");

    attachEvents();
  }

function renderModal(client: any) {

  modalContent.innerHTML = `
  <div class="modal-card" id="modalCard">

    <div class="modal-header">

  <div class="flex flex-col gap-1">
    <h2 class="text-lg font-semibold tracking-tight">
      Cliente
    </h2>

    <div class="flex items-center gap-2 text-sm">
      ${status[client.status] || ""}
      <span class="text-white/30">•</span>
      <span class="text-white/50">${client.email || ""}</span>
    </div>
  </div>

  <button id="modalCloseBtn" class="text-white/40 hover:text-white transition">
    ✕
  </button>

</div>

    <div class="modal-body">

      <div class="modal-section">
        <p class="section-title">Información personal</p>

        <div class="grid">
          <input id="firstName" value="${client.first_name || ""}" />
          <input id="lastName" value="${client.last_name || ""}" />
        </div>
      </div>

      <div class="modal-section">
        <p class="section-title">Información comercial</p>

        <input id="business" value="${client.business_name || ""}" />
        <input id="city" value="${client.city || ""}" />
        <input id="clientId" value="${client.official_client_id || ""}" />
      </div>

      <div class="modal-section">
        <p class="section-title">Configuración</p>

        <select id="paymentType">
          <option value="credit" ${client.payment_type === "credit" ? "selected" : ""}>Crédito</option>
          <option value="cash" ${client.payment_type === "cash" ? "selected" : ""}>Contado</option>
        </select>
      </div>

    </div>

    <div class="modal-footer">
      <button id="cancelBtn" class="btn-ghost">Cancelar</button>
      <button id="saveBtn" class="btn-save">Guardar cambios</button>
    </div>

  </div>
  `;

  attachModalEvents(client);
}

function attachModalEvents(client: any) {

  const close = () => {
    modal.classList.add("hidden");
    currentClient = null;
  };

  const closeBtn = document.getElementById("modalCloseBtn");
const cancelBtn = document.getElementById("cancelBtn");

closeBtn?.addEventListener("click", close);
cancelBtn?.addEventListener("click", close);

  const overlay = document.getElementById("modalOverlay");
  overlay?.addEventListener("click", close);

  document.onkeydown = (e) => {
    if (e.key === "Escape") close();
  };

  // guardar
  document.getElementById("saveBtn")?.addEventListener("click", async () => {

    const btn = document.getElementById("saveBtn") as HTMLButtonElement;

    btn.innerHTML = "Guardando...";
btn.classList.add("opacity-70");
    btn.setAttribute("disabled", "true");

    const updated = {
      first_name: (document.getElementById("firstName") as HTMLInputElement).value,
      last_name: (document.getElementById("lastName") as HTMLInputElement).value,
      business_name: (document.getElementById("business") as HTMLInputElement).value,
      city: (document.getElementById("city") as HTMLInputElement).value,
      official_client_id: (document.getElementById("clientId") as HTMLInputElement).value,
      payment_type: (document.getElementById("paymentType") as HTMLSelectElement).value
    };

    const { error } = await supabase
      .from("profiles")
      .update(updated)
      .eq("id", client.id);

    if (error) {
      btn.textContent = "Error";
      return;
    }

    btn.innerHTML = "✓ Guardado";
btn.classList.remove("opacity-70");
btn.classList.add("bg-green-500");

    setTimeout(() => {
      close();
      loadClients();
    }, 800);
  });
}

  /* EVENTS */
  function attachEvents() {

    // ✅ aprobar
    document.querySelectorAll(".btn-approve").forEach(btn => {
      btn.addEventListener("click", async () => {

        const id = (btn as HTMLElement).dataset.id;

        await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("id", id);

        await loadClients();
      });
    });

    // 🔒 bloquear
    document.querySelectorAll(".btn-block").forEach(btn => {
      btn.addEventListener("click", async () => {

        const id = (btn as HTMLElement).dataset.id;

        await supabase
          .from("profiles")
          .update({ status: "blocked" })
          .eq("id", id);

        await loadClients();
      });
    });

    // 🔄 reactivar
    document.querySelectorAll(".btn-activate").forEach(btn => {
      btn.addEventListener("click", async () => {

        const id = (btn as HTMLElement).dataset.id;

        await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("id", id);

        await loadClients();
      });
    });

    // ✏️ editar
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", async (e) => {

        e.stopPropagation();

        const id = (btn as HTMLElement).dataset.id;

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        currentClient = data;
        renderModal(data);

        modal.classList.remove("hidden");
      });
    });

    // 🗑 eliminar
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", async () => {

        const id = (btn as HTMLElement).dataset.id;

        if (!confirm("¿Eliminar cliente?")) return;

        const confirmText = prompt("Escribe ELIMINAR para confirmar");
        if (confirmText !== "ELIMINAR") return;

        await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        await loadClients();
      });
    });
  }

  /* FILTER */
  function applyFilter() {

    let list = [...clients];
    const val = filterSelect?.value;

    if (val === "pending") list = list.filter(c => c.status === "pending");
    if (val === "approved") list = list.filter(c => c.status === "active");
    if (val === "blocked") list = list.filter(c => c.status === "blocked");

    render(list);
  }

  filterSelect?.addEventListener("change", applyFilter);

  await loadClients();

});