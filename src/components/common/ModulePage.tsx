export function ModulePage({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 leading-relaxed">Track day-to-day operations with role-aware workflows and actionable insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bullets.map((item) => (
          <div 
            key={item}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-green-500 text-xl font-bold pt-0.5 flex-shrink-0">✓</div>
              <div className="font-semibold text-gray-900">{item}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="inline-block px-4 py-2 border border-blue-500 text-blue-700 bg-blue-50 rounded-full text-sm font-medium">Tailwind</span>
        <span className="inline-block px-4 py-2 border border-gray-300 text-gray-700 bg-gray-50 rounded-full text-sm font-medium">MVP Ready</span>
        <span className="inline-block px-4 py-2 border border-gray-300 text-gray-700 bg-gray-50 rounded-full text-sm font-medium">Role-based</span>
      </div>
    </div>
  );
}
