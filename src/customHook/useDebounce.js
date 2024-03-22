import React from "react";
export default function useDebounce(value, delay) {
  const [debounce, setDebounce] = React.useState("");

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounce;
}
