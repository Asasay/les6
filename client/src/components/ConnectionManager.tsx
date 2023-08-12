import { Button, Stack } from "@mui/material";
import { socket } from "../App";

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <Stack
      sx={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}
    >
      <Button onClick={connect}>Connect</Button>
      <Button onClick={disconnect}>Disconnect</Button>
    </Stack>
  );
}
