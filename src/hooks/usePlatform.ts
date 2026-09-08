import { useEffect, useState } from 'react';

export type Platform = {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
};

const MOBILE_POINTER_QUERY = '(pointer: coarse) and (hover: none)';
const IOS_UA_REGEX = /iPad|iPhone|iPod/i;
const ANDROID_UA_REGEX = /Android/i;

function computeIsIOS(): boolean {
  if (typeof window === 'undefined') return false;
  if (IOS_UA_REGEX.test(navigator.userAgent)) return true;

  // iPadOS 13+ reports UA as "Macintosh" but exposes multi-touch, unlike real Macs (mouse/trackpad only).
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

function computeIsAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return ANDROID_UA_REGEX.test(navigator.userAgent);
}

function computeIsMobile(isIOS: boolean, isAndroid: boolean): boolean {
  if (typeof window === 'undefined') return false;
  return isIOS || isAndroid || window.matchMedia(MOBILE_POINTER_QUERY).matches;
}

// Computed once per page load — platform/UA don't change mid-session,
// only the coarse-pointer media query can (e.g. resizing a desktop
// window across a breakpoint), which the hook still tracks reactively.
const staticIsIOS = computeIsIOS();
const staticIsAndroid = computeIsAndroid();

export function usePlatform(): Platform {
  const [isMobile, setIsMobile] = useState(() => computeIsMobile(staticIsIOS, staticIsAndroid));

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_POINTER_QUERY);
    const handleChange = () => setIsMobile(computeIsMobile(staticIsIOS, staticIsAndroid));

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return {
    isMobile,
    isIOS: staticIsIOS,
    isAndroid: staticIsAndroid,
    isDesktop: !isMobile,
  };
}
