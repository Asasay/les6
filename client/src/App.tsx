import { MessagesList } from "./components/MessagesList";
import { SendMessageBar } from "./components/SendMessageBar";
import { createRef, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { ConnectionState } from "./components/ConnectionState";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  CssBaseline,
  Grid,
  TextField,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { ConnectionManager } from "./components/ConnectionManager";
import useSocket from "./hooks/useSocket";

export const socket = io();

export type Message = {
  tags: string[];
  text: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesWindowRef = createRef<HTMLUListElement>();
  const isConnected = useSocket(setMessages);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    fetch(`/api/messages`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((messages) => setMessages(messages))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, []);

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
      <Grid
        container
        component="main"
        sx={{
          alignItems: "flex-end",
          p: "10px",
          height: "100vh",
          flexWrap: "nowrap",
          columnGap: "20px",
        }}
      >
        <CssBaseline />
        <Grid item container xs={2}>
          <ConnectionState isConnected={isConnected} />
          <ConnectionManager />
        </Grid>
        <Grid
          container
          item
          xs={10}
          sx={{
            flexDirection: "column",
            flexWrap: "nowrap",
            maxHeight: "100%",
            rowGap: "10px",
          }}
        >
          {!loading ? (
            <MessagesList ref={messagesWindowRef} messages={messages} />
          ) : (
            <CircularProgress />
          )}
          <Autocomplete
            multiple
            id="tags-filled"
            options={["asdasd", "s", "dsa", "asdas"]}
            freeSolo
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
                variant="filled"
                label="Tags:"
                placeholder="Tag your message"
              />
            )}
          />
          <SendMessageBar />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
