import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// In-memory OTP store: { email -> { code, expiresAt } }
const otpStore = new Map();

// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), { code, expiresAt });

    // Send email via Nodemailer (Gmail SMTP)
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Olinethra CMS" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Your Olinethra Admin OTP Code",
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f172a;color:#fff;border-radius:16px;">
                    <img src="https://olinethra.com/favicon.svg" width="40" style="margin-bottom:16px;" />
                    <h2 style="margin:0 0 8px;font-size:22px;">Admin Login OTP</h2>
                    <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Use the code below to complete your sign-in to Olinethra CMS.</p>
                    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                        <span style="font-size:36px;font-weight:900;letter-spacing:0.3em;color:#fff;">${code}</span>
                    </div>
                    <p style="color:#64748b;font-size:12px;margin:0;">This code expires in <strong style="color:#94a3b8;">10 minutes</strong>. Do not share it with anyone.</p>
                </div>
            `,
        });

        res.json({ success: true, message: "OTP sent to email." });
    } catch (err) {
        console.error("Email send error:", err);
        res.status(500).json({ error: "Failed to send OTP email. Check SMTP config." });
    }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required." });

    const entry = otpStore.get(email.toLowerCase());

    if (!entry) return res.status(400).json({ error: "No OTP found for this email." });
    if (Date.now() > entry.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ error: "OTP has expired. Please login again." });
    }
    if (entry.code !== code) return res.status(400).json({ error: "Invalid OTP code." });

    // OTP valid — clear it
    otpStore.delete(email.toLowerCase());
    res.json({ success: true, message: "OTP verified." });
});

export default router;
