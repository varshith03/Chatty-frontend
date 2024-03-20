import { useEffect, useState } from "react";

const useDebounce = (value, delay = 1000) => {
  const [debouncedSearch, setDebouncedSearch] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedSearch;
};

export default useDebounce;
