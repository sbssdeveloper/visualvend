import { useState } from "react";

const useDebounce = (callback, delay) => {
  const [timer, setTimer] = useState(null);

  return (...args) => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        callback(...args);
      }, delay)
    );
  };
};

export default useDebounce;
