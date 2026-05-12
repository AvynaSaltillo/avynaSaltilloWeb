export function getBusinessWeek(
  date = new Date()
) {

  const start =
    new Date(date);

  const day =
    start.getDay();

  /*
    0 domingo
    5 viernes
  */

  const diff =
  (day + 2) % 7;

  start.setDate(
    start.getDate() - diff
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  const end =
    new Date(start);

  end.setDate(
    end.getDate() + 6
  );

  end.setHours(
    23,
    59,
    59,
    999
  );

  return {
    start,
    end
  };

}

/* ========================================
  WEEK KEY
======================================== */

export function getBusinessWeekKey(
  date = new Date()
) {

  const {
    start
  } =
    getBusinessWeek(date);

  const y =
    start.getFullYear();

  const m =
    String(
      start.getMonth() + 1
    ).padStart(2, "0");

  const d =
    String(
      start.getDate()
    ).padStart(2, "0");

  return `${y}-${m}-${d}`;

}