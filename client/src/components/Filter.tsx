import { Box, Chip, Typography } from "@mui/material";
import { Message } from "../App";
import { Dispatch } from "react";

const Filter = ({
  availableTags,
  tagFilter,
  setTagFilter,
}: {
  availableTags: Message["tags"];
  tagFilter: Message["tags"];
  setTagFilter: Dispatch<React.SetStateAction<Message["tags"]>>;
}) => {
  return (
    <>
      <Typography sx={{ mb: 1 }}>Filters:</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          overflow: "scroll",
          rowGap: 1,
        }}
      >
        {availableTags.map((tag, index) => (
          <Chip
            variant={tagFilter.includes(tag) ? "filled" : "outlined"}
            label={tag}
            key={index}
            onClick={() =>
              setTagFilter((prev) =>
                prev.includes(tag)
                  ? prev.filter((el) => el !== tag)
                  : [...prev, tag]
              )
            }
          />
        ))}
      </Box>
    </>
  );
};

export default Filter;
