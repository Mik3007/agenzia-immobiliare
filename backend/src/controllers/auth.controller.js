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
     * =========================
     * VALIDAZIONE INPUT
     * =========================
     */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e password richieste",
      });
    }

    /**
     * =========================
     * RICERCA UTENTE
     * =========================
     */
    const user = await User.findOne({ email });

    /**
     * Se utente NON esiste
     * → errore generico (sicurezza)
     */
    if (!user) {
      return res.status(401).json({
        message: "Credenziali non valide",
      });
    }

    /**
     * =========================
     * VERIFICA PASSWORD
     * =========================
     */
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Credenziali non valide",
      });
    }

    /**
     * =========================
     * GENERAZIONE JWT
     * =========================
     * - contiene info minime
     * - durata 7 giorni
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
     * =========================
     * RISPOSTA SUCCESSO
     * =========================
     */
    return res.json({ token });

  } catch (err) {
    /**
     * =========================
     * ERRORE GENERICO
     * =========================
     * NON lanciamo throw → evitiamo crash server (e problemi CORS)
     */
    console.error("❌ ERRORE LOGIN:", err);

    return res.status(500).json({
      message: "Errore server login",
    });
  }
}