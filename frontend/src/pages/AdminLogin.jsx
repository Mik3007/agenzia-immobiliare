import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { setToken } from "../utils/auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

async function submit(e) {
  e.preventDefault();
  setErr("");

  try {
    const res = await api.post("/api/auth/login", { email, password });
    setToken(res.data.token);
    nav("/admin/dashboard");
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    const msg =
      err?.response?.data?.message || // se il backend risponde con message
      err?.message ||                 // errore generico (Network Error ecc.)
      "Login fallito (controlla credenziali).";

    setErr(msg);
  }
}


  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-gray-600">
        Credenziali in backend/.env (ADMIN_EMAIL e ADMIN_PASSWORD)
      </p>

      {err && <div className="mt-4 rounded-xl border bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border bg-white p-5">
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">
          Entra
        </button>
      </form>
    </main>
  );
}