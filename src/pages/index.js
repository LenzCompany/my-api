import { Hono } from "hono";

const pages = new Hono();

pages.get("/chat", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chat with AI</title>
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
            width: 100%;
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
          .chat-box {
            height: 400px;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 20px;
            background: rgba(0, 0, 0, 0.2);
          }
          .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 10px;
            max-width: 70%;
          }
          .user-message {
            background: #007bff;
            align-self: flex-end;
            margin-left: auto;
          }
          .ai-message {
            background: #333;
            align-self: flex-start;
            margin-right: auto;
          }
          form {
            display: flex;
            gap: 10px;
          }
          input[type="text"] {
            flex: 1;
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
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
            .chat-box {
              height: 300px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Chat with AI</h1>
          <div class="chat-box" id="chat-box">
            <!-- Pesan akan ditampilkan di sini -->
          </div>
          <form id="chat-form">
            <input type="text" id="message-input" placeholder="Type your message..." required />
            <button type="submit">Send</button>
          </form>
        </div>
        <script>
          const chatBox = document.getElementById("chat-box");
          const chatForm = document.getElementById("chat-form");
          const messageInput = document.getElementById("message-input");

          // Fungsi untuk menambahkan pesan ke chat box
          function addMessage(role, message) {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", role + "-message");
            messageElement.textContent = message;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight; // Scroll ke bawah
          }

          // Handle form submission
          chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (!message) return;

            // Tambahkan pesan pengguna ke chat box
            addMessage("user", message);
            messageInput.value = ""; // Kosongkan input

            // Kirim pesan ke API
            try {
              const response = await fetch("/api/mistral?query=" + encodeURIComponent(message));
              const data = await response.json();
              if (data.result) {
                // Tambahkan respons AI ke chat box
                addMessage("ai", data.result);
              } else {
                addMessage("ai", "Error: Failed to get AI response.");
              }
            } catch (error) {
              console.error("Error:", error);
              addMessage("ai", "Error: Failed to connect to the server.");
            }
          });
        </script>
      </body>
    </html>
  `;
  return c.html(html);
});

pages.get("/", (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My API</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
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
            min-height: 100vh;
            text-align: center;
          }
          .container {
            max-width: 1200px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            animation: fadeIn 2s ease-in-out;
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            animation: fadeIn 3s ease-in-out;
          }
          .sections {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            width: 300px;
            text-align: left;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .section:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          .section h2 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section ul {
            list-style: none;
            padding: 0;
          }
          .section ul li {
            margin-bottom: 10px;
          }
          .section ul li a {
            color: #fff;
            text-decoration: none;
            font-size: 1.1rem;
            transition: color 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .section ul li a:hover {
            color: #007bff;
          }
          .footer {
            margin-top: 40px;
            font-size: 1rem;
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .footer a {
            color: #fff;
            text-decoration: none;
            transition: color 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .footer a:hover {
            color: #007bff;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
            .sections {
              flex-direction: column;
            }
            .section {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to My API</h1>
          <p>Explore the features and tools available in this API system.</p>
          <div class="sections">
            <div class="section">
              <h2><i class="fas fa-user-lock"></i> Authentication</h2>
              <ul>
                <li><a href="/login"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                <li><a href="/register"><i class="fas fa-user-plus"></i> Register</a></li>
              </ul>
            </div>
            <div class="section">
              <h2><i class="fas fa-tools"></i> Tools</h2>
              <ul>
                <li><a href="/translate"><i class="fas fa-language"></i> Translate</a></li>
                <li><a href="/qrcode"><i class="fas fa-qrcode"></i> Generate QR Code</a></li>
                <li><a href="/chat"><i class="fas fa-robot"></i> Chat Bot</a></li>
              </ul>
            </div>
            <div class="section">
              <h2><i class="fas fa-book"></i> Documentation</h2>
              <ul>
                <li><a href="/docs"><i class="fas fa-file-alt"></i> API Documentation</a></li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <a href="https://github.com/username" target="_blank">
              <i class="fab fa-github"></i> GitHub
            </a>
            <a href="https://wa.me/6281234567890" target="_blank">
              <i class="fab fa-whatsapp"></i> Support CS
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
  return c.html(html);
});

export default pages;