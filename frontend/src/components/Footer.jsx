export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        {/* PERSONALIZZA: qui metti indirizzo, P.IVA, REA, social, ecc. */}
        <p className="font-medium text-gray-900">Biscardi Immobiliare</p>
        <p>Via Ferrara, 81100 • Tel. +39 3663432225</p>
        <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} - Tutti i diritti riservati</p>
      </div>
    </footer>
  );
}
