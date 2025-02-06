import React, { useEffect, useRef } from "react";

const VideoComponent = ({ width }) => {
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
    <div style={{ width: `${width}` }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "600px",
          height: "300px",
          border: "1px solid black",
          borderRadius: "10px",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default VideoComponent;
