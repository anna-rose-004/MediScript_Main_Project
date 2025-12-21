import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================================
   SAVE TRANSCRIPT
============================================================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { convo_id, text, confidence } = req.body;
    if (!convo_id || !text) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Insert transcript
    const { data, error } = await supabase.from("transcripts").insert([
      {
        convo_id,
        text: text,
        confidence,
      },
    ]).select().single();

    if (error) {
      console.error("Transcript insert error:", error);
      return res.status(500).json({ error: "Failed to save transcript" });
    }

    // Update conversation
    const { error: updateError } = await supabase
      .from("conversations")
      .update({ transcript_id: data.id })
      .eq("convo_id", convo_id);

    if (updateError) {
      console.error("Failed to update conversation with transcript_id:", updateError);
      return res.status(500).json({ error: "Failed to link transcript" });
    }

    return res.status(201).json({ message: "Transcript saved", transcript_id: data.id, convo_id });

  } catch (err) {
    console.error("TRANSCRIPT ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
