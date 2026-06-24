import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-slate-800 tracking-tight">Portal EMV</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Resumen
              </Link>
              <Link href="/dashboard/boletos" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Mis Boletos
              </Link>
              <Link href="/dashboard/entregables" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Beneficios
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">{session.user?.name}</span>
                <form action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}>
                  <button type="submit" className="p-2 text-slate-400 hover:text-slate-500" title="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
