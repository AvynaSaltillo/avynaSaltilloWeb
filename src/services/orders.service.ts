// src/services/orders.service.ts

import { supabase } from "../lib/supabase";

import {
  getCurrentWeekKey
} from "../scripts/helpers";

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

  if (
    payment_type !== "credit"
  ) {
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

  const weekKey =
    getCurrentWeekKey();

/* ========================================
   BUSCAR PEDIDO SEMANAL
======================================== */

const {
  data: existingOrder
} = await supabase
  .from("orders")
  .select(`
    *,
    order_items (*)
  `)
  .eq(
    "client_id",
    user.id
  )
  .eq(
    "week_key",
    weekKey
  )
  .order(
    "created_at",
    {
      ascending: false
    }
  )
  .limit(1)
  .maybeSingle();

/* ========================================
   YA EXISTE PEDIDO
======================================== */

if (existingOrder) {

  const editableStatuses = [
    "waiting_supplier"
  ];

  const isEditable =
    editableStatuses.includes(
      existingOrder.delivery_status
    );

  /* ========================================
     BLOQUEADO
  ======================================== */

  if (!isEditable) {

    throw new Error(
      "Ya tienes un pedido registrado para esta semana."
    );

  }

}
  /* ========================================
     TOTALS
  ======================================== */

  const subtotal =
    calculateSubtotal(cart);

  const total =
    subtotal;

  const payment_type =
    resolvePaymentType(total);

  const due_date =
    resolveDueDate(
      total,
      payment_type
    );

  const amount_paid = 0;

  const amount_due = total;

  const payment_status =
    "pending";

  /* ========================================
     UPDATE EXISTING
  ======================================== */

  if (existingOrder) {

    const {
      data: updatedRows,
      error: updateError
    } = await supabase
      .from("orders")
      .update({

        subtotal,

        total,

        amount_due,

        payment_type,

        due_date,

        updated_at:
          new Date()
            .toISOString()

      })
      .eq(
        "id",
        existingOrder.id
      )
      .eq(
        "client_id",
        user.id
      )
      .select();

    if (updateError) {
      throw updateError;
    }

    if (
      !updatedRows?.length
    ) {

      throw new Error(
        "No se pudo actualizar el pedido."
      );

    }

    /* ========================================
       DELETE OLD ITEMS
    ======================================== */

    const {
      error: deleteError
    } = await supabase
      .from("order_items")
      .delete()
      .eq(
        "order_id",
        existingOrder.id
      );

    if (deleteError) {
      throw deleteError;
    }

    /* ========================================
       NEW ITEMS
    ======================================== */

    const items =
      cart.map((item) => ({

        order_id:
          existingOrder.id,

        product_id:
          item.id,

        product_name:
          item.name,

        family:
          item.family || "",

        quantity:
          Number(item.qty || 0),

        unit_price:
          Number(item.priceSalon || 0),

        public_price:
          Number(item.pricePublic || 0),

        subtotal:
          Number(item.priceSalon || 0) *
          Number(item.qty || 0)

      }));

    const {
      error: itemsError
    } = await supabase
      .from("order_items")
      .insert(items);

    if (itemsError) {
      throw itemsError;
    }

    const {
      data: freshOrder,
      error: freshError
    } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq(
        "id",
        existingOrder.id
      )
      .maybeSingle();

    if (freshError) {
      throw freshError;
    }

    return {

      order:
        freshOrder,

      subtotal,

      total

    };

  }

  /* ========================================
     CREATE NEW ORDER
  ======================================== */

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

      week_key:
        weekKey,

      subtotal,

      total,

      amount_paid,

      amount_due,

      payment_type,

      payment_status,

      due_date,

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

    throw error;

  }

  /* ========================================
     INSERT ITEMS
  ======================================== */

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
        Number(item.priceSalon || 0),

      public_price:
        Number(item.pricePublic || 0),

      subtotal:
        Number(item.priceSalon || 0) *
        Number(item.qty || 0)

    }));

  const {
    error: itemsError
  } = await supabase
    .from("order_items")
    .insert(items);

  if (itemsError) {

    await supabase
      .from("orders")
      .delete()
      .eq(
        "id",
        order.id
      );

    throw itemsError;

  }

  return {

    order,

    subtotal,

    total

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
      order_items (*),
      order_payments (*)
    `)
    .eq(
      "id",
      id
    )
    .single();

  if (error) {
    throw error;
  }

  return data;

}