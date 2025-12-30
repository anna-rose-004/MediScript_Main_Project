import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js";

import conversationsRoutes from "./routes/conversations.js";
import diagnosisRoutes from "./routes/diagnosis.js";
import transcriptsRoutes from "./routes/transcripts.js";
import clinicalRoutes from "./routes/clinicalSummaries.js";
//import auditRouter from "./routes/audit.js";
//import { authMiddleware } from "./middleware/authMiddleware.js"; 
import prescriptionRoutes from "./routes/prescriptions.js";

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

//app.use(authMiddleware);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/conversations",conversationsRoutes);
app.use("/transcripts", transcriptsRoutes);
app.use("/clinical-summaries", clinicalRoutes);
app.use("/diagnosis", diagnosisRoutes);
app.use("/prescriptions", prescriptionRoutes);
//app.use("/audit-log", auditRouter);

export default app;
