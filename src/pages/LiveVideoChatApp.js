import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import generateIID from "../utilities/utilities";

const LiveVideoChatApp = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (!userId || ws.current) return;

    console.log(`🟢 Connecting WebSocket: userId=${userId}`);
    ws.current = new WebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}?user_id=${userId}`
    );

    ws.current.onopen = () => console.log("✅ WebSocket connected");
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Received WebSocket message:", data);
        const joinRoom = data?.action == "join-room";
        if (joinRoom && roomId && userId) {
          navigate(`/room/${roomId}?user_id=${userId}`);
        }
      } catch (err) {
        console.error("⚠️ Error parsing WebSocket message:", err);
      }
    };
    ws.current.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.current.onclose = (event) =>
      console.log(
        `⚠️ WebSocket closed (code: ${event.code}, reason: ${event.reason})`
      );

    return () => {
      console.log("🛑 Closing WebSocket...");
      ws.current?.close();
      ws.current = null;
    };
  }, [userId]);

  useEffect(() => {
    if (!roomId || !ws.current) return;

    try {
      console.log("🚀 Sending create-room request...");
      ws.current.send(
        JSON.stringify({
          action: "create-room",
          room_id: roomId,
          user_id: userId,
        })
      );
    } catch (error) {
      console.error("❌ Error sending create-room request:", error);
    }
  }, [roomId]);

  const generateUserId = () => setUserId(`user-${generateIID()}`);
  const generateRoomId = () => setRoomId(`room-${generateIID()}`);
  const joinRoom = () => {
    if (ws.current && userId && roomId) {
      try {
        console.log(
          `🚀 Sending join-room request: userId=${userId}, roomId=${roomId}`
        );
        ws.current.send(
          JSON.stringify({
            action: "join-room",
            room_id: roomId,
            user_id: userId,
          })
        );
      } catch (error) {
        console.error("❌ Error sending join-room request:", error);
      }
    } else {
      console.warn(
        "⚠️ Cannot join room - WebSocket not connected or missing user/room ID"
      );
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-[60%] h-full bg-black"></div>
      <div className="w-[40%] h-full bg-gray-800 flex flex-col items-center justify-center gap-4">
        <div>
          {!userId && (
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-transform"
              onClick={generateUserId}
            >
              Generate User
            </button>
          )}
          <p className="text-white mt-2">{userId}</p>
        </div>
        <div>
          {userId && !roomId && (
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition-transform"
              onClick={generateRoomId}
            >
              Create Room
            </button>
          )}
          <p className="text-white mt-2">{roomId}</p>
        </div>
        <div>
          {userId && roomId && (
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-800 active:scale-95 transition-transform"
              onClick={joinRoom}
            >
              Join Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVideoChatApp;
