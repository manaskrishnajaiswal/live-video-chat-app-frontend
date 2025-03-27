import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const { room_id } = useParams();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  console.log("room_id => ", room_id);
  console.log("user_id => ", user_id);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    if (!user_id || ws.current) return;

    console.log(`🟢 Connecting WebSocket: userId=${user_id}`);
    setIsLoading(true);

    ws.current = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}?user_id=${user_id}`
    );

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsWsConnected(true);
      setIsLoading(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Received WebSocket message:", data);
      } catch (err) {
        console.error("⚠️ Error parsing WebSocket message:", err);
      }
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setIsLoading(false);
    };

    ws.current.onclose = (event) => {
      console.log(
        `⚠️ WebSocket closed (code: ${event.code}, reason: ${event.reason})`
      );
      setIsWsConnected(false);
      setIsLoading(false);
    };

    return () => {
      console.log("🛑 Closing WebSocket...");
      ws.current?.close();
      ws.current = null;
      setIsWsConnected(false);
    };
  }, [user_id]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-[20%] h-full bg-white"></div>
      <div className="w-[80%] h-full bg-black flex-row">
        <div className="w-full h-[10%] bg-gray-500"></div>
        <div className="w-full h-[90%] bg-gray-300"></div>
      </div>
    </div>
  );
};

export default Room;
