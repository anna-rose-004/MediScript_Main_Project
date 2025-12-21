import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
console.log(" conversations.js route file LOADED");

/* ============================================================================
   CREATE CONVERSATION
============================================================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patient_id } = req.body;
    const doctor_id = req.user.user_id;

    if (!patient_id) {
      return res.status(400).json({ error: "patient_id required" });
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert([
        {
          doctor_id,
          patient_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Conversation insert error:", error);
      return res.status(500).json({ error: "Failed to create conversation" });
    }

    return res.status(201).json({
      convo_id: data.convo_id,
      convo_number: data.convo_number,
    });

  } catch (err) {
    console.error("CREATE CONVERSATION ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
