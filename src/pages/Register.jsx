import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Field, inputClass } from "../components/Field.jsx";
import { Wave } from "../components/Wave.jsx";
import { useToast } from "../components/Toast.jsx";
import { useTitle } from "../hooks/useApi.js";

export default function Register() {
  useTitle("Daftar: LaundryPOS");
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Isi username dan password dulu.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/register", { username, password });
      toast("Registrasi berhasil, silakan masuk.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-lg">
          <div className="bg-primary-soft pt-6 text-center">
            <img src={import.meta.env.BASE_URL + "logo.png"} alt="Logo LaundryPOS" className="mx-auto h-14 w-14" width={56} height={56} />
            <h1 className="mt-3 text-xl font-extrabold">Buat akun staf</h1>
            <p className="mt-1 px-6 pb-4 text-sm text-muted">Akun baru otomatis berperan sebagai staf kasir.</p>
            <div className="text-surface">
              <Wave />
            </div>
          </div>
          <form className="p-6" onSubmit={submit} noValidate>
            {error && (
              <p className="mb-4 rounded-[10px] bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger" role="alert">
                {error}
              </p>
            )}
            <Field label="Username" htmlFor="username" hint="3-32 karakter: huruf, angka, underscore">
              <input
                id="username"
                type="text"
                autoComplete="username"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="password" hint="Minimal 8 karakter">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 min-h-11 w-full rounded-[10px] bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-primary hover:text-primary-deep">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
