import { MessagesList } from "./components/MessagesList";
import { SendMessageBar } from "./components/SendMessageBar";
import { createRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { ConnectionState } from "./components/ConnectionState";
import {
  Autocomplete,
  Box,
  Chip,
  CssBaseline,
  Divider,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { ConnectionManager } from "./components/ConnectionManager";
import useSocket from "./hooks/useSocket";
import useTheme from "./hooks/useTheme";
import Filter from "./components/Filter";

export const socket = io();

export type Message = {
  tags: string[];
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableTags, setAvailableTags] = useState<Message["tags"]>([]);
  const [inputTags, setInputTags] = useState<Message["tags"]>([]);
  const [tagFilter, setTagFilter] = useState<Message["tags"]>([]);
  const [filteredMessages, setfilteredMessages] = useState<Message[]>([]);
  const messagesWindowRef = createRef<HTMLUListElement>();
  const isConnected = useSocket(setMessages, setAvailableTags);

  const theme = useTheme();

  useEffect(() => {
    if (tagFilter.length == 0) setfilteredMessages(messages);
    else {
      const filtered = messages.filter((m) => {
        if (m.tags.length == 0) return true;
        else return tagFilter.some((t) => m.tags.includes(t));
      });
      setfilteredMessages(filtered);
    }
  }, [tagFilter, messages]);

  useEffect(() => {
    const messagesWindow = messagesWindowRef.current;
    if (!messagesWindow) return;
    if (
      messagesWindow.scrollHeight -
        messagesWindow.scrollTop -
        messagesWindow.clientHeight <
      300
    )
      messagesWindow.scrollTo(0, messagesWindow.scrollHeight);
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          display: "flex",
          height: "100vh",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            flex: 1,
            margin: 1,
          }}
        >
          <Filter
            availableTags={availableTags}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
          />
          <Divider flexItem variant="fullWidth" />
          <ConnectionState isConnected={isConnected} />
          <ConnectionManager />
        </Box>

        <Divider orientation="vertical" flexItem variant="fullWidth" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flex: 4,
            margin: 1,
          }}
        >
          <MessagesList ref={messagesWindowRef} messages={filteredMessages} />
          <Autocomplete
            multiple
            id="tags-filled"
            options={availableTags}
            freeSolo
            value={inputTags}
            onChange={(_, newValue) => {
              setInputTags(newValue);
            }}
            onFocus={() => socket.emit("get tags")}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags:"
                placeholder="Tag your message"
              />
            )}
          />
          <SendMessageBar inputTags={inputTags} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
