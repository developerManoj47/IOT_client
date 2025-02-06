import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import VideoComponent from "../../components/videoComponent";

const Video = () => {
  return (
    <Box component="section">
      <Typography variant="h2">Live video</Typography>
      <VideoComponent width={"50%"} />
    </Box>
  );
};

export default Video;
