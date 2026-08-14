import { useEffect, useState } from 'react';

const MOBILE_UA_REGEX = /Android|iPhone|iPad|iPod/i;
const MOBILE_POINTER_QUERY = '(pointer: coarse) and (hover: none)';

function computeIsMobile(): boolean {
  if (typeof window === 'undefined') return false;

  return MOBILE_UA_REGEX.test(navigator.userAgent) || window.matchMedia(MOBILE_POINTER_QUERY).matches;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(computeIsMobile);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_POINTER_QUERY);
    const handleChange = () => setIsMobile(computeIsMobile());

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
