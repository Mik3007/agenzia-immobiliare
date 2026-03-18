import logoEsteso from "../assets/brand/EBi_Logo esteso per sfondo chiaro (trasparente).png";

/**
 * =========================
 * FOOTER
 * =========================
 * Sezione finale del sito con:
 * - logo e descrizione
 * - contatti
 * - dati legali
 * - copyright
 */
export default function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">

        {/* =========================
            BLOCCO PRINCIPALE
        ========================= */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">

          {/* =========================
              LOGO + DESCRIZIONE
          ========================= */}
          <div className="mb-8 md:mb-0">
            <img
              src={logoEsteso}
              alt="Emanuele Biscardi Immobiliare"
              className="h-16 md:h-14 w-auto mx-auto md:mx-0"
            />

            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Agenzia immobiliare specializzata nella compravendita di immobili
              a Caserta e provincia, con consulenza professionale e supporto
              completo in ogni fase della trattativa.
            </p>
          </div>

          {/* =========================
              CONTATTI
          ========================= */}
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">
              Contatti
            </p>

            <p>📍 Via Ferrara, 48 — 81100 Caserta</p>
            <p>📞 +39 3663432225</p>
            <p>✉️ biscardimmobiliare@libero.it</p>
            <p>📨 biscardiemanuele@pec.libero.it</p>
          </div>

          {/* =========================
              DATI LEGALI
          ========================= */}
          <div className="space-y-2 text-sm text-gray-600 mt-8 md:mt-0">
            <p className="font-semibold text-gray-800">
              Informazioni
            </p>

            <p>P.IVA 04503690614</p>
            <p>Cod. Fisc. BSCMNL88M24E791W</p>
            <p>REA CE 366207</p>
          </div>

        </div>

        {/* =========================
            COPYRIGHT
        ========================= */}
        <div className="border-t mt-10 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Emanuele Biscardi Immobiliare — Tutti i diritti riservati
        </div>

      </div>
    </footer>
  );
}