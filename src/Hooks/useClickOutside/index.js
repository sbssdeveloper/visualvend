import { useEffect } from 'react';

const useClickOutside = (ref, fn = () => null) => {
  useEffect(() => {
    function handleClickOutside(event) {
      let callFunction = false;
      if (ref && ref.length > 0) {
        for (let index = 0; index < ref.length; index++) {
          let refs = ref[index];
          if (refs.current && !refs.current.contains(event.target)) {
            callFunction = true;
          } else {
            callFunction = false;
            break;
          }
        }
        if (callFunction) {
          fn();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, fn]);

  return;
};

export default useClickOutside;
