import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

/**
 * =========================
 * UTIL: GEOLOCALIZZAZIONE
 * =========================
 * Usa Nominatim (OpenStreetMap)
 * con più tentativi (fallback)
 */
async function geocodeAddress(address, city, cap) {
  const queries = [
    `${address}, ${cap}, ${city}, Italia`,
    `${address}, ${city}, Italia`,
    `${address}, ${city}`,
  ];

  for (const q of queries) {
    await delay(1000); // rispetto limiti API

    const query = encodeURIComponent(q);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "biscardi-immobiliare",
        },
      });

      if (!res.ok) continue;

      const data = await res.json();

      if (data.length) {
        return {
          lat: Number(data[0].lat),
          lng: Number(data[0].lon),
        };
      }
    } catch (err) {
      console.error("⚠️ Errore geocoding:", err.message);
    }
  }

  return null;
}

/**
 * Delay helper (necessario per rate limit)
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================= */
/* LISTA IMMOBILI */
/* ============================= */
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
      q,
    } = req.query;

    const filter = {};

    /**
     * Filtri base
     */
    if (city) filter.city = new RegExp(city, "i");
    if (type) filter.type = type;
    if (contract) filter.contract = contract;
    if (featured === "true") filter.featured = true;

    /**
     * Filtro prezzo
     */
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    /**
     * Ricerca testuale base (title + city)
     */
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    /**
     * Query parallele:
     * - items → dati
     * - total → totale risultati
     */
    const [items, total] = await Promise.all([
      Property.find(filter).sort({ price: 1 }).skip(skip).limit(Number(limit)),
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

/* ============================= */
/* IMMOBILI IN EVIDENZA */
/* ============================= */
export async function getFeatured(req, res, next) {
  try {
    const items = await Property.find({ featured: true })
      .sort({ price: 1 })
      .limit(8);

    res.json({ items });
  } catch (err) {
    next(err);
  }
}

/* ============================= */
/* DETTAGLIO IMMOBILE */
/* ============================= */
export async function getPropertyById(req, res, next) {
  try {
    const item = await Property.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Immobile non trovato");
    }

    res.json({ item });
  } catch (err) {
    next(err);
  }
}

/* ============================= */
/* CREA IMMOBILE */
/* ============================= */
export async function createProperty(req, res, next) {
  try {
    const { address, city, cap } = req.body;

    let location = null;

    /**
     * Geocoding solo se dati completi
     */
    if (address && city && cap) {
      location = await geocodeAddress(address, city, cap);
    }

    const created = await Property.create({
      ...req.body,
      price: Math.round(Number(req.body.price)),
      location,
    });

    res.status(201).json({ item: created });
  } catch (err) {
    next(err);
  }
}

/* ============================= */
/* AGGIORNA IMMOBILE */
/* ============================= */
export async function updateProperty(req, res, next) {
  try {
    const { address, city, cap } = req.body;

    const existing = await Property.findById(req.params.id);

    if (!existing) {
      res.status(404);
      throw new Error("Immobile non trovato");
    }

    let location = existing.location;

    /**
     * Aggiorna posizione solo se dati completi
     */
    if (address && city && cap) {
      const geo = await geocodeAddress(address, city, cap);
      if (geo) location = geo;
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: Math.round(Number(req.body.price)), // ✅ AGGIUNGI QUESTO
        location,
      },
      { new: true },
    );

    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

/* ============================= */
/* ELIMINA IMMOBILE */
/* ============================= */
export async function deleteProperty(req, res, next) {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404);
      throw new Error("Immobile non trovato");
    }

    /**
     * Eliminazione immagini Cloudinary
     * (evita file orfani)
     */
    if (property.images?.length) {
      for (const img of property.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error("⚠️ Errore eliminazione immagine:", err.message);
          }
        }
      }
    }

    /**
     * Eliminazione planimetrie
     */
    if (property.planimetries?.length) {
      for (const plan of property.planimetries) {
        if (plan.public_id) {
          try {
            await cloudinary.uploader.destroy(plan.public_id);
          } catch (err) {
            console.error("⚠️ Errore eliminazione planimetria:", err.message);
          }
        }
      }
    }

    /**
     * Eliminazione documento DB
     */
    await property.deleteOne();

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/* ============================= */
/* IMMOBILI PIÙ RECENTI */
/* ============================= */
export const getLatest = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "6", 10), 20);

    const items = await Property.find({}).sort({ price: 1 }).limit(limit);

    res.json(items);
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* UPLOAD IMMAGINI */
/* ============================= */
export async function uploadImages(req, res, next) {
  try {
    const files = req.files || [];

    /**
     * Upload parallelo su Cloudinary
     */
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

    /**
     * Pulizia file temporanei locali
     */
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("⚠️ Errore cleanup file:", err.message);
      }
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

/* ============================= */
/* ELIMINA SINGOLA IMMAGINE */
/* ============================= */
export async function deleteImage(req, res, next) {
  try {
    const { public_id } = req.body;

    await cloudinary.uploader.destroy(public_id);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
