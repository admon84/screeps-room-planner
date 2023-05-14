import { RefObject, useEffect, useState } from 'react';

export const useElementSize = (ref: RefObject<HTMLHeadingElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: ref.current!.offsetWidth,
      height: ref.current!.offsetHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (ref.current) {
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return dimensions;
};
