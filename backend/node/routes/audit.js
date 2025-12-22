import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /audit
 * Admin-only audit log viewer
 */
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Failed to fetch audit logs" });
  }

  return res.json(data);
});

export default router;
