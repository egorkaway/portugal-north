import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { theme } from '@/constants/theme';

export type OsmMapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type OsmMapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  size: number;
  visited?: boolean;
};

export type OsmWebMapHandle = {
  animateToRegion: (region: OsmMapRegion, durationMs?: number) => void;
  setUserLocation: (coords: { lat: number; lng: number } | null) => void;
};

type Props = {
  style?: StyleProp<ViewStyle>;
  initialRegion: OsmMapRegion;
  markers: OsmMapMarker[];
  hideVisited?: boolean;
  darkMode?: boolean;
  onMarkerPress?: (id: string) => void;
  onMapPress?: () => void;
};

function regionToZoom(latitudeDelta: number): number {
  const zoom = Math.round(Math.log2(360 / Math.max(latitudeDelta, 0.01)));
  return Math.max(4, Math.min(16, zoom));
}

function buildHtml(options: {
  initialRegion: OsmMapRegion;
  markers: OsmMapMarker[];
  darkMode: boolean;
}): string {
  const { initialRegion, markers, darkMode } = options;
  const zoom = regionToZoom(initialRegion.latitudeDelta);
  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Keep payload compact — hundreds of stations.
  const markerPayload = markers.map((marker) => [
    marker.id,
    Number(marker.lat.toFixed(5)),
    Number(marker.lng.toFixed(5)),
    marker.color,
    marker.size,
  ]);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; height: 100%; width: 100%; background: ${darkMode ? '#1a1a1a' : '#e8eef2'}; }
    .leaflet-control-attribution { font-size: 10px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const markersData = ${JSON.stringify(markerPayload)};
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
    }).setView([${initialRegion.latitude}, ${initialRegion.longitude}], ${zoom});

    L.tileLayer(${JSON.stringify(tileUrl)}, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    const byId = Object.create(null);
    const halos = Object.create(null);
    const visitedRingColor = ${JSON.stringify(theme.primary)};

    function post(type, payload) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
    }

    function toSet(ids) {
      const set = Object.create(null);
      for (const id of ids) set[id] = 1;
      return set;
    }

    function addMarkers() {
      layer.clearLayers();
      for (const key of Object.keys(halos)) delete halos[key];
      for (const item of markersData) {
        const [id, lat, lng, color, size] = item;
        const radius = Math.max(4, Number(size) || 7);
        const marker = L.circleMarker([lat, lng], {
          radius: radius,
          color: '#ffffff',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.95,
        });
        marker.on('click', function (event) {
          L.DomEvent.stopPropagation(event);
          post('markerPress', id);
        });
        marker.addTo(layer);
        byId[id] = marker;
      }
    }

    window.__applyMarkerState = function (visitedIds, hiddenIds) {
      const visitedSet = toSet(visitedIds || []);
      const hiddenSet = toSet(hiddenIds || []);
      for (const id of Object.keys(byId)) {
        const marker = byId[id];
        if (hiddenSet[id]) {
          if (layer.hasLayer(marker)) layer.removeLayer(marker);
          if (halos[id]) {
            layer.removeLayer(halos[id]);
            delete halos[id];
          }
          continue;
        }
        if (!layer.hasLayer(marker)) marker.addTo(layer);
        if (visitedSet[id]) {
          if (!halos[id]) {
            const latlng = marker.getLatLng();
            const radius = marker.options.radius || 7;
            halos[id] = L.circleMarker(latlng, {
              radius: radius + 4,
              color: visitedRingColor,
              weight: 2,
              fill: false,
              interactive: false,
            }).addTo(layer);
          }
          marker.bringToFront();
        } else if (halos[id]) {
          layer.removeLayer(halos[id]);
          delete halos[id];
        }
      }
    };

    addMarkers();

    map.on('click', function () {
      post('mapPress', null);
    });

    let userMarker = null;
    window.__setUserLocation = function (lat, lng) {
      if (lat == null || lng == null) {
        if (userMarker) {
          map.removeLayer(userMarker);
          userMarker = null;
        }
        return;
      }
      if (!userMarker) {
        userMarker = L.circleMarker([lat, lng], {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#2563EB',
          fillOpacity: 1,
        }).addTo(map);
      } else {
        userMarker.setLatLng([lat, lng]);
      }
    };

    window.__animateTo = function (lat, lng, zoomLevel, durationMs) {
      map.flyTo([lat, lng], zoomLevel || map.getZoom(), {
        duration: Math.max(0.2, (durationMs || 500) / 1000),
      });
    };

    post('ready', null);
  </script>
</body>
</html>`;
}

function markerCatalogKey(markers: OsmMapMarker[]): string {
  return markers
    .map(
      (marker) =>
        `${marker.id}|${marker.lat.toFixed(5)}|${marker.lng.toFixed(5)}|${marker.color}|${marker.size}`,
    )
    .join('\n');
}

export const OsmWebMap = forwardRef<OsmWebMapHandle, Props>(function OsmWebMap(
  { style, initialRegion, markers, hideVisited = false, darkMode = false, onMarkerPress, onMapPress },
  ref,
) {
  const webRef = useRef<WebView>(null);
  const readyRef = useRef(false);

  const catalogKey = useMemo(() => markerCatalogKey(markers), [markers]);
  const visitedIds = useMemo(
    () => markers.filter((marker) => marker.visited).map((marker) => marker.id),
    [markers],
  );

  const html = useMemo(
    () => buildHtml({ initialRegion, markers, darkMode }),
    // Rebuild only when tiles or the station catalog change — not visited/filter state.
    [initialRegion.latitude, initialRegion.longitude, initialRegion.latitudeDelta, catalogKey, darkMode],
  );

  const inject = useCallback((script: string) => {
    webRef.current?.injectJavaScript(`${script}; true;`);
  }, []);

  const applyMarkerState = useCallback(
    (nextVisitedIds: string[], nextHideVisited: boolean) => {
      const hiddenIds = nextHideVisited ? nextVisitedIds : [];
      inject(
        `window.__applyMarkerState && window.__applyMarkerState(${JSON.stringify(nextVisitedIds)}, ${JSON.stringify(hiddenIds)})`,
      );
    },
    [inject],
  );

  useEffect(() => {
    readyRef.current = false;
  }, [html]);

  useEffect(() => {
    if (readyRef.current) applyMarkerState(visitedIds, hideVisited);
  }, [applyMarkerState, hideVisited, visitedIds]);

  useImperativeHandle(
    ref,
    () => ({
      animateToRegion(region, durationMs = 500) {
        inject(
          `window.__animateTo && window.__animateTo(${region.latitude}, ${region.longitude}, ${regionToZoom(region.latitudeDelta)}, ${durationMs})`,
        );
      },
      setUserLocation(coords) {
        if (!coords) {
          inject('window.__setUserLocation && window.__setUserLocation(null, null)');
          return;
        }
        inject(
          `window.__setUserLocation && window.__setUserLocation(${coords.lat}, ${coords.lng})`,
        );
      },
    }),
    [inject],
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          payload?: string | null;
        };
        if (message.type === 'ready') {
          readyRef.current = true;
          applyMarkerState(visitedIds, hideVisited);
          return;
        }
        if (message.type === 'markerPress' && typeof message.payload === 'string') {
          onMarkerPress?.(message.payload);
          return;
        }
        if (message.type === 'mapPress') {
          onMapPress?.();
        }
      } catch {
        // Ignore malformed bridge messages.
      }
    },
    [applyMarkerState, hideVisited, onMapPress, onMarkerPress, visitedIds],
  );

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
