import { adminDb } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await adminDb.collection("projects").doc(id).delete();
      return res.status(200).json({ success: true, message: `Project ${id} deleted.` });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}