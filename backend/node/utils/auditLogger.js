import { supabase } from "../services/supabaseClient.js";

export async function logAudit({ user, action, details, ip }) {
  const { error } = await supabase.from("audit_log").insert([
    {
      user_id: user?.user_id || null,
      user_role: user?.role || null,
      action,
      details,
      ip_address: ip,
    },
  ]);

  if (error) {
    console.error("AUDIT INSERT FAILED:", error);
  }
}

