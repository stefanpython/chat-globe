import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(cookies.get("chat-room"));
  const [visitedRooms, setVisitedRooms] = useState(
    cookies.get("visited-rooms") || []
  );

  const roomInputRef = useRef(null);

  // Keep user in same room if page refresh using cookies
  useEffect(() => {
    if (room) {
      cookies.set("chat-room", room);
      setVisitedRooms((prevVisitedRooms) => {
        if (!prevVisitedRooms.includes(room)) {
          return [...prevVisitedRooms, room];
        }
        return prevVisitedRooms;
      });
    }
  }, [room]);

  // Enter chat room from pressing enter on keyboard
  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      setRoom(roomInputRef.current.value);
    }
  };

  if (!isAuth) {
    return (
      <div className="App">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  const leaveRoom = () => {
    setRoom(null);
    cookies.set("chat-room", "");
  };

  const handleVisitedRoomClick = (roomName) => {
    setRoom(roomName);
  };

  return (
    <div>
      {room ? (
        <div>
          <Chat room={room} />
          <button className="leave--room--button" onClick={leaveRoom}>
            Leave room
          </button>
        </div>
      ) : (
        <div className="room">
          <label>Enter Room Name:</label>
          <input ref={roomInputRef} onKeyDown={handleInputKeyDown} />
          <button onClick={() => setRoom(roomInputRef.current.value)}>
            Enter Chat
          </button>
          <div className="visited--rooms">
            <h3>Visited Rooms:</h3>
            {visitedRooms.map((visitedRoom) => (
              <div
                key={visitedRoom}
                className="visited--room"
                onClick={() => handleVisitedRoomClick(visitedRoom)}
              >
                {visitedRoom}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
