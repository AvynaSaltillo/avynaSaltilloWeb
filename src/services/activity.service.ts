import { supabase }
from "../lib/supabase";

type CreateActivityParams = {

  client_id: string;

  order_id?: string;

  type: string;

  title: string;

  amount?: number;

  metadata?: any;

};

export async function createActivityLog({

  client_id,

  order_id,

  type,

  title,

  amount = 0,

  metadata = {}

}: CreateActivityParams) {

  const result =
    await supabase

      .from("activity_logs")

      .insert({

        client_id,

        order_id,

        type,

        title,

        amount,

        metadata

      });

  if (result.error) {

    console.error(
      "Activity log error:",
      result.error
    );

  }

  return result;

}