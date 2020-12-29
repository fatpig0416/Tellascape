import { useRef, useEffect } from 'react';

export const useCombinedRefs = (...refs) => {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach(ref => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
