import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);

export default app;
