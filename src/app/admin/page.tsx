"use client";

import { useState, useEffect } from "react";
import { supabase, Certificate, Project } from "@/lib/supabase";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const ALLOWED_EMAILS = ["tewari765@gmail.com", "mericans24@gmail.com"];

export default function AdminPage() {
  // Auth state
  const [authStep, setAuthStep] = useState<number>(-1); // -1 = Firebase Auth, 0 = Biometric Passkey, 1 = OTP, 2 = Authenticated
  const [jwtToken, setJwtToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  // App state
  const [activeTab, setActiveTab] = useState<"certificates" | "projects">("certificates");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Forms
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [certForm, setCertForm] = useState({
    title: "", issuer: "Anthropic", category: "anthropic",
    date_earned: "", credential_url: "", image_url: "", description: "",
  });

  const [projForm, setProjForm] = useState({
    name: "", description: "", github_url: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");
    if (token) {
      setJwtToken(token);
      setAuthStep(2);
    }
  }, []);

  const fetchDynamicData = async () => {
    setStatus("Loading data...");
    if (activeTab === "certificates") {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      if (error) {
        if (error.message.includes("Could not find the table")) {
          setStatus("ACTION REQUIRED: Database Tables Missing! Navigate to your Supabase Dashboard -> SQL Editor, paste the contents of 'setup_supabase.sql', and click the GREEN 'RUN' BUTTON in the bottom right corner.");
        } else {
          setStatus(`DB Error [Certs]: ${error.message}`);
        }
        return;
      }
      setCertificates(data || []);
      setStatus(""); // Clear on success
    } else {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) {
        if (error.message.includes("Could not find the table")) {
          setStatus("ACTION REQUIRED: Database Tables Missing! Navigate to your Supabase Dashboard -> SQL Editor, paste the contents of 'setup_supabase.sql', and click the GREEN 'RUN' BUTTON in the bottom right corner.");
        } else {
          setStatus(`DB Error [Projects]: ${error.message}`);
        }
        return;
      }
      setProjects(data || []);
      setStatus(""); // Clear on success
    }
  };

  useEffect(() => {
    if (authStep === 2) fetchDynamicData();
  }, [authStep, activeTab]);

  // --- Auth Handlers ---
  const handleFirebaseSignIn = async () => {
    try {
      setStatus("Signing in...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userEmail = result.user.email || "";
      if (!ALLOWED_EMAILS.includes(userEmail)) {
        await auth.signOut();
        setStatus("Access denied. This account is not authorized.");
        return;
      }

      setEmail(userEmail);
      setAuthStep(0);
      setStatus("Signed in. Please verify with biometrics.");
    } catch (err: any) {
      setStatus(`Sign-in failed: ${err.message}`);
    }
  };

  const handleBiometrics = async () => {
    try {
        setStatus("Waiting for biometric verification (fingerprint / Face ID / Windows Hello)...");
        const isRegistered = localStorage.getItem("admin_passkey_registered");

        if (!isRegistered) {
            // First time register to this device
            const options: PublicKeyCredentialCreationOptions = {
                challenge: window.crypto.getRandomValues(new Uint8Array(32)),
                rp: { name: "Portfolio Admin" },
                user: {
                    id: window.crypto.getRandomValues(new Uint8Array(16)),
                    name: "Admin",
                    displayName: "Admin"
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
                timeout: 60000,
            };
            await navigator.credentials.create({ publicKey: options });
            localStorage.setItem("admin_passkey_registered", "true");
        } else {
            // Verify existing
            const options: PublicKeyCredentialRequestOptions = {
                challenge: window.crypto.getRandomValues(new Uint8Array(32)),
                userVerification: "required",
                timeout: 60000,
            };
            await navigator.credentials.get({ publicKey: options });
        }
        
        setStatus("Biometrics verified. Sending verification code...");
        
        // Auto trigger the OTP email
        const res = await fetch("/api/admin/send-otp", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        
        if (res.ok) {
           setAuthStep(1);
           setTimeout(() => setStatus(""), 3000);
        } else {
           setStatus("Failed to send verification code.");
        }
    } catch (err: any) {
        setStatus("Biometric verification failed or was cancelled.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setStatus("Please enter the verification code.");
    setStatus("Verifying...");

    const res = await fetch("/api/admin/verify-otp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }) // PIN removed, now uses Passkeys
    });
    
    const data = await res.json();
    if (res.ok) {
      setJwtToken(data.token);
      localStorage.setItem("admin_jwt", data.token);
      setAuthStep(2);
      setStatus("Authenticated.");
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus(`Verification failed: ${data.error}`);
    }
  };

  const logout = async () => {
    await auth.signOut();
    localStorage.removeItem("admin_jwt");
    setAuthStep(-1);
    setJwtToken("");
    setEmail("");
    setOtp("");
  };

  // --- Entity Handlers ---
  const handleSaveCert = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from("certificates").update({ ...certForm, date_earned: certForm.date_earned || null, credential_url: certForm.credential_url || null, image_url: certForm.image_url || null, description: certForm.description || null, updated_at: new Date().toISOString() }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certificates").insert({ ...certForm, date_earned: certForm.date_earned || null, credential_url: certForm.credential_url || null, image_url: certForm.image_url || null, description: certForm.description || null });
        if (error) throw error;
      }
      setStatus("Certificate saved.");
      setEditingId(null);
      setCertForm({ title: "", issuer: "Anthropic", category: "anthropic", date_earned: "", credential_url: "", image_url: "", description: "" });
      fetchDynamicData();
    } catch (err: any) { setStatus(`Error: ${err.message}`); }
  };

  const handleSaveProj = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from("projects").update(projForm).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(projForm);
        if (error) throw error;
      }
      setStatus("Project saved.");
      setEditingId(null);
      setProjForm({ name: "", description: "", github_url: "" });
      fetchDynamicData();
    } catch (err: any) { setStatus(`Error: ${err.message}`); }
  };

  const handleDeleteEntity = async (id: string, table: "certificates" | "projects") => {
    if (!confirm("Are you sure? This delete is permanent.")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { setStatus(`Delete error: ${error.message}`); return; }
    setStatus("Deleted.");
    fetchDynamicData();
  };

  const startEditCert = (c: Certificate) => { setEditingId(c.id); setCertForm({ title: c.title, issuer: c.issuer, category: c.category, date_earned: c.date_earned || "", credential_url: c.credential_url || "", image_url: c.image_url || "", description: c.description || "" }); };
  const startEditProj = (p: Project) => { setEditingId(p.id); setProjForm({ name: p.name, description: p.description, github_url: p.github_url }); };

  // --- Auth Render Mode ---
  if (authStep < 2) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne), sans-serif", color: "white" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 16, padding: 48, display: "flex", flexDirection: "column", gap: 24, width: 420, boxShadow: "0 20px 80px rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" }}>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, fontWeight: 700, color: "#C9A96E", textAlign: "center", letterSpacing: "-1px" }}>Admin <span style={{ fontStyle: "italic", color: "white" }}>Panel.</span></h1>
          
          {status && <p style={{ color: "#ef4444", textAlign: "center", fontSize: 13, fontFamily: "monospace", letterSpacing: "1px" }}>{status}</p>}

          {authStep === -1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", marginBottom: 8 }}>Step 1: Sign in with Google</p>
              <button onClick={handleFirebaseSignIn} style={{ ...btnPrimary, background: "white", color: "black", display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          {authStep === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", marginBottom: 8 }}>Step 2: Biometric Verification</p>
              <div style={{...ghostInputStyle, opacity: 0.5, textAlign: "center"}}>{email}</div>
              <button onClick={handleBiometrics} style={btnPrimary}>
                VERIFY WITH FINGERPRINT / FACE ID
              </button>
            </div>
          )}

          {authStep === 1 && (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", marginBottom: 8 }}>Step 3: Email Verification Code</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-Digit Code" required autoFocus style={{ ...ghostInputStyle, textAlign: "center", fontSize: 24, letterSpacing: "8px" }} />
              <button type="submit" style={btnPrimary}>VERIFY CODE</button>
            </form>
          )}

          <a href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 16, fontFamily: "monospace", textDecoration: "none" }}>← Back to site</a>
        </div>
      </div>
    );
  }

  // --- Dashboard Render Mode ---
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "white", padding: 32, fontFamily: "var(--font-syne), sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, fontWeight: 700, letterSpacing: "-1px" }}>
            <span style={{ color: "#C9A96E" }}>Admin</span> Dashboard.
          </h1>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px" }}>AUTHENTICATED</span>
            <button onClick={logout} style={{ ...btnPrimary, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>LOG OUT</button>
          </div>
        </div>

        {status && (
          <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 32, background: status.toLowerCase().includes("error") ? "rgba(239,68,68,0.1)" : "rgba(201,169,110,0.1)", border: `1px solid ${status.toLowerCase().includes("error") ? "rgba(239,68,68,0.2)" : "rgba(201,169,110,0.2)"}`, color: status.toLowerCase().includes("error") ? "#ef4444" : "#C9A96E", fontSize: 13, fontFamily: "monospace" }}>{status}</div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <button onClick={() => setActiveTab("certificates")} style={{ ...tabBtn, background: activeTab === "certificates" ? "rgba(201,169,110,0.15)" : "transparent", color: activeTab === "certificates" ? "#C9A96E" : "rgba(255,255,255,0.4)", borderColor: activeTab === "certificates" ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.1)" }}>CERTIFICATES</button>
          <button onClick={() => setActiveTab("projects")} style={{ ...tabBtn, background: activeTab === "projects" ? "rgba(201,169,110,0.15)" : "transparent", color: activeTab === "projects" ? "#C9A96E" : "rgba(255,255,255,0.4)", borderColor: activeTab === "projects" ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.1)" }}>PROJECTS</button>
        </div>

        {/* Tab Content: Certificates */}
        {activeTab === "certificates" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 12, padding: 32, marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#C9A96E", marginBottom: 24 }}>{editingId ? "Modify Certificate" : "New Certificate"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <input placeholder="Title *" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} style={ghostInputStyle} />
                <input placeholder="Issuer (e.g. Google) *" value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} style={ghostInputStyle} />
                <input placeholder="Category ID (e.g. google)" value={certForm.category} onChange={e => setCertForm({...certForm, category: e.target.value})} style={ghostInputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <input placeholder="Date (YYYY-MM)" value={certForm.date_earned} onChange={e => setCertForm({...certForm, date_earned: e.target.value})} style={ghostInputStyle} />
                <input placeholder="Credential URL (or /vault/file.pdf)" value={certForm.credential_url} onChange={e => setCertForm({...certForm, credential_url: e.target.value})} style={ghostInputStyle} />
                <input placeholder="Image URL (optional)" value={certForm.image_url} onChange={e => setCertForm({...certForm, image_url: e.target.value})} style={ghostInputStyle} />
              </div>
              <textarea placeholder="Description" rows={2} value={certForm.description} onChange={e => setCertForm({...certForm, description: e.target.value})} style={{ ...ghostInputStyle, width: "100%", resize: "none", marginBottom: 24 }} />
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleSaveCert} style={btnPrimary}>{editingId ? "UPDATE" : "ADD CERTIFICATE"}</button>
                {editingId && <button onClick={() => { setEditingId(null); setCertForm({title:"", issuer:"Anthropic", category:"anthropic", date_earned:"", credential_url:"", image_url:"", description:""}); }} style={btnSecondary}>CANCEL</button>}
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12, textAlign: "left" }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}><th style={thStyle}>Title</th><th style={thStyle}>Issuer</th><th style={thStyle}>Link</th><th style={thStyle}>Actions</th></tr></thead>
              <tbody>
                {certificates.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={tdStyle}>{c.title}</td><td style={{ ...tdStyle, color: "#C9A96E" }}>{c.issuer}</td><td style={tdStyle}>{c.credential_url || "-"}</td>
                    <td style={tdStyle}>
                      <button onClick={() => startEditCert(c)} style={actionTextBtn}>EDIT</button> | <button onClick={() => handleDeleteEntity(c.id, "certificates")} style={{ ...actionTextBtn, color: "#ef4444" }}>DEL</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Projects */}
        {activeTab === "projects" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 12, padding: 32, marginBottom: 40 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#C9A96E", marginBottom: 24 }}>{editingId ? "Edit Project" : "Add Project"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <input placeholder="Project Name *" value={projForm.name} onChange={e => setProjForm({...projForm, name: e.target.value})} style={ghostInputStyle} />
                <input placeholder="GitHub URL *" value={projForm.github_url} onChange={e => setProjForm({...projForm, github_url: e.target.value})} style={ghostInputStyle} />
              </div>
              <textarea placeholder="Description" rows={3} value={projForm.description} onChange={e => setProjForm({...projForm, description: e.target.value})} style={{ ...ghostInputStyle, width: "100%", resize: "none", marginBottom: 24 }} />
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleSaveProj} style={btnPrimary}>{editingId ? "UPDATE" : "ADD PROJECT"}</button>
                {editingId && <button onClick={() => { setEditingId(null); setProjForm({name:"", description:"", github_url:""}); }} style={btnSecondary}>CANCEL</button>}
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12, textAlign: "left" }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}><th style={thStyle}>Project Name</th><th style={thStyle}>GitHub</th><th style={thStyle}>Description Length</th><th style={thStyle}>Actions</th></tr></thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ ...tdStyle, color: "#C9A96E" }}>{p.name}</td><td style={tdStyle}>{p.github_url}</td><td style={tdStyle}>{p.description.length} chars</td>
                    <td style={tdStyle}>
                      <button onClick={() => startEditProj(p)} style={actionTextBtn}>EDIT</button> | <button onClick={() => handleDeleteEntity(p.id, "projects")} style={{ ...actionTextBtn, color: "#ef4444" }}>DEL</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

// Styles
const ghostInputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "14px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "var(--font-syne), sans-serif" };
const btnPrimary: React.CSSProperties = { background: "#C9A96E", color: "#000", padding: "14px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "monospace", letterSpacing: "1px" };
const btnSecondary: React.CSSProperties = { background: "transparent", color: "rgba(255,255,255,0.6)", padding: "14px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px" };
const tabBtn: React.CSSProperties = { padding: "12px 24px", borderRadius: 30, border: "1px solid", fontFamily: "monospace", fontSize: 10, letterSpacing: "2px", cursor: "pointer", transition: "all 0.3s ease" };
const thStyle = { padding: "16px 20px", textTransform: "uppercase" as const, letterSpacing: "1px" };
const tdStyle = { padding: "16px 20px" };
const actionTextBtn = { background: "transparent", border: "none", color: "#C9A96E", cursor: "pointer", fontFamily: "monospace", fontSize: 11, letterSpacing: "1px" };
