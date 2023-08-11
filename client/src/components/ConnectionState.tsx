import { Grid, Typography } from "@mui/material";

export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <Grid item component={Typography} xs={12} textAlign={"center"}>
      Connection state: {isConnected ? "connected" : "disconnected"}
    </Grid>
  );
}
