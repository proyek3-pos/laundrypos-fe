import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { RequireAuth } from "./context/AuthContext.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Kasir from "./pages/Kasir.jsx";
import Receipt from "./pages/Receipt.jsx";
import Customers from "./pages/Customers.jsx";
import Services from "./pages/Services.jsx";
import Payments from "./pages/Payments.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/app/pesanan" replace />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth role="admin">
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="pesanan" element={<Orders />} />
        <Route path="pesanan/:id" element={<OrderDetail />} />
        <Route path="kasir" element={<Kasir />} />
        <Route path="pelanggan" element={<Customers />} />
        <Route
          path="layanan"
          element={
            <RequireAuth role="admin">
              <Services />
            </RequireAuth>
          }
        />
        <Route path="pembayaran" element={<Payments />} />
      </Route>
      <Route
        path="/app/pesanan/:id/nota"
        element={
          <RequireAuth>
            <Receipt />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
