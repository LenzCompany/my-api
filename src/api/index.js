import { Hono } from "hono";
import axios from "axios";
import { fetchJson } from "../../lib/func.js";
import { BloxFruit, copilot, npmSearch, hdown } from "../../lib/scraper.js";
import { sendVerificationEmail } from "../../lib/email.js";
import { getUsersCollection } from "../../lib/db.js";
import { translate } from "@vitalets/google-translate-api";
import QRCode from "qrcode";
const api = new Hono();

// Fungsi untuk menghasilkan API Key acak
const generateApiKey = () => {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
};

// Endpoint untuk generate QR Code
api.post("/generate-qrcode", async (c) => {
  const { text, apiKey } = await c.req.json();
  if (!text || !apiKey) {
    return c.json({ status: 400, error: "Text dan API Key diperlukan" }, 400);
  }

  const usersCollection = await getUsersCollection();

  // Cari pengguna berdasarkan API Key
  const user = await usersCollection.findOne({ apiKey });
  if (!user) {
    return c.json({ status: 401, error: "API Key tidak valid" }, 401);
  }

  // Cek status verifikasi
  if (!user.verified) {
    return c.json({ status: 401, error: "Email belum diverifikasi" }, 401);
  }

  // Cek limit pengguna
  if (user.limit <= 0) {
    return c.json({ status: 403, error: "Limit habis" }, 403);
  }

  // Kurangi limit pengguna
  await usersCollection.updateOne({ _id: user._id }, { $inc: { limit: -1 } });

  try {
    // Generate QR Code
    const qrCode = await QRCode.toDataURL(text);
    return c.json({
      status: 200,
      qrCode, // Kembalikan QR Code dalam format Data URL
      limit: user.limit - 1, // Kembalikan sisa limit
    });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    return c.json({ status: 500, error: "Gagal generate QR Code" }, 500);
  }
});

// Endpoint untuk translate
api.post("/translate", async (c) => {
  const { text, to, apiKey } = await c.req.json();
  if (!text || !to || !apiKey) {
    return c.json({ status: 400, error: "Text, to, dan API Key diperlukan" }, 400);
  }

  const usersCollection = await getUsersCollection();

  // Cari pengguna berdasarkan API Key
  const user = await usersCollection.findOne({ apiKey });
  if (!user) {
    return c.json({ status: 401, error: "API Key tidak valid" }, 401);
  }

  // Cek status verifikasi
  if (!user.verified) {
    return c.json({ status: 401, error: "Email belum diverifikasi" }, 401);
  }

  // Cek limit pengguna
  if (user.limit <= 0) {
    return c.json({ status: 403, error: "Limit habis" }, 403);
  }

  // Kurangi limit pengguna
  await usersCollection.updateOne({ _id: user._id }, { $inc: { limit: -1 } });

  try {
    // Lakukan translate
    const result = await translate(text, { to });
    return c.json({
      status: 200,
      translation: result.text,
      limit: user.limit - 1, // Kembalikan sisa limit
    });
  } catch (error) {
    console.error("Error translating text:", error);
    return c.json({ status: 500, error: "Gagal melakukan translate" }, 500);
  }
});

// Endpoint untuk login
api.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ status: 400, error: "Email dan password diperlukan" }, 400);
  }

  const usersCollection = await getUsersCollection();

  // Cari pengguna berdasarkan email dan password
  const user = await usersCollection.findOne({ email, password });
  if (!user) {
    return c.json({ status: 401, error: "Email atau password salah" }, 401);
  }

  // Cek status verifikasi
  if (!user.verified) {
    return c.json({ status: 401, error: "Email belum diverifikasi" }, 401);
  }

  // Kembalikan API Key
  return c.json({
    status: 200,
    apiKey: user.apiKey,
  });
});

api.post("/register", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ status: 400, error: "Email dan password diperlukan" }, 400);
  }

  const usersCollection = await getUsersCollection();

  // Cek apakah email sudah terdaftar
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return c.json({ status: 400, error: "Email sudah terdaftar" }, 400);
  }

  // Buat API Key acak
  const apiKey = generateApiKey();

  // Simpan pengguna baru
  const user = {
    email,
    password,
    apiKey,
    limit: 10, // Default limit 10 request per hari
    verified: false, // Status verifikasi awal: false
  };
  await usersCollection.insertOne(user);

  // Kirim email verifikasi
  await sendVerificationEmail(email, apiKey);

  return c.json({
    status: 200,
    message: "Email verifikasi telah dikirim. Silakan cek email Anda.",
  });
});

// Endpoint untuk verifikasi email
api.get("/verify", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.json({ status: 400, error: "Token verifikasi diperlukan" }, 400);
  }

  const usersCollection = await getUsersCollection();

  // Cari pengguna berdasarkan API Key (token)
  const user = await usersCollection.findOne({ apiKey: token });
  if (!user) {
    return c.json({ status: 400, error: "Token verifikasi tidak valid" }, 400);
  }

  // Verifikasi pengguna
  await usersCollection.updateOne({ _id: user._id }, { $set: { verified: true } });

  return c.json({
    status: 200,
    message: "Email berhasil diverifikasi. Sekarang Anda bisa login.",
  });
});

// Endpoint untuk mendapatkan info pengguna
api.get("/user", async (c) => {
  const apiKey = c.req.query("apiKey");
  if (!apiKey) {
    return c.json({ status: 400, error: "API Key diperlukan" }, 400);
  }

  // Baca data pengguna dari file JSON
  const users = readUsers();

  // Cari pengguna berdasarkan API Key
  const user = users.find((user) => user.apiKey === apiKey);
  if (!user) {
    return c.json({ status: 404, error: "Pengguna tidak ditemukan" }, 404);
  }

  return c.json({
    status: 200,
    user: {
      email: user.email,
      limit: user.limit,
      verified: user.verified,
    },
  });
});
api.get("/hdown", async(c) => {
let q = c.req.query("q");
  if (!q) {
    return c.json({ error: "q?" });
  }
  const result = await hdown(q)
  return c.json({
  result
  })
})
api.get("/npmSearch", async(c) => {
let q = c.req.query("q");
  if (!q) {
    return c.json({ error: "q?" });
  }
  const result = await npmSearch(q)
  return c.json({
  result            
  })
})
api.get("/copilot", async(c) => {
let q = c.req.query("q");
  if (!q) {
    return c.json({ error: "q?" });
  }
  const result = await copilot(q, "jawab menggunakan bahasa indonesia")
  return c.json({
  result
  })
})
api.get("/bf-getDetails", async(c) => {
let q = c.req.query("q");
  if (!q) {
    return c.json({ error: "q?" });
  }
const a = new BloxFruit()
const result = await a.getDetails(q)
return c.json({
result
})
})
api.get("/bf-fruitValue", async(c) => {
const res = new BloxFruit()
const result = await res.getFruitValue()
return c.json({
result
})
})
api.get("/bf-stock", async(c) => {
const a = new BloxFruit()
const res = await a.getStock()
return c.json({
res
})
})
api.get("/nsfw-trap", async (c) => {
  const result = await fetchJson(`https://waifu.pics/api/nsfw/trap`);
  return c.json({
    result,
  });
});
api.get("/nsfw-blowjob", async (c) => {
  const result = await fetchJson(`https://waifu.pics/api/nsfw/blowjob`);
  return c.json({
    result,
  });
});
api.get("/nsfw-neko", async (c) => {
  const result = await fetchJson(`https://waifu.pics/api/nsfw/neko`);
  return c.json({
    result,
  });
});

api.get("/nsfw-waifu", async (c) => {
  const result = await fetchJson(`https://waifu.pics/api/nsfw/waifu`);
  return c.json({
    result,
  });
});

api.get("/dark-jokes", async (c) => {
  const result = await fetchJson(`https://v2.jokeapi.dev/joke/Dark`);
  return c.json({
    result,
  });
});

api.get("/tiktok", async (c) => {
  const url = c.req.query("url");
  if (!url)
    return c.json({
      error: "url mana",
    });
  const json = await fetchJson(`https://tikwm.com/api/?url=${url}`);
  const final = json.data;
  return c.json({
    status: 200,
    result: final,
  });
});

api.get("/random-user", async (c) => {
  const json = await fetchJson("https://randomuser.me/api");
  return c.json({
    status: 200,
    result: json,
  });
});

api.get("/mistral", async (c) => {
  let query = c.req.query("query");
  if (!query) {
    return c.json({ error: "query?" });
  }
  const json = await axios.get(`https://api.ndaadev.us.kg/api/mistral?query=${query}`);
  const coco = json.data.result;
  return c.json({
    status: 200,
    result: coco,
  });
});

api.get("/mistral-large", async (c) => {
  let query = c.req.query("query");
  if (!query) {
    return c.json({ error: "query?" });
  }
  const json = await axios.get(`https://api.ndaadev.us.kg/api/mistral-large?query=${query}`);
  const coco = json.data.result;
  return c.json({
    status: 200,
    result: coco,
  });
});

api.get("/llama", async (c) => {
  let query = c.req.query("query");
  if (!query) {
    return c.json({ error: "query?" });
  }
  const json = await axios.get(`https://api.ndaadev.us.kg/api/llama?query=${query}`);
  const coco = json.data.result;
  return c.json({
    status: 200,
    result: coco,
  });
});

api.get("/openai", async (c) => {
  let query = c.req.query("query");
  if (!query) {
    return c.json({ error: "query?" });
  }
  const json = await axios.get(`https://api.ndaadev.us.kg/api/openai-v2?query=${query}`);
  const cool = json.data.result;
  return c.json({
    status: 200,
    result: cool,
  });
});
api.get("/tempmail/create", async (c) => {
  try {
    // Generate random email
    const email = await fetchJson(`https://www.1secmail.com/api/v1/?action=genRandomMailbox`)

    return c.json({
      status: 200,
      email,
    });
  } catch (error) {
    return c.json({
      status: 500,
      error: "Gagal membuat email sementara",
    });
  }
});

// Periksa inbox
api.get("/tempmail/inbox", async (c) => {
  const email = c.req.query("email");
  if (!email) {
    return c.json({
      status: 400,
      error: "Parameter email diperlukan",
    });
  }

  try {
    const [username, domain] = email.split("@");
    const response = await fetchJson(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`
    );

    return c.json({
      status: 200,
      inbox: response,
    });
  } catch (error) {
    return c.json({
      status: 500,
      error: "Gagal memeriksa inbox",
    });
  }
});

// Baca pesan
api.get("/tempmail/read", async (c) => {
  const email = c.req.query("email");
  const id = c.req.query("id");
  if (!email || !id) {
    return c.json({
      status: 400,
      error: "Parameter email dan id diperlukan",
    });
  }

  try {
    const [username, domain] = email.split("@");
    const response = await fetchJson(
      `https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${id}`
    );

    return c.json({
      status: 200,
      message: response,
    });
  } catch (error) {
    return c.json({
      status: 500,
      error: "Gagal membaca pesan",
    });
  }
});


export default api;