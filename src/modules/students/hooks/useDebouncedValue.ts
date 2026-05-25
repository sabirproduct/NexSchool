import { useEffect, useState } from 'react';
export function useDebouncedValue<T>(value: T, ms = 400) {
  const [state, setState] = useState(value);
  useEffect(() => { const t = setTimeout(() => setState(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return state;
}
