import express from "express";
import { supabase } from "../services/supabaseClient.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleCheck.js";
import bcrypt from "bcrypt";

const router = express.Router();
console.log(" doctors.js route file LOADED");


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

router.post("/add", authMiddleware, isAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      license_number,
    } = req.body;

    // 1️⃣ Validation
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !specialization ||
      !license_number
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2️⃣ Check email existence (NO .single())
    const { data: existing, error: emailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (emailError) {
      console.error("Email check error:", emailError);
      return res.status(500).json({ error: "Email check failed" });
    }

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const { data: lastDoctor, error: idError } = await supabase
      .from("users")
      .select("user_id")
      .eq("role", "doctor")
      .order("user_id", { ascending: false })
      .limit(1);

    if (idError) {
      console.error("User ID fetch error:", idError);
      return res.status(500).json({ error: "Failed to generate doctor ID" });
    }

    let nextNumber = 1;

    if (lastDoctor.length > 0 && lastDoctor[0].user_id) {
      const lastId = lastDoctor[0].user_id; // e.g. D0006
      const numericPart = parseInt(lastId.substring(1)); // 6
      nextNumber = numericPart + 1;
    }

    const user_id = `D${String(nextNumber).padStart(4, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          phone,
          password: hashedPassword,
          role: "doctor",
          specialization,
          license_number,
          user_id,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(201).json({
      message: "Doctor added successfully",
      doctor: data[0],
    });
  } catch (err) {
    console.error("ADD DOCTOR ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /doctors/:user_id
router.delete("/:user_id", authMiddleware, isAdmin, async (req, res) => {
  const doctorId = req.params.user_id;

  console.log("DELETE route hit, user_id:", req.params.user_id);

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  try {
    // 1️⃣ Check if doctor exists
    const { data: doctor, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", doctorId)
      .eq("role", "doctor")
      .single();

    if (fetchError) {
      console.error("Fetch doctor error:", fetchError);
      return res.status(500).json({ error: "Failed to fetch doctor" });
    }

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // 2️⃣ Delete doctor
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("user_id", doctorId)
      .eq("role", "doctor");

    if (deleteError) {
      console.error("Delete doctor error:", deleteError);
      return res.status(500).json({ error: "Failed to delete doctor" });
    }

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("DELETE DOCTOR ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});



export default router;
