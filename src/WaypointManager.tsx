import { Dispatch, SetStateAction } from "react";
import { IWaypoint } from "./App";
import { produce } from "immer";
import { PredefinedVehicleProfile } from "./clients-data-api/typescript";
import { Box, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

export function WaypointManager(props:{profile: PredefinedVehicleProfile, waypoints: IWaypoint[], setWaypoints: Dispatch<SetStateAction<IWaypoint[]>>}){

    function deleteClick(id: string){props.setWaypoints(produce(props.waypoints, draft => draft.filter(w=>w.id !== id)))}

    if(props.waypoints.length === 0){
        return null
    }

    return <Box sx={{m:1}}>
        <List>{props.waypoints.map((w,i)=><WaypointSettings key={w.id} profile={props.profile} waypoint={w} index={i} deleteClick={deleteClick} />)}</List>
    </Box>
}

export function WaypointSettings(props:{profile: PredefinedVehicleProfile, waypoint: IWaypoint, index: number, deleteClick:(id: string)=>void}){
    return <ListItem>
        <ListItemIcon>
            <LocationOnIcon />
        </ListItemIcon>
        <ListItemText primary={`Waypoint n°${props.index}`} />
        <Button variant="outlined" onClick={(e)=>props.deleteClick(props.waypoint.id)}>Remove</Button>
    </ListItem>
}