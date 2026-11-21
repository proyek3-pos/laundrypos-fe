import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages memakai base /laundrypos-fe/; deploy Vercel override ke "/" via env VITE_BASE.
export default defineConfig({
  base: process.env.VITE_BASE || "/laundrypos-fe/",
  plugins: [react(), tailwindcss()],
});
