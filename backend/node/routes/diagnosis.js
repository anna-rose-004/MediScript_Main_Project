import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { encryptDiagnosis, decryptDiagnosis } from "../utils/aes.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Doctor") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { summary_id, diagnosis } = req.body;

    if (!summary_id || !diagnosis) {
      return res.status(400).json({ error: "summary_id and diagnosis required" });
    }

    const encryptedDiagnosis = encryptDiagnosis(diagnosis);

    const { error } = await supabase.from("diagnosis").insert([
      {
        summary_id,
        disease_name_encrypted: encryptedDiagnosis,
        encryption_key_ref: "v1_master_key",
      },
    ]);

    if (error) {
      console.error("Diagnosis insert error:", error);
      return res.status(500).json({ error: "Failed to save diagnosis" });
    }

    return res.status(201).json({
      message: "Diagnosis stored securely",
    });
  } catch (err) {
    console.error("SAVE DIAGNOSIS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ============================================================================
   GET DIAGNOSIS (DECRYPTED)
============================================================================ */
router.get("/:summary_id", authMiddleware, async (req, res) => {
  try {
    const { summary_id } = req.params;

    const { data, error } = await supabase
      .from("diagnosis")
      .select("disease_name_encrypted")
      .eq("summary_id", summary_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Diagnosis not found" });
    }

    const decryptedDiagnosis = decryptDiagnosis(
      data.disease_name_encrypted
    );

    return res.json({ diagnosis: decryptedDiagnosis });
  } catch (err) {
    console.error("FETCH DIAGNOSIS ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
