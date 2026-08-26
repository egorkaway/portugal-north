import { useEffect } from 'react';
import { startCatalogSyncListener } from '@/lib/catalogSync';

/** Checks verystays.com once a day for new stations / hotels / images / reliability JSON. */
export function CatalogSyncBootstrap() {
  useEffect(() => startCatalogSyncListener(), []);
  return null;
}
