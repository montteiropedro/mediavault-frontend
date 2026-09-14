import { useContext } from 'react';
import { LibraryScanContext } from '@/contexts/libraryScan/LibraryScanContext';

export function useLibraryScan() {
  const context = useContext(LibraryScanContext);
  if (!context) {
    throw new Error('useLibraryScan must be used within LibraryScanProvider');
  }
  return context;
}
