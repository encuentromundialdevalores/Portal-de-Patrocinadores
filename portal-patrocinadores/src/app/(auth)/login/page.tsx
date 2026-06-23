import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h1>
        <p className="text-slate-500 mt-2 text-sm">Ingresa tus credenciales para acceder al portal</p>
      </div>
      
      <div className="space-y-4">
        {/* Placeholder para React Hook Form */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="ejemplo@empresa.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="••••••••"
          />
        </div>
        
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-4 transition-colors">
          Ingresar
        </Button>
      </div>
    </div>
  )
}
