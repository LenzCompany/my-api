import { Hono } from "hono";

const translatePage = new Hono();

translatePage.get("/", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Translate</title>
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
          input[type="text"], select {
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
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Translate</h1>
          <form id="translate-form">
            <input type="text" id="text" placeholder="Text to translate" required />
            <select id="to" required>
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <input type="text" id="apiKey" placeholder="API Key" required />
            <button type="submit">Translate</button>
          </form>
          <div id="message"></div>
        </div>
        <script>
          const translateForm = document.getElementById("translate-form");
          const message = document.getElementById("message");

          translateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = document.getElementById("text").value;
            const to = document.getElementById("to").value;
            const apiKey = document.getElementById("apiKey").value;

            const response = await fetch("/api/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text, to, apiKey }),
            });

            const data = await response.json();
            if (data.translation) {
              message.innerHTML = \`
                <p>Translation: <strong>\${data.translation}</strong></p>
                <p>Limit tersisa: <strong>\${data.limit}</strong></p>
              \`;
            } else {
              message.textContent = data.error || "Terjadi kesalahan";
            }
          });
        </script>
      </body>
    </html>
  `;
  return c.html(html);
});

export default translatePage;