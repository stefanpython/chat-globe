import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(cookies.get("chat-room"));

  const roomInputRef = useRef(null);

  // Keep user in same room if page refresh using cookies
  useEffect(() => {
    if (room) {
      cookies.set("chat-room", room);
    }
  }, [room]);

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

  return (
    <div>
      {room ? (
        <div>
          <Chat room={room} />
          <button onClick={leaveRoom}>Leave room</button>
        </div>
      ) : (
        <div className="room">
          <label>Enter Room Name:</label>
          <input ref={roomInputRef} />
          <button onClick={() => setRoom(roomInputRef.current.value)}>
            Enter Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
