import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../services/supabaseClient.js";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ error: "User ID and password required" });
  }

  // 1️⃣ Fetch user by custom user_id
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Invalid User ID or password" });
  }

  // 2️⃣ Compare password with bcrypt hash
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid User ID or password" });
  }

  // 3️⃣ Create JWT token
  const token = jwt.sign(
    { 
      user_id: user.user_id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    message: "Login successful",
    token,
    role: user.role,
    user_id: user.user_id
  });
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (!users || users.length === 0)
    return res.status(404).json({ message: "Email not registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Math.floor(Date.now() / 1000) + 300; // 5 minutes

  await supabase.from("password_resets").upsert([
    { email, otp, expiry }
  ]);

  return res.json({ message: "OTP sent to email", otp }); 
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const { data, error } = await supabase
    .from("password_resets")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return res.status(404).json({ message: "OTP not found" });

  if (data.otp !== otp || Date.now() / 1000 > data.expiry)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  return res.json({ message: "OTP verified" });
});


router.post("/reset-password", async (req, res) => {
  const { email, new_password } = req.body;

  const hashed = await bcrypt.hash(new_password, 10);

  const { data: userRow } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!userRow)
    return res.status(404).json({ message: "Email not registered" });

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    userRow.auth_user_id || userRow.user_id, 
    { password: new_password }
  );

  if (updateError) return res.status(500).json({ error: updateError.message });

  await supabase
    .from("users")
    .update({ password: hashed })
    .eq("email", email);

  // Delete OTP record
  await supabase.from("password_resets").delete().eq("email", email);

  return res.json({ message: "Password updated successfully" });
});

export default router;
