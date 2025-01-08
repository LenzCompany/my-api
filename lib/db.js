import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve("db", "users.json");

// Fungsi untuk membaca data dari file JSON
export const readUsers = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

// Fungsi untuk menulis data ke file JSON
export const writeUsers = (users) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing users file:", error);
  }
};