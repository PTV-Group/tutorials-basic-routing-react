import { useEffect, useRef, useState } from "react";
import { MapboxMap } from "./MapboxMap";
import {
  BASE_PATH,
  Configuration,
  PolylineMapType,
  Results,
  RouteResponse,
  RoutingApi,
} from "./clients-routing-api/typescript";
import { RequestParameter } from "./RequestParameter";
import { Response } from "./Response";
import { WaypointManager } from "./WaypointManager";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { nanoid } from "nanoid";
import { PredefinedVehicleProfiles } from "./clients-data-api/typescript";

export interface IWaypoint {
  latitude: number;
  longitude: number;
  id: string;
}

export default function App(props: {
  vehicleProfiles: PredefinedVehicleProfiles;
}) {
  const routingApi = useRef(
    new RoutingApi(
      new Configuration({
        apiKey: import.meta.env.VITE_API_KEY,
        basePath: import.meta.env.VITE_API_KEY
          ? BASE_PATH
          : "https://api.myptv.com/routing/v1",
      })
    )
  );
  const [vehicleProfile, setVehicleProfile] = useState<string>("EUR_TRUCK_40T");
  const [routeResponse, setRouteResponse] = useState<RouteResponse>();
  const [waypoints, setWaypoints] = useState<IWaypoint[]>([
    {
      latitude: 49.067997655698235,
      longitude: 8.281971508594154,
      id: nanoid(),
    },
    { latitude: 49.13093879586563, longitude: 8.491398388477364, id: nanoid() },
    { latitude: 48.98470298479353, longitude: 8.595768505663784, id: nanoid() },
    { latitude: 48.91841806102727, longitude: 8.406254345507477, id: nanoid() },
  ]);

  const reset = () => {
    setWaypoints([]);
    setRouteResponse(undefined);
  };

  const profile = props.vehicleProfiles.profiles.find(
    (p) => p.name === vehicleProfile
  )!;

  useEffect(() => {
    calculateRoute();
  }, [waypoints, vehicleProfile]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "20%", p: 2, zIndex: 1 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Parameters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RequestParameter
              vehicleProfiles={props.vehicleProfiles}
              vehicleProfile={vehicleProfile}
              setVehicleProfile={setVehicleProfile}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Waypoints</Typography>
            <Button sx={{ ml: 2 }} variant="outlined" onClick={reset}>
              Reset
            </Button>
          </AccordionSummary>
          <AccordionDetails>
            <WaypointManager
              waypoints={waypoints}
              setWaypoints={setWaypoints}
              profile={profile}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Response routeResponse={routeResponse} waypoints={waypoints} />
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          position: "absolute",
          gridArea: "map",
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
        <MapboxMap
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          routeResponse={routeResponse}
          setRouteResponse={setRouteResponse}
          vehicleProfile={vehicleProfile}
        />
      </Box>
    </Box>
  );

  async function calculateRoute() {
    if (waypoints.length >= 2) {
      const response = await routingApi.current.calculateRoute({
        waypoints: waypoints.map((w) => `${w.latitude},${w.longitude}`),
        results: [Results.POLYLINE],
        profile: vehicleProfile,
        options: {
          polylineMapType: PolylineMapType.VECTOR
        }
      });
      setRouteResponse(response);
    }
  }
}
