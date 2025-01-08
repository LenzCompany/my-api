import { Hono } from "hono";

const qrcodePage = new Hono();

qrcodePage.get("/", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Generate QR Code</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          body {
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .container {
            max-width: 800px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          input[type="text"] {
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
          }
          button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background: #007bff;
            color: #fff;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          button:hover {
            background: #0056b3;
          }
          #message {
            margin-top: 20px;
            font-size: 1.2rem;
          }
          #qrcode {
            margin-top: 20px;
          }
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Generate QR Code</h1>
          <form id="qrcode-form">
            <input type="text" id="text" placeholder="Text to generate QR Code" required />
            <input type="text" id="apiKey" placeholder="API Key" required />
            <button type="submit">Generate</button>
          </form>
          <div id="message"></div>
          <div id="qrcode"></div>
        </div>
        <script>
          const qrcodeForm = document.getElementById("qrcode-form");
          const message = document.getElementById("message");
          const qrcodeContainer = document.getElementById("qrcode");

          qrcodeForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = document.getElementById("text").value;
            const apiKey = document.getElementById("apiKey").value;

            const response = await fetch("/api/generate-qrcode", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text, apiKey }),
            });

            const data = await response.json();
            if (data.qrCode) {
              qrcodeContainer.innerHTML = \`
                <img src="\${data.qrCode}" alt="QR Code" />
                <p>Limit tersisa: <strong>\${data.limit}</strong></p>
              \`;
              message.textContent = "";
            } else {
              qrcodeContainer.innerHTML = "";
              message.textContent = data.error || "Terjadi kesalahan";
            }
          });
        </script>
      </body>
    </html>
  `;
  return c.html(html);
});

export default qrcodePage;