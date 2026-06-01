export function StudentSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="w-full">
      <label className="sr-only">Search student</label>
      <input
        type="search"
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        placeholder="Search student"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
