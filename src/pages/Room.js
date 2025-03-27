import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const Room = () => {
  const { room_id } = useParams();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");

  console.log("room_id =>", room_id);
  console.log("user_id =>", user_id);

  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const ws = useRef(null);

  // WebSocket Connection Setup
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

        if (data?.action === "get-room-participants") {
          setParticipants(data.participants || []);
        }

        if (data?.action === "join-room") {
          setIsRoomJoined(true);
        }
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

  // Join Room when WebSocket is connected
  useEffect(() => {
    if (!room_id || !user_id || !isWsConnected || !ws.current) return;

    console.log(
      `🚀 Sending join-room request: userId=${user_id}, roomId=${room_id}`
    );
    ws.current.send(
      JSON.stringify({
        action: "join-room",
        user_id,
        room_id,
      })
    );
  }, [room_id, user_id, isWsConnected]);

  // Fetch Participants after joining the room
  useEffect(() => {
    if (!room_id || !user_id || !isWsConnected || !isRoomJoined || !ws.current)
      return;

    console.log("🚀 Sending get-room-participants request...");
    ws.current.send(
      JSON.stringify({
        action: "get-room-participants",
        room_id,
        user_id,
      })
    );
  }, [room_id, user_id, isWsConnected, isRoomJoined]);

  // Render Participants
  const renderParticipants = () => {
    if (participants.length === 0) {
      return <div className="p-4 text-gray-500">No participants yet.</div>;
    }

    return participants.map((participant) => (
      <div
        key={participant?.M?.user_id?.S}
        className="w-full h-20 bg-slate-400 flex items-center justify-center"
      >
        {participant?.M?.user_id?.S}
      </div>
    ));
  };

  return (
    <div className="w-full h-screen flex relative">
      {/* Screen Overlay for Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold z-50">
          Joining Room...
        </div>
      )}

      {/* Sidebar for Participants */}
      <div className="w-[20%] h-full bg-white flex flex-col">
        {renderParticipants()}
      </div>

      {/* Main Content Area */}
      <div className="w-[80%] h-full bg-black flex flex-col">
        <div className="w-full h-[10%] bg-gray-500"></div>
        <div className="w-full h-[90%] bg-gray-300"></div>
      </div>
    </div>
  );
};

export default Room;
