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

  advisorName: string;
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

/* ========================================
   PAYMENT TERMS
======================================== */

function resolveOrderTerms(
  profile: any,
  total: number
) {

  const creditProfile =
    profile?.credit_profile ||
    "cash_only";

  /* ========================================
     CONTADO FORZOSO
  ======================================== */

  if (
    creditProfile ===
    "cash_only"
  ) {

    return {

      payment_type:
        "cash",

      due_date:
        null

    };

  }

  /* ========================================
     CREDITO ABIERTO
  ======================================== */

  if (
    creditProfile ===
    "open_credit"
  ) {

    return {

      payment_type:
        "open_credit",

      due_date:
        null

    };

  }

  /* ========================================
     CREDITO AUTOMATICO
  ======================================== */

  if (total < 1500) {

    return {

      payment_type:
        "cash",

      due_date:
        null

    };

  }

  const days =
    total >= 10000
      ? 30
      : 15;

  return {

    payment_type:
      days === 30
        ? "credit_30"
        : "credit_15",

    due_date:
      new Date(
        Date.now() +
        days * 86400000
      ).toISOString()

  };

}

/* ========================================
   CREATE ORDER
======================================== */

export async function createOrder({
  user,
  profile,
  cart,
  advisorName
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

const activeStatuses = [

  "waiting_supplier",

  "ordered_supplier",

  "ready_delivery",

  "on_route"

];

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
  .in(
    "delivery_status",
    activeStatuses
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

const {
  payment_type,
  due_date
} = resolveOrderTerms(
  profile,
  total
);

/* ========================================
   PAYMENT STATE
======================================== */

const previousPaid =

  existingOrder

    ? Number(
        existingOrder.amount_paid || 0
      )

    : 0;

/* ========================================
   OPEN CREDIT
======================================== */

const recalculatedDue =

  Math.max(
    0,
    total - previousPaid
  );
/* ========================================
   PAYMENT STATUS
======================================== */

let payment_status =
  "pending";

if (
  recalculatedDue <= 0
) {

  payment_status =
    "paid";

}

else if (
  previousPaid > 0
) {

  payment_status =
    "partial";

}

const amount_paid =
  previousPaid;

const amount_due =
  recalculatedDue;
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

        amount_paid,

payment_status,

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
        
advisor_name:
  advisorName,
        

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