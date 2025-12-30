import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================================
   SAVE PRESCRIPTION + MEDICINES
============================================================================ */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "doctor") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { doctor_id, patient_id, medicines } = req.body;

    if (!doctor_id || !patient_id || !medicines?.length) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 1️⃣ Create prescription
    const { data: prescription, error: presError } = await supabase
      .from("prescriptions")
      .insert([
        {
          doctor_id,
          patient_id,
          status: "final"
        }
      ])
      .select()
      .single();

    if (presError) {
      console.error(presError);
      return res.status(500).json({ error: "Failed to create prescription" });
    }

    // 2️⃣ Insert medicines
    const rows = medicines.map(m => ({
      prescription_id: prescription.prescription_id,
      medicine_id: m.medicine_id,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      availability_status: m.availability_status
    }));

    const { error: medError } = await supabase
      .from("prescription_medicine")
      .insert(rows);

    if (medError) {
      console.error(medError);
      return res.status(500).json({ error: "Failed to save medicines" });
    }

    return res.status(201).json({
      prescription_id: prescription.prescription_id
    });

  } catch (err) {
    console.error("PRESCRIPTION ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
