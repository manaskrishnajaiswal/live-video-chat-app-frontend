import { useParams, useSearchParams } from "react-router-dom";
const Room = () => {
  const { room_id } = useParams();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");
  console.log("room_id => ", room_id);
  console.log("user_id => ", user_id);
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
