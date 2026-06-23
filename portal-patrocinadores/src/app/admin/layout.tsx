export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 hidden md:block">
        <div className="mb-8">
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>
        <nav className="space-y-2">
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-medium cursor-pointer">
            Dashboard
          </div>
          <div className="px-4 py-2 hover:bg-slate-800 rounded-lg text-sm font-medium cursor-pointer text-slate-300 transition-colors">
            Patrocinadores
          </div>
          <div className="px-4 py-2 hover:bg-slate-800 rounded-lg text-sm font-medium cursor-pointer text-slate-300 transition-colors">
            Contenido
          </div>
        </nav>
      </aside>
      
      <div className="flex-1">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center px-6 justify-between">
          <span className="text-lg font-semibold text-slate-800">Panel de Organización</span>
          <span className="text-sm text-slate-500">Cerrar Sesión</span>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
