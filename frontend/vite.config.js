import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  //base: '/cryptoPortfolio',
  server: {
    host: true, // Это равносильно 0.0.0.0 (слушать всех)
    port: 5173, // Жестко задаем порт
    strictPort: true, // Если порт занят, Vite упадет (лучше, чем сменит порт втихую)
    watch: {
      usePolling: true, // Для Windows/Mac иногда нужно, чтобы работало автообновление
    },
  },
});
