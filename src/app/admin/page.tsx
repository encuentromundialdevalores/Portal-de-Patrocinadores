export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resumen General</h1>
        <p className="text-slate-500 mt-2">Métricas y accesos rápidos de tu organización.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Patrocinadores Activos", value: "45" },
          { label: "Nuevos esta semana", value: "+3" },
          { label: "Contenidos Publicados", value: "12" },
          { label: "Tasa de Visualización", value: "68%" }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-medium text-slate-500">{metric.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
