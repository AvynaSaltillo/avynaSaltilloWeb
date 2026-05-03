import { supabase } from "../lib/supabase";
import { money } from "./helpers";
import { startCountdown } from "./countdown";

document.addEventListener("DOMContentLoaded", async () => {
  startCountdown();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    location.href = "/auth/login";
    return;
  }

  const user = session.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.first_name) {
    const el =
      document.getElementById("welcomeName");

    if (el) {
      el.textContent =
        `Hola, ${profile.first_name}`;
    }
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false
    });

  const list = orders || [];

  const month =
    new Date().getMonth();

  const monthTotal = list
    .filter((x: any) =>
      new Date(x.created_at).getMonth() === month
    )
    .reduce(
      (a: number, b: any) =>
        a + (b.total || 0),
      0
    );

  const pending = list.reduce(
    (a: number, b: any) =>
      a + (b.balance || 0),
    0
  );

  const setText = (id: string, value: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("monthTotal", money(monthTotal));
  setText("ordersCount", String(list.length));
  setText("pendingBalance", money(pending));

  const box =
    document.getElementById("ordersList");

  if (!box) return;

  if (!list.length) {
    box.innerHTML = `
      <div class="rounded-2xl border border-white/10 p-4 text-white/45">
        No tienes pedidos.
      </div>
    `;
    return;
  }

  box.innerHTML = list
    .slice(0, 5)
    .map((item: any) => `
      <div class="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4">
        <div>
          <p class="font-medium">#${item.id}</p>
          <p class="text-xs text-white/45">${item.status}</p>
        </div>

        <p class="font-medium">
          ${money(item.total)}
        </p>
      </div>
    `)
    .join("");
});