export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        {/* PERSONALIZZA: qui metti indirizzo, P.IVA, REA, social, ecc. */}
        <p className="font-medium text-gray-900">Agenzia Immobiliare</p>
        <p>Via Esempio 1, 20100 Milano • Tel. 02 000000</p>
        <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} - Tutti i diritti riservati</p>
      </div>
    </footer>
  );
}
