import { Hono } from "hono";
import { serve } from "@hono/node-server";
import api from "./api/index.js";
import docs from "./docs/index.js";
import pages from "./pages/index.js";
import register from "./pages/register.js";
import login from "./pages/login.js";
import translatePage from "./pages/translate.js";
import qrcodePage from "./pages/qrcode.js";

const app = new Hono();

// Gabungkan semua route
app.route("/", pages); // Landing Page
app.route("/api", api); // REST API
app.route("/docs", docs); // Swagger UI Docs
app.route("/register", register); // Halaman Registrasi
app.route("/login", login);//Halaman Login
app.route("/translate", translatePage); //Halaman Translate
app.route("/qrcode", qrcodePage) //Halaman Qrcode Generator.

// Middleware untuk menangani 404 dan redirect ke landing page
app.notFound((c) => {
  return c.redirect("/");
});

// Jalankan server
serve({
  fetch: app.fetch,
  port: 3000,
});