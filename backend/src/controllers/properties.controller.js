import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * GET /api/properties
 * Filtri via query string:
 * - city, type, contract, minPrice, maxPrice, featured
 * - page, limit
 */
export async function listProperties(req, res, next) {
  try {
    const {
      city,
      type,
      contract,
      minPrice,
      maxPrice,
      featured,
      page = 1,
      limit = 12,
      q, // ricerca testuale semplice (titolo/città)
    } = req.query;

    const filter = {};

    // Filtri “facili” da personalizzare
    if (city) filter.city = new RegExp(city, "i");
    if (type) filter.type = type;
    if (contract) filter.contract = contract;
    if (featured === "true") filter.featured = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Ricerca base su title/city (per qualcosa di più serio: text index)
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req, res, next) {
  try {
    const items = await Property.find({ featured: true })
      .sort({ updatedAt: -1 })
      .limit(8);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function getPropertyById(req, res, next) {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Immobile non trovato" });
    res.json({ item });
  } catch (err) {
    next(err);
  }
}

export async function createProperty(req, res, next) {
  try {
    // Qui decidi cosa accettare dal frontend (per ora prendiamo tutto il body)
    const created = await Property.create(req.body);
    res.status(201).json({ item: created });
  } catch (err) {
    next(err);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Immobile non trovato" });
    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Immobile non trovato" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export const getLatest = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "6", 10), 20);

    const items = await Property.find({}).sort({ createdAt: -1 }).limit(limit);

    res.json(items);
  } catch (err) {
    next(err);
  }
};

export async function uploadImages(req, res, next) {
  try {
    const files = req.files || [];

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "properties",
        transformation: [
          { width: 1600, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }),
    );

    const results = await Promise.all(uploadPromises);

    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    const images = results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));

    res.json({ images });
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { public_id } = req.body;

    await cloudinary.uploader.destroy(public_id);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
