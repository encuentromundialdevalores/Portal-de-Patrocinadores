export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mi Impacto</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Metrics */}
        {[
          { label: "Personas Impactadas", value: "2,450" },
          { label: "Eventos Realizados", value: "12" },
          { label: "Horas de Formación", value: "340" }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">{metric.label}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
