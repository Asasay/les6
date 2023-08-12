import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <Grid2 component={Typography} xs={12} textAlign={"center"}>
      Connection state: {isConnected ? "connected" : "disconnected"}
    </Grid2>
  );
}
