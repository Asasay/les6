import { Button, Grid } from "@mui/material";
import { socket } from "../App";

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <Grid item component={Button} onClick={connect} xs={6}>
        Connect
      </Grid>
      <Grid item component={Button} onClick={disconnect} xs={6}>
        Disconnect
      </Grid>
    </>
  );
}
