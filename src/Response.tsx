import { Box, Typography } from "@mui/material";
import { RouteResponse } from "./clients-routing-api/typescript";
import { IWaypoint } from "./App";

export function Response(props:{routeResponse: RouteResponse | undefined, waypoints: IWaypoint[]}){
    
    if(props.waypoints.length < 2 || !props.routeResponse){
        return null
    }

    return <Box sx={{m:1}}>
        <Typography>Distance: {props.routeResponse.distance} m</Typography>
        <Typography>Travel time: {props.routeResponse.travelTime} s</Typography>
    </Box>
}