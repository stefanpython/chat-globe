import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { uid } from "uid";

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messageRef = collection(db, "messages"); // Reference which firestore database collection

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
    if (newMessage === "") return;

    // Create object for each message with multiple parameters and add it to collection
    await addDoc(messageRef, {
      text: newMessage,
      created: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room,
      id: uid(),
    });

    setNewMessage("");
  };

  return (
    <div className="chat--container">
      <div className="chat--header">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div>
        {messages.map((message) => (
          <h1 key={message.id}>{message.text}</h1>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new--message">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          className="new--message--input"
          placeholder="Type your message here..."
          value={newMessage}
        />
        <button type="submit" className="send--button">
          Send
        </button>
      </form>
    </div>
  );
};
