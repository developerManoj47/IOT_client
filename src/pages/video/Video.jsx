import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

const Video = () => {
  const canvasRef = useRef(null);
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  // console.log("websocket url :", websocketUrl);
  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    // Send join-room request once the connection is open
    ws.onopen = () => {
      const roomId = "my-room"; // check for validation
      ws.send(JSON.stringify({ type: "join-room", roomId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "video-frame") {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = `data:image/jpeg;base64,${data.frame}`;
      }
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);
  return (
    <div>
      <Typography variant="h2">Live video</Typography>
      <canvas ref={canvasRef} style={{ width: "100%" }} />
    </div>
  );
};

export default Video;
