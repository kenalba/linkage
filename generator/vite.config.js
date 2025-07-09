import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const saveGamePlugin = () => ({
  name: 'save-game',
  configureServer(server) {
    // Serve output directory
    server.middlewares.use('/output', (req, res, next) => {
      const filePath = path.join(process.cwd(), '..', 'output', req.url);
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/html');
        res.end(fs.readFileSync(filePath));
      } else {
        next();
      }
    });

    // Handle save game API
    server.middlewares.use('/api/save-game', (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { filename, content } = JSON.parse(body);
            const outputDir = path.join(process.cwd(), '..', 'output');
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }
            const outputPath = path.join(outputDir, filename);
            fs.writeFileSync(outputPath, content);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              filename,
              previewUrl: `/output/${filename}`
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
    open: '/puzzle-creator.html',
    fs: {
      allow: ['..']
    }
  },
  plugins: [saveGamePlugin(), copyTemplatePlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './puzzle-creator.html'
    }
  }
});