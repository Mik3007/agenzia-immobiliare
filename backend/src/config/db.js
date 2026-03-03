import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("✅ MongoDB connesso");
  } catch (err) {
    console.error("❌ Errore connessione MongoDB:", err.message);
    process.exit(1);
  }
}
