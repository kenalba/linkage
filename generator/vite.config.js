import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const saveGamePlugin = () => ({
  name: 'save-game',
  configureServer(server) {
    server.middlewares.use('/api/save-game', (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { filename, content } = JSON.parse(body);
            const outputPath = path.join(process.cwd(), '..', 'output', filename);
            fs.writeFileSync(outputPath, content);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              filename,
              previewUrl: `../output/${filename}`
            }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

const copyTemplatePlugin = () => ({
  name: 'copy-template',
  generateBundle() {
    // Copy template file to dist
    const templateContent = fs.readFileSync('game-template.html', 'utf8');
    this.emitFile({
      type: 'asset',
      fileName: 'game-template.html',
      source: templateContent
    });
  }
});

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: '/puzzle-creator.html'
  },
  plugins: [saveGamePlugin(), copyTemplatePlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'puzzle-creator.html'
      }
    },
    // Copy template and CSS files to dist
    copyPublicDir: false,
    assetsInlineLimit: 0
  },
  publicDir: false
});