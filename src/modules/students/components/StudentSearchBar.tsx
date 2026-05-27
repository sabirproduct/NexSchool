export function StudentSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="form-label visually-hidden">Search student</label>
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder="Search student"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
