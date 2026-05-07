// src/services/orders.service.ts

import { supabase } from "../lib/supabase";

/* ========================================
   TYPES
======================================== */

type CartItem = {
  id: string | number;

  name: string;

  family?: string;

  priceSalon: number;

  pricePublic: number;

  qty: number;
};

type CreateOrderParams = {
  user: any;

  profile: any;

  cart: CartItem[];
};

/* ========================================
   HELPERS
======================================== */

function calculateSubtotal(
  cart: CartItem[]
) {

  return cart.reduce(
    (acc, item) => {

      return (
        acc +
        (
          Number(item.priceSalon || 0) *
          Number(item.qty || 0)
        )
      );

    },
    0
  );

}

function resolvePaymentType(
  total: number
) {

  return total >= 1500
    ? "credit"
    : "cash";

}

function resolveCreditDays(
  total: number
) {

  return total >= 10000
    ? 30
    : 15;

}

function resolveDueDate(
  total: number,
  payment_type: string
) {

  if (payment_type !== "credit") {
    return null;
  }

  const days =
    resolveCreditDays(total);

  return new Date(
    Date.now() +
    days * 86400000
  ).toISOString();

}

/* ========================================
   CREATE ORDER
======================================== */

export async function createOrder({
  user,
  profile,
  cart
}: CreateOrderParams) {

  /* =========================
     VALIDATIONS
  ========================= */

  if (!user?.id) {
    throw new Error(
      "Usuario inválido"
    );
  }

  if (!cart?.length) {
    throw new Error(
      "El carrito está vacío"
    );
  }

  /* =========================
     TOTALS
  ========================= */

  const subtotal =
    calculateSubtotal(cart);

  const total =
    subtotal;

  /* =========================
     PAYMENT RULES
  ========================= */

  const payment_type =
    resolvePaymentType(total);

  const due_date =
    resolveDueDate(
      total,
      payment_type
    );

  /* =========================
     PAYMENT STATUS
  ========================= */
const amount_paid = 0;

const amount_due = total;

const payment_status = "pending";

  /* =========================
     CREATE ORDER
  ========================= */

  const {
    data: order,
    error
  } = await supabase
    .from("orders")
    .insert({

      client_id:
        user.id,

      advisor_id:
        profile.advisor_id || null,

      client_name:
        profile.name ||

        `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),

      business_name:
        profile.business_name || "",

      subtotal,
      total,

      amount_paid,
      amount_due,

      payment_type,
      payment_status,

      due_date,

      status:
        "pending",

      delivery_status:
  "waiting_supplier",

      delivery_week:
        null,

      notes:
        null,

      address_line:
        profile.address_line || "",

      colony:
        profile.colony || "",

      postal_code:
        profile.postal_code || "",

      city:
        profile.city || "",

      state:
        profile.state || "",

      whatsapp_sent:
        false

    })
    .select()
    .single();

  if (
    error ||
    !order
  ) {

    console.error(
      "ORDER ERROR",
      error
    );

    throw error;

  }

  /* =========================
     ORDER ITEMS
  ========================= */

  const items =
    cart.map((item) => ({

      order_id:
        order.id,

      product_id:
        item.id,

      product_name:
        item.name,

      family:
        item.family || "",

      quantity:
        Number(item.qty || 0),

      unit_price:
        Number(
          item.priceSalon || 0
        ),

      subtotal:
        (
          Number(item.priceSalon || 0) *
          Number(item.qty || 0)
        )

    }));

  const {
    error: itemsError
  } = await supabase
    .from("order_items")
    .insert(items);

  if (itemsError) {

    console.error(
      "ITEMS ERROR",
      itemsError
    );

    /* =========================
       ROLLBACK
    ========================= */

    await supabase
      .from("orders")
      .delete()
      .eq(
        "id",
        order.id
      );

    throw itemsError;

  }

  /* =========================
     RETURN
  ========================= */

  return {

    order,

    subtotal,
    total,

    payment_type,

    amount_paid,
    amount_due,

    due_date

  };

}

/* ========================================
   GET ORDER BY ID
======================================== */

export async function getOrderById(
  id: string
) {

  const {
    data,
    error
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *
      ),
      order_payments (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;

}