import { type ReactNode } from 'react';
import { useJobProgress } from '@/hooks/useJobProgress';
import { libraryService } from '@/services/api';
import { LibraryScanContext } from './LibraryScanContext';

type LibraryScanProviderProps = { children: ReactNode };

export function LibraryScanProvider({ children }: LibraryScanProviderProps) {
  const { jobId, progress, followProgress } = useJobProgress({ cacheKey: 'scanJobId' });

  const handleLibraryScan = async () => {
    try {
      const { job_id } = await libraryService.triggerScan();
      followProgress(job_id);
    } catch (error) {
      console.error('Error scanning library:', error);
    }
  };

  return (
    <LibraryScanContext.Provider
      value={{
        isScanning: !!jobId,
        scanJobId: jobId,
        scanJobProgress: progress,
        handleLibraryScan,
      }}
    >
      {children}
    </LibraryScanContext.Provider>
  );
}
