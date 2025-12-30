//DIAGNOSIS AND MEDICINES ROUTES
import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { encryptDiagnosis, decryptDiagnosis } from "../utils/aes.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "doctor") {
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


//search medicines
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }

    // 1️⃣ Check availability anywhere
    const { data: available, error: availError } = await supabase
      .rpc("check_medicine_availability", { search_name: query });

    if (availError) throw availError;

    if (available.length > 0) {
      return res.json({
        available: true,
        medicines: available
      });
    }

    // 2️⃣ Find alternatives using composition
    const { data: alternatives, error: altError } = await supabase
      .from("medicine")
      .select("medicine_id, name, composition_1, composition_2")
      .or(
        `composition_1.ilike.%${query}%,composition_2.ilike.%${query}%`
      )
      .limit(5);

    if (altError) throw altError;

    return res.json({
      available: false,
      alternatives
    });

  } catch (err) {
    console.error("MEDICINE SEARCH ERROR:", err);
    res.status(500).json({ error: "Server error" });
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
