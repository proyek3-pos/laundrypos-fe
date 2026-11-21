import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Field, inputClass } from "../components/Field.jsx";
import { Wave } from "../components/Wave.jsx";
import { useTitle } from "../hooks/useApi.js";

export default function Login() {
  useTitle("Masuk: BubbleWash");
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from || "/app"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Isi username dan password dulu.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post("/login", { username, password });
      await login(res.data.token, res.data.role, res.data.username);
      navigate(res.data.role === "admin" ? "/app/dashboard" : "/app/kasir", { replace: true });
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
            <img src={import.meta.env.BASE_URL + "icon.png"} alt="Ikon BubbleWash" className="mx-auto h-14 w-auto" width={56} height={56} />
            <h1 className="mt-3 text-xl font-extrabold">Masuk ke BubbleWash</h1>
            <p className="mt-1 pb-4 px-6 text-sm text-muted">Kelola pesanan dan kasir laundry dalam satu tempat.</p>
            <div className="text-surface">
              <Wave />
            </div>
          </div>
          <form className="p-6" onSubmit={submit} noValidate>
            <div role="alert" className="sr-only">{error}</div>
            {error && (
              <p className="mb-4 rounded-[10px] bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger" role="alert">
                {error}
              </p>
            )}
            <Field label="Username" htmlFor="username">
              <input
                id="username"
                type="text"
                autoComplete="username"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className={inputClass + " pr-11"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                  aria-pressed={show}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-input p-2 text-muted hover:text-ink"
                >
                  {show ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
            </Field>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 min-h-11 w-full rounded-[10px] bg-primary px-4 font-bold text-white hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-primary dark:text-sky-300 hover:text-primary-deep">
            Daftar
          </Link>{" "}
          atau{" "}
          <Link to="/" className="font-bold text-primary dark:text-sky-300 hover:text-primary-deep">
            kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}
