import { useEffect, useState } from 'react';
import { getCatalogRevision, subscribeCatalog } from '@/lib/stationData';

/** Re-render when a downloaded catalog overlay is applied. */
export function useCatalogRevision(): number {
  const [revision, setRevision] = useState(getCatalogRevision);
  useEffect(() => subscribeCatalog(() => setRevision(getCatalogRevision())), []);
  return revision;
}
