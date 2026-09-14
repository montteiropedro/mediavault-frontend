import { createContext } from 'react';
import type { JobProgress } from '@/hooks/useJobProgress';

export type LibraryScanContextValue = {
  isScanning: boolean;
  scanJobId: string | null;
  scanJobProgress: JobProgress;
  handleLibraryScan: () => void;
};

export const LibraryScanContext = createContext<LibraryScanContextValue | null>(null);
