export function startCountdown() {

  const countdownEl =
    document.getElementById(
      "countdown"
    );

  const statusEl =
    document.getElementById(
      "cutoffStatus"
    );

  const badgeEl =
    document.getElementById(
      "weeklyBadge"
    );

  if (
    !countdownEl ||
    !statusEl ||
    !badgeEl
  ) {
    return;
  }

  const el =
    countdownEl as HTMLElement;

  const status =
    statusEl as HTMLElement;

  const badge =
    badgeEl as HTMLElement;

  /* ========================================
     FIXED WEEKLY CUTOFF
     Thursday 11:59 PM LOCAL
  ======================================== */

  function getNextThursdayCutoff() {

    const now =
      new Date();

    const target =
      new Date(now);

    const currentDay =
      now.getDay();

    let diff =
      4 - currentDay;

    if (diff < 0) {
      diff += 7;
    }

    target.setDate(
      now.getDate() + diff
    );

    target.setHours(
      23,
      59,
      59,
      999
    );

    /* ========================================
       IF THURSDAY PASSED
    ======================================== */

    if (
      diff === 0 &&
      target.getTime() <=
        now.getTime()
    ) {

      target.setDate(
        target.getDate() + 7
      );

    }

    return target;

  }

  /* ========================================
     FORMAT
  ======================================== */

  function format(
    value: number
  ) {

    return String(value)
      .padStart(2, "0");

  }

  /* ========================================
     TICK
  ======================================== */

  function tick() {

    const now =
      new Date();

    const target =
      getNextThursdayCutoff();

    const diff =
      Math.max(
        0,
        target.getTime() -
        now.getTime()
      );

    const totalHours =
      diff / 3600000;

    const d =
      Math.floor(
        diff / 86400000
      );

    const h =
      Math.floor(
        (
          diff % 86400000
        ) / 3600000
      );

    const m =
      Math.floor(
        (
          diff % 3600000
        ) / 60000
      );

    const s =
      Math.floor(
        (
          diff % 60000
        ) / 1000
      );

    /* ========================================
       COUNTDOWN
    ======================================== */

    el.textContent =

      `${format(d)}:` +

      `${format(h)}:` +

      `${format(m)}:` +

      `${format(s)}`;

    /* ========================================
       RESET
    ======================================== */

    badge.className = `
      inline-flex
      items-center
      gap-2
      rounded-full
      px-4 py-2
      text-xs
      font-medium
      transition-all
      duration-300
    `;

    /* ========================================
       CLOSED
    ======================================== */

    if (diff <= 0) {

      badge.textContent =
        "Pedido cerrado";

      status.textContent =
        "El periodo semanal terminó.";

      badge.classList.add(

        "bg-red-500/15",
        "text-red-300",
        "border",
        "border-red-500/20"

      );

      return;

    }

    /* ========================================
       LAST 30 MIN
    ======================================== */

    if (
      totalHours <= 0.5
    ) {

      badge.textContent =
        "Últimos minutos";

      status.textContent =
        "El pedido semanal está por finalizar.";

      badge.classList.add(

        "bg-orange-500/15",
        "text-orange-300",
        "border",
        "border-orange-500/20",
        "animate-pulse"

      );

      return;

    }

    /* ========================================
       LAST 3 HOURS
    ======================================== */

    if (
      totalHours <= 3
    ) {

      badge.textContent =
        "Cierra pronto";

      status.textContent =
        "Últimas horas para registrar pedidos.";

      badge.classList.add(

        "bg-yellow-500/15",
        "text-yellow-300",
        "border",
        "border-yellow-500/20"

      );

      return;

    }

    /* ========================================
       NORMAL
    ======================================== */

    badge.textContent =
      "Pedidos abiertos";

    status.textContent =
      "Recibiendo pedidos.";

    badge.classList.add(

      "bg-emerald-500/15",
      "text-emerald-300",
      "border",
      "border-emerald-500/20"

    );

  }

  tick();

  setInterval(
    tick,
    1000
  );

}