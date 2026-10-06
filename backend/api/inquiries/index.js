import { adminDb } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    try {
      const snapshot = await adminDb.collection("inquiries").orderBy("created_at", "desc").get();
      const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, data: inquiries });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = req.body;
      const docRef = await adminDb.collection("inquiries").add({
        ...payload,
        created_at: new Date().toISOString()
      });
      return res.status(201).json({ success: true, id: docRef.id });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}