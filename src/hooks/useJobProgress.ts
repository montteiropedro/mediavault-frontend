import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { isAxiosError } from 'axios';

export type JobProgress = {
  percent: number;
  status: string;
  error?: string;
} | null;

type UseJobProgressProps = {
  cacheKey?: string;
};

const MAX_CONSECUTIVE_ERRORS = 3;

export function useJobProgress({ cacheKey }: UseJobProgressProps) {
  const [progress, setProgress] = useState<JobProgress>(null);

  const [jobId, setJobId] = useState<string | null>(() => {
    return cacheKey ? localStorage.getItem(cacheKey) : null;
  });

  const followProgress = useCallback(
    (newJobId: string) => {
      setProgress(null);
      setJobId(newJobId);
      if (cacheKey) localStorage.setItem(cacheKey, newJobId);
    },
    [cacheKey]
  );

  useEffect(() => {
    if (!jobId) return;

    let consecutiveErrors = 0;

    const interval = setInterval(async () => {
      const stopFollowingJobProgress = (finalProgress: JobProgress) => {
        setProgress(finalProgress);
        clearInterval(interval);
        if (cacheKey) localStorage.removeItem(cacheKey);
        setJobId(null);
      };

      try {
        const response = await api.get(`/api/v1/jobs/${jobId}/progress`);
        consecutiveErrors = 0;

        if (response.data.status === 'completed' || response.data.status === 'failed') {
          stopFollowingJobProgress(response.data);
        } else {
          setProgress(response.data);
        }
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          console.error(`Job not found, stopping polling.`);
          stopFollowingJobProgress({ percent: 0, status: 'failed', error: 'Job not found' });
          return;
        }

        consecutiveErrors += 1;
        console.error(`Error fetching job progress (attempt ${consecutiveErrors}):`, error);

        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          stopFollowingJobProgress({ percent: 0, status: 'failed', error: 'Lost connection to server' });
        }
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [jobId, cacheKey]);

  return { jobId, progress, followProgress };
}
