import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import api from './backend/index.js'; // Import backend API
import { readFileSync } from 'node:fs';

// Baca file JSON secara manual
const swaggerJson = JSON.parse(readFileSync('./swagger-output.json', 'utf-8'));

// Inisialisasi Hono app
const app = new Hono();

// Serve swagger.json
app.get('/swagger.json', (c) => {
    return c.json(swaggerJson);
  });

// Landing Page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to My API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        a {
          color: #0070f3;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to My API</h1>
        <p>This is a simple REST API built with Hono and Node.js.</p>
        <p>Check out the <a href="/docs">API Documentation</a> to get started.</p>
      </div>
    </body>
    </html>
  `);
});

// Swagger UI
app.get(
  '/docs',
  swaggerUI({
    url: '/swagger.json', // Endpoint untuk mengambil spesifikasi OpenAPI
  })
);

// Mount backend API dengan prefix /api/v1
app.route('/api/v1', api);

// Jalankan server
const port = 3000;
serve({
  fetch: app.fetch,
  port,
});

console.log(`Server berjalan di http://localhost:${port}`);
