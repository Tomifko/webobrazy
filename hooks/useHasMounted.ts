import { useLayoutEffect, useState } from 'react';

export function useHasMounted() {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}