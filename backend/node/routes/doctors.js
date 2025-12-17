import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================================
   GET LOGGED-IN DOCTOR PROFILE
============================================================================ */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id; // DOC1001, NURSE32, etc.

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, role, specialization, license_number, user_id")
      .eq("user_id", userId)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Doctor not found" });

    return res.json({ doctor: data });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================================
   GET ALL DOCTORS (ADMIN ONLY)
============================================================================ */
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admin can view all doctors" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "doctor");

    if (error) return res.status(500).json({ error: error.message });

    res.json({ doctors: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
