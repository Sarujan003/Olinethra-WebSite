import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./api/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => res.json({ status: "Olinethra Backend Running" }));

app.listen(PORT, () => {
    console.log(`✅ Olinethra backend running on port ${PORT}`);
});
