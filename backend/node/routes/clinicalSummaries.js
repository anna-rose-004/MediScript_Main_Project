import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================================
   SAVE CLINICAL SUMMARY
============================================================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { convo_id, subjective, objective, assessment, plan } = req.body;

    if (!convo_id) {
      return res.status(400).json({ error: "convo_id required" });
    }

    const { data, error } = await supabase
      .from("clinical_summaries")
      .insert([
        {
          convo_id,
          subjective,
          objective,
          assessment,
          plan,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Clinical summary error:", error);
      return res.status(500).json({ error: "Failed to save summary" });
    }

    return res.status(201).json({
      summary_id: data.summary_id,
    });
  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
