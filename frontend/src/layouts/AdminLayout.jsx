import { useNavigate } from "react-router-dom";

export default function AdminLayout({ title, children }) {
  const nav = useNavigate();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-[#282828]">
            {title}
          </h1>
        </div>

        <button
          onClick={() => nav("/admin/dashboard")}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Torna alla dashboard
        </button>
      </div>

      {children}

    </main>
  );
}