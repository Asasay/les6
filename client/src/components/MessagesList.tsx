import { List, ListItem } from "@mui/material";
import { forwardRef } from "react";
import { Message } from "../App";

type Props = {
  messages: Message[];
};
export const MessagesList = forwardRef<HTMLUListElement, Props>(
  ({ messages }, ref) => {
    return (
      <List
        ref={ref}
        id="messages"
        sx={{
          overflow: "scroll",
        }}
      >
        {messages.map((m, i) => (
          <ListItem key={i}>{`Tags: ${m.tags} text:${m.text}`}</ListItem>
        ))}
      </List>
    );
  }
);
