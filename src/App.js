import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./config/firebase";

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

  useEffect(() => {
    cookies.set("visited-rooms", visitedRooms);
  }, [visitedRooms]);

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

  const handleVisitedRoomDelete = (roomName) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete item?"
    );
    if (confirmDelete) {
      setVisitedRooms((prevVisitedRooms) =>
        prevVisitedRooms.filter((visitedRoom) => visitedRoom !== roomName)
      );
    }

    cookies.set(
      "visited-rooms",
      visitedRooms.filter((visitedRoom) => visitedRoom !== roomName)
    );
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      cookies.set("auth-token", "");
      cookies.set("chat-room", "");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {room ? (
        <div>
          <Chat room={room} />
          <button className="leave--room--button" onClick={leaveRoom}>
            Leave room
          </button>
        </div>
      ) : (
        <div className="app--container">
          <div className="app--content">
            <div className="room--container">
              <label>Enter Room Name:</label>
              <input
                className="room--input"
                ref={roomInputRef}
                onKeyDown={handleInputKeyDown}
              />
              <button
                className="enter--button"
                onClick={() => setRoom(roomInputRef.current.value)}
              >
                Enter Chat
              </button>

              <div className="visited--rooms">
                <h3 className="visited--title">Active Rooms:</h3>
                <hr />
                {visitedRooms.map((visitedRoom) => (
                  <div key={visitedRoom} className="visited--room">
                    <span
                      className="room--name"
                      onClick={() => handleVisitedRoomClick(visitedRoom)}
                    >
                      {visitedRoom}
                    </span>

                    <button
                      className="delete--button"
                      onClick={() => handleVisitedRoomDelete(visitedRoom)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <button className="logout--button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
