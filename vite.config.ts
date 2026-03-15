import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'watch-public',
      configureServer(server: any) {
        server.watcher.add(path.resolve(__dirname, 'public'));
        server.watcher.on('change', (file: string) => {
          if (file.includes('/public/') || file.includes('\\public\\')) {
            server.ws.send({ type: 'full-reload' });
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
