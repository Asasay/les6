import { List, ListItem, Typography } from "@mui/material";
import { forwardRef } from "react";
import { Message } from "../App";
import { red } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type Props = {
  messages: Message[];
};
export const MessagesList = forwardRef<HTMLUListElement, Props>(
  ({ messages }, ref) => {
    return (
      <Grid2
        xs={12}
        container
        component={List}
        ref={ref}
        id="messages"
        sx={{
          overflow: "scroll",
        }}
      >
        {messages.map((m, i) => (
          <ListItem key={i} sx={{ flexWrap: "wrap" }}>
            {m.tags.map((t, i) => (
              <Typography key={i + 50} color={red[300]}>
                #{t}&nbsp;
              </Typography>
            ))}
            <Typography>{m.text}</Typography>
          </ListItem>
        ))}
      </Grid2>
    );
  }
);
