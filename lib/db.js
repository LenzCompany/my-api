import { MongoClient } from "mongodb";

// Ambil connection string dari environment variable
const uri = "mongodb://04bd989b83f850a3d6067b46fb5eda97:ndaacy123@15a.mongo.evennode.com:27019,15b.mongo.evennode.com:27019/04bd989b83f850a3d6067b46fb5eda97?replicaSet=eu-15";

// Buat instance MongoClient
const client = new MongoClient(uri);

let db;

// Fungsi untuk menghubungkan ke MongoDB
export const connectToDatabase = async () => {
  if (db) return db; // Jika sudah terhubung, kembalikan koneksi yang ada

  try {
    await client.connect();
    db = client.db(); // Gunakan database default dari connection string
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan koleksi pengguna
export const getUsersCollection = async () => {
  const db = await connectToDatabase();
  return db.collection("users");
};