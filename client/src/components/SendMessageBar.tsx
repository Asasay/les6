import { Box, Button, TextField } from "@mui/material";
import { FormEventHandler, useState } from "react";
import { Message, socket } from "../App";

export function SendMessageBar({ inputTags }: { inputTags: Message["tags"] }) {
  const [input, setInput] = useState("");
  const sendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit("chat message", {
        tags: inputTags,
        text: input,
      });
      setInput("");
    }
  };

  return (
    <Box component="form" onSubmit={sendMessage}>
      <TextField
        fullWidth
        id="input"
        autoComplete="off"
        label="Message"
        variant="filled"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        InputProps={{ endAdornment: <Button type="submit">Send</Button> }}
      />
    </Box>
  );
}
