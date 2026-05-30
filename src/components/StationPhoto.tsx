import { useEffect, useState } from "react";
import {
  STATION_IMAGE_PLACEHOLDER,
  getStationImageReloadUrl,
} from "@/lib/stationImage";

export function StationPhoto({
  src: initialSrc,
  alt,
  className,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [src, setSrc] = useState(initialSrc);
  const [retried, setRetried] = useState(false);

  useEffect(() => {
    setSrc(initialSrc);
    setRetried(false);
  }, [initialSrc]);

  const handleError = () => {
    if (src === STATION_IMAGE_PLACEHOLDER) return;

    if (!retried && initialSrc !== STATION_IMAGE_PLACEHOLDER) {
      setRetried(true);
      setSrc(getStationImageReloadUrl(initialSrc));
      return;
    }

    setSrc(STATION_IMAGE_PLACEHOLDER);
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
