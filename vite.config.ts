import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// 為了相容性，定義 __dirname (因為 ESM 模式下沒有預設 __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 1. 設定 Base Path (重要！如果你要部署到 GitHub Pages)
  // 如果你的儲存庫名字是 "my-app"，這裡就填 "/my-app/"
  // 如果你是用自訂網域(例如 www.example.com)，這裡就保持 "/"
  base: "/frc-scout-7589-net/", 

  plugins: [
    react(),
    tailwindcss(),
    // 移除了 runtimeErrorOverlay, metaImages, cartographer 等 Replit 專用插件
  ],
  resolve: {
    alias: {
      // 確保這裡的路徑與你實際的資料夾結構相符
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // 2. 注意：這裡設定了根目錄在 client 資料夾
  // 這代表你的 index.html 必須在 client 資料夾裡面！
  root: path.resolve(__dirname, "client"),
  
  build: {
    // 設定打包輸出的位置
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
