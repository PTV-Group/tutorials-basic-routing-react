import { Dispatch,SetStateAction } from "react";
import { PredefinedVehicleProfiles } from "./clients-data-api/typescript";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";

export function RequestParameter(props:{vehicleProfiles: PredefinedVehicleProfiles, vehicleProfile: string, setVehicleProfile: Dispatch<SetStateAction<string>>}){

    return <Box sx={{m:1}}>
        <Grid container spacing={2}>
            <Grid item>
                <FormControl>
                    <InputLabel id="vehicle-profile-label">Vehicle Profile</InputLabel>
                    <Select id="vehicle-profile" labelId="vehicle-profile-label" label="Vehicle Profile" value={props.vehicleProfile} onChange={(e)=>props.setVehicleProfile(e.target.value)}>
                        {props.vehicleProfiles.profiles.map(p=><MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </Box>
}