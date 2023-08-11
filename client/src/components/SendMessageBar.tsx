import { Button, Grid, TextField } from "@mui/material";
import { FormEventHandler, useState } from "react";
import { socket } from "../App";

export function SendMessageBar() {
  const [input, setInput] = useState("");
  const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit("chat message", {
        tags: ["dd", "asd"],
        text: input,
      });
      setInput("");
    }
  };

  return (
    <Grid container alignItems="center" component="form" onSubmit={sendMessage}>
      <Grid item xs>
        <TextField
          fullWidth
          id="input"
          autoComplete="off"
          label="Message"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Grid>
      <Grid item xs="auto">
        <Button type="submit">Send</Button>
      </Grid>
    </Grid>
  );
}
