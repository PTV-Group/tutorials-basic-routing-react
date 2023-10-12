import Map, {
  Layer,
  MapLayerMouseEvent,
  Marker,
  MarkerDragEvent,
  Source,
} from "react-map-gl";
import { RouteResponse } from "./clients-routing-api/typescript";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { produce } from "immer";
import { IWaypoint } from "./App";
import { nanoid } from "nanoid";
import { getMapStyle, initialMapStyle } from "./getMapStyle";

// Initializes to Karlsruhe
const initViewport = {
  longitude: 8.4055677,
  latitude: 49.0070036,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

// use the standard map style provided by PTV
const MAP_STYLE_URL =
  "https://vectormaps-resources.myptv.com/styles/latest/standard.json";

export function MapboxMap(props: {
  waypoints: IWaypoint[];
  setWaypoints: Dispatch<SetStateAction<IWaypoint[]>>;
  vehicleProfile: string;
  routeResponse: RouteResponse | undefined;
  setRouteResponse: Dispatch<SetStateAction<RouteResponse | undefined>>;
}) {
  const [mapStyle, setMapStyle] = useState<mapboxgl.Style>(initialMapStyle);

  useEffect(() => {
    getMapStyle(MAP_STYLE_URL).then(setMapStyle);
  }, []);

  async function onMapClick(e: MapLayerMouseEvent) {
    const wp = props.waypoints.slice();
    wp.push({ latitude: e.lngLat.lat, longitude: e.lngLat.lng, id: nanoid() });
    props.setWaypoints(wp);
  }

  function onDragEnd(e: MarkerDragEvent, i: number) {
    const wp = produce(props.waypoints, (draft) => {
      draft[i].latitude = e.lngLat.lat;
      draft[i].longitude = e.lngLat.lng;
    });
    props.setWaypoints(wp);
  }

  const getTransformRequest = useCallback((url: string) => {
    if (import.meta.env.VITE_API_KEY) {
      return { url: url + "?apiKey=" + import.meta.env.VITE_API_KEY };
    }
    return { url: url, headers: {} };
  }, []);

  return (
    <Map
      style={{ height: "100%", width: "100%" }}
      initialViewState={initViewport}
      mapStyle={mapStyle}
      transformRequest={getTransformRequest}
      onClick={onMapClick}
    >
      {props.waypoints.map((w, i) => (
        <Marker
          key={i}
          latitude={w.latitude}
          longitude={w.longitude}
          draggable={true}
          onDragEnd={(e) => onDragEnd(e, i)}
          color="#ff414b"
        />
      ))}
      {props.routeResponse?.polyline && props.waypoints.length >= 2 ? (
        <Source
          id="polyline"
          type="geojson"
          data={JSON.parse(props.routeResponse.polyline)}
        >
          <Layer
            type="line"
            paint={{ "line-color": "#3353c8", "line-width": 4 }}
          />
        </Source>
      ) : null}
    </Map>
  );
}
