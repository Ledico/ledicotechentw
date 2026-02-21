// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { cpSync, readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
function copyPublicFilesPlugin() {
  return {
    name: "copy-public-safe",
    closeBundle() {
      const publicDir = resolve(__vite_injected_original_dirname, "public");
      const outDir = resolve(__vite_injected_original_dirname, "dist");
      function copyDir(src, dest) {
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        for (const entry of readdirSync(src)) {
          if (entry.includes(" ")) continue;
          const srcPath = join(src, entry);
          const destPath = join(dest, entry);
          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            cpSync(srcPath, destPath);
          }
        }
      }
      copyDir(publicDir, outDir);
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), copyPublicFilesPlugin()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  publicDir: false,
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      input: "index.html",
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["lucide-react"]
        }
      }
    }
  },
  base: "./"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBjcFN5bmMsIHJlYWRkaXJTeW5jLCBzdGF0U3luYywgZXhpc3RzU3luYywgbWtkaXJTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBjb3B5UHVibGljRmlsZXNQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2NvcHktcHVibGljLXNhZmUnLFxuICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgY29uc3QgcHVibGljRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKTtcbiAgICAgIGNvbnN0IG91dERpciA9IHJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpO1xuICAgICAgZnVuY3Rpb24gY29weURpcihzcmM6IHN0cmluZywgZGVzdDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghZXhpc3RzU3luYyhkZXN0KSkgbWtkaXJTeW5jKGRlc3QsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlYWRkaXJTeW5jKHNyYykpIHtcbiAgICAgICAgICBpZiAoZW50cnkuaW5jbHVkZXMoJyAnKSkgY29udGludWU7XG4gICAgICAgICAgY29uc3Qgc3JjUGF0aCA9IGpvaW4oc3JjLCBlbnRyeSk7XG4gICAgICAgICAgY29uc3QgZGVzdFBhdGggPSBqb2luKGRlc3QsIGVudHJ5KTtcbiAgICAgICAgICBpZiAoc3RhdFN5bmMoc3JjUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgY29weURpcihzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNwU3luYyhzcmNQYXRoLCBkZXN0UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb3B5RGlyKHB1YmxpY0Rpciwgb3V0RGlyKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgY29weVB1YmxpY0ZpbGVzUGx1Z2luKCldLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBwdWJsaWNEaXI6IGZhbHNlLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogJ2luZGV4Lmh0bWwnLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIGljb25zOiBbJ2x1Y2lkZS1yZWFjdCddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJhc2U6ICcuLydcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsUUFBUSxhQUFhLFVBQVUsWUFBWSxpQkFBaUI7QUFDckUsU0FBUyxNQUFNLGVBQWU7QUFIOUIsSUFBTSxtQ0FBbUM7QUFLekMsU0FBUyx3QkFBd0I7QUFDL0IsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sY0FBYztBQUNaLFlBQU0sWUFBWSxRQUFRLGtDQUFXLFFBQVE7QUFDN0MsWUFBTSxTQUFTLFFBQVEsa0NBQVcsTUFBTTtBQUN4QyxlQUFTLFFBQVEsS0FBYSxNQUFjO0FBQzFDLFlBQUksQ0FBQyxXQUFXLElBQUksRUFBRyxXQUFVLE1BQU0sRUFBRSxXQUFXLEtBQUssQ0FBQztBQUMxRCxtQkFBVyxTQUFTLFlBQVksR0FBRyxHQUFHO0FBQ3BDLGNBQUksTUFBTSxTQUFTLEdBQUcsRUFBRztBQUN6QixnQkFBTSxVQUFVLEtBQUssS0FBSyxLQUFLO0FBQy9CLGdCQUFNLFdBQVcsS0FBSyxNQUFNLEtBQUs7QUFDakMsY0FBSSxTQUFTLE9BQU8sRUFBRSxZQUFZLEdBQUc7QUFDbkMsb0JBQVEsU0FBUyxRQUFRO0FBQUEsVUFDM0IsT0FBTztBQUNMLG1CQUFPLFNBQVMsUUFBUTtBQUFBLFVBQzFCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFDQSxjQUFRLFdBQVcsTUFBTTtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQztBQUFBLEVBQzFDLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxNQUNQLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixRQUFRLENBQUMsa0JBQWtCO0FBQUEsVUFDM0IsT0FBTyxDQUFDLGNBQWM7QUFBQSxRQUN4QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUNSLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
