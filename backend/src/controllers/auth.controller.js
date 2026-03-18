import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * =========================
 * LOGIN ADMIN
 * =========================
 * POST /api/auth/login
 *
 * Body:
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Response:
 * {
 *   token: string
 * }
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    /**
     * Validazione base input
     */
    if (!email || !password) {
      res.status(400);
      throw new Error("Email e password richieste");
    }

    /**
     * Ricerca utente per email
     */
    const user = await User.findOne({ email });

    /**
     * Se utente non esiste → errore generico (sicurezza)
     */
    if (!user) {
      res.status(401);
      throw new Error("Credenziali non valide");
    }

    /**
     * Confronto password hashata
     */
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      res.status(401);
      throw new Error("Credenziali non valide");
    }

    /**
     * Creazione token JWT
     * - contiene info minime necessarie
     * - durata: 7 giorni
     */
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /**
     * Risposta al client
     */
    res.json({ token });
  } catch (err) {
    /**
     * Passaggio al middleware globale errorHandler
     */
    throw err;
  }
}