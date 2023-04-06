import "./Chat.css";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uid } from "uid";
import EmojiPicker from "emoji-picker-react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Chat = (props) => {
  const { room, setRoom } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // File upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Emoji use
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  // Reference which firestore database collection
  const messageRef = collection(db, "messages");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Listen for new messages with onSnapShoot()
  useEffect(() => {
    const queryMessages = query(
      messageRef,
      where("room", "==", room),
      orderBy("created", "asc")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data() });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent user to send empty message
    if (newMessage === "" && !selectedFile) return;

    // Upload the selected image to Firebase Storage
    let imageUrl = null;
    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name + uid()}`);
      await uploadBytes(storageRef, selectedFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Send the message and the image URL to Firebase Firestore
    const messageData = {
      text: newMessage,
      created: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room,
      id: uid(),
      time: new Date().toLocaleTimeString(),
      // status: !auth.currentUser.displayName === false ? "online" : "offline",
    };

    if (selectedEmoji) {
      messageData.emoji = selectedEmoji;
    }

    if (imageUrl) {
      messageData.imageUrl = imageUrl;
    }

    await addDoc(collection(db, "messages"), messageData);

    setNewMessage("");
    setSelectedFile(null);
    setPickerVisible(false);

    e.target.reset();
  };

  const leaveRoom = () => {
    setRoom(null);
    cookies.set("chat-room", "");
  };

  return (
    <div className="chat--container">
      <div className="chat--header">
        <h1 className="chat--welcome">Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div className="chat--messages">
        {messages.map((message) => (
          <div
            className={
              message.user === auth.currentUser.displayName
                ? "chat--message-right"
                : "chat--message-left"
            }
            key={uid()}
          >
            <span className="chat--username">
              {message.user === auth.currentUser.displayName
                ? "You"
                : message.user}
              :{" "}
            </span>
            <span className="chat--text">{message.text}</span>
            {message.imageUrl && (
              <>
                <br />
                <img
                  className="chat--images"
                  src={message.imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: 300 }}
                  onLoad={() => window.scrollTo(0, document.body.scrollHeight)}
                />
              </>
            )}
            <span className="chat--time">{message.time}</span>
          </div>
        ))}
      </div>

      <div className="chat--input">
        <form onSubmit={handleSubmit} className="new--message">
          <button
            className="emoji--button"
            onClick={() => setPickerVisible(!pickerVisible)}
          >
            😊
          </button>

          {pickerVisible && (
            <EmojiPicker
              onEmojiClick={(emojiObject, event) => {
                setNewMessage(newMessage + emojiObject.emoji);
                setSelectedEmoji(emojiObject.emoji);
              }}
            />
          )}
          <textarea
            onChange={(e) => setNewMessage(e.target.value)}
            className="new--message--input"
            placeholder="Type your message here..."
            value={newMessage}
          />
          <label className="input--label" htmlFor="file--input">
            <input
              id="file--input"
              className="file--input"
              type="file"
              onChange={handleFileInputChange}
            />
            Upload
          </label>

          <button type="submit" className="send--button">
            Send
          </button>
        </form>

        <button className="leave--room--button" onClick={leaveRoom}>
          Leave room
        </button>
      </div>
    </div>
  );
};
