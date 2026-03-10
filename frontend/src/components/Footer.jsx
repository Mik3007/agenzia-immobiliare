import logoEsteso from "../assets/brand/EBi_Logo esteso per sfondo chiaro (trasparente).png";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        {/* PERSONALIZZA: qui metti indirizzo, P.IVA, REA, social, ecc. */}
        <img
                    src={logoEsteso}
                    alt="Emanuele Biscardi Immobiliare"
                    className="h-24 md:h-12 mb-2 w-auto max-w-none"
                  />
        <p>Via Ferrara, 48 81100 • Tel. +39 3663432225</p>
        <div className="flex my-2 gap-1">
          <p>pec: biscardiemanuele@pec.libero.it </p>
          <p>• e-mail biscarimmobiliare@libero.it</p>
        </div>
        <div className="flex gap-1">
          <p>P.IVA 04503690614</p>
          <p>• Cod.Fisc. BSCMNL88M24E791W</p>
          <p>• REA CE 366207</p>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} - Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
