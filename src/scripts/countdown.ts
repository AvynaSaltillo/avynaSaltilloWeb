export function startCountdown() {
  const el =
    document.getElementById("countdown");

  const status =
    document.getElementById("cutoffStatus");

  const badge =
    document.getElementById("weeklyBadge");

  if (!el || !status || !badge) return;

  function nextThursday(now: Date) {
    const target = new Date(now);
    const day = now.getDay();

    let add = (4 - day + 7) % 7;

    if (
      day === 4 &&
      (
        now.getHours() < 23 ||
        (now.getHours() === 23 &&
          now.getMinutes() < 59)
      )
    ) {
      add = 0;
    }

    target.setDate(now.getDate() + add);
    target.setHours(23, 59, 59, 999);

    return target;
  }

  function tick() {
    const now = new Date();
    const target = nextThursday(now);

    const diff =
      target.getTime() - now.getTime();

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    el!.textContent =
      `${String(d).padStart(2, "0")}:` +
      `${String(h).padStart(2, "0")}:` +
      `${String(m).padStart(2, "0")}:` +
      `${String(s).padStart(2, "0")}`;

    badge!.textContent =
      "Pedidos abiertos";

    status!.textContent =
      "Recibiendo pedidos.";
  }

  tick();
  setInterval(tick, 1000);
}