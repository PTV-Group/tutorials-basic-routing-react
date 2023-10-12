import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import {
  BASE_PATH,
  Configuration,
  VehicleProfilesApi,
} from "./clients-data-api/typescript";

const dataAPI = new VehicleProfilesApi(
  new Configuration({
    apiKey: import.meta.env.VITE_API_KEY,
    basePath: import.meta.env.VITE_API_KEY
      ? BASE_PATH
      : "https://api.myptv.com/data/v1",
  })
);

const defaultTheme = createTheme();

async function main() {
  const vehicleProfiles = await dataAPI.getPredefinedVehicleProfiles();

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <App vehicleProfiles={vehicleProfiles} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

main();
