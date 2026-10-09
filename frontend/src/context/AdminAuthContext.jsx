import { createContext, useContext, useState } from "react";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
    const [adminUser, setAdminUser] = useState(() => {
        const saved = localStorage.getItem("olinethra_admin_session");
        return saved ? JSON.parse(saved) : null;
    });

    const loginWithEmail = async (email, password) => {
        // Step 1: Firebase Auth verifies password securely
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch {
            throw new Error("Invalid email or password.");
        }

        const user = userCredential.user;

        // Step 2: Firestore check — must have role "superadmin"
        const docRef = doc(db, "admins", user.email.toLowerCase().trim());
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists() || docSnap.data().role !== "superadmin") {
            await firebaseSignOut(auth);
            throw new Error("Access Denied: Your account is not authorized as a superadmin.");
        }

        // Step 3: Grant session
        const session = {
            email: user.email,
            role: docSnap.data().role,
            loginTime: new Date().toISOString()
        };
        setAdminUser(session);
        localStorage.setItem("olinethra_admin_session", JSON.stringify(session));
    };

    const logout = async () => {
        try { await firebaseSignOut(auth); } catch { /* ignore */ }
        setAdminUser(null);
        localStorage.removeItem("olinethra_admin_session");
    };

    return (
        <AdminAuthContext.Provider value={{ adminUser, loginWithEmail, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
