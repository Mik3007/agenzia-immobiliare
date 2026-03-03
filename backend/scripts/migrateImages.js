import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property.js";

dotenv.config();

function extractPublicId(url) {
  try {
    const parts = url.split("/upload/")[1];
    const withoutVersion = parts.replace(/v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connesso a Mongo");

  const properties = await Property.find({});

  let updatedCount = 0;

  for (const property of properties) {
    if (!property.images?.length) continue;

    const needsMigration = typeof property.images[0] === "string";

    if (!needsMigration) continue;

    const newImages = property.images
      .map((url) => {
        const public_id = extractPublicId(url);
        if (!public_id) return null;

        return { url, public_id };
      })
      .filter(Boolean);

    property.images = newImages;
    await property.save();
    updatedCount++;
  }

  console.log(`🎉 Migrazione completata. Aggiornati ${updatedCount} immobili.`);
  process.exit();
}

run().catch((err) => {
  console.error("❌ Errore:", err);
  process.exit(1);
});