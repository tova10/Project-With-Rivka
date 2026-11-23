import { useSearchParams } from "react-router-dom";


function useUrlParams(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {};
  for (const key in defaults) {
    params[key] = searchParams.get(key) ?? defaults[key];
  }

  function setParams(changes) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key in changes) {
          if (changes[key] === defaults[key]) next.delete(key);
          else next.set(key, changes[key]);
        }
        return next;
      },
      { replace: true } 
    );
  }

  return [params, setParams];
}

export default useUrlParams;
