import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================================
   GET ALL PATIENTS  (Protected)
============================================================================ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("patient_id", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ patients: data });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================================
   GET ONE PATIENT BY ID
============================================================================ */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Patient not found" });

    return res.json({ patient: data });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================================
   CREATE / UPDATE PATIENT  (UPSERT)
============================================================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const patient = req.body;

    // Attach logged-in user's ID
    patient.created_by = req.user.user_id;

    const { data, error } = await supabase
      .from("patients")
      .upsert(patient, { onConflict: "patient_id" })
      .select();

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      message: "Patient added/updated successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
