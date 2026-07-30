import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub repo name for project Pages:
// https://<username>.github.io/dxm-planner/
export default defineConfig({
  plugins: [react()],
  base: "/dxm-planner/",
});
