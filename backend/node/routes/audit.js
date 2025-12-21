import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /audit-log
 * Body: { action: string, details: JSON }
 */
router.post("/", authMiddleware, async (req, res) => {
  const { action, details } = req.body;
  const user = req.user; // authMiddleware must set this
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    null;

  if (!action) return res.status(400).json({ error: "Action is required" });

  try {
    await supabase.from("audit_log").insert([
      {
        user_id: user?.user_id || null,
        user_role: user?.role || null,
        action,
        details: details || null,
        ip_address: ip,
      },
    ]);

    return res.json({ message: "Activity logged" });
  } catch (err) {
    console.error("Audit log error:", err.message || err);
    return res.status(500).json({ error: "Failed to log activity" });
  }
});

export default router;
