import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const useSearch = (initialData, query, filter) => {
  const [search, setSearch] = useSearchParams();

  const q = search.get("q") || "";
  const f = filter ? search.get(filter) : null;

  const data = useMemo(() => {
    if (!initialData) return null;

    const qLower = q.toLowerCase();

    return initialData.filter((item) => {
      if (filter && f && item[filter] !== f) return false;
      if (query && !item[query].toLowerCase().includes(qLower)) return false;
      return true;
    });
  }, [initialData, query, filter, q, f]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setSearch((prev) => {
        const next = new URLSearchParams(prev);
        value ? next.set(name, value) : next.delete(name);
        return next;
      });
    },
    [setSearch],
  );

  return [handleChange, data, search];
};

export default useSearch;
