import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");

  const messageRef = collection(db, "messages"); // Reference which firestore database collection

  // Listen for new messages
  useEffect(() => {
    const queryMessages = query(messageRef, where("room", "==", room));
    onSnapshot(queryMessages, (snapshot) => {
      console.log("IT WORKS NEW MESSAGE");
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    // Create object for each message with multiple parameters and add it to collection
    await addDoc(messageRef, {
      text: newMessage,
      created: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room,
    });

    setNewMessage("");
  };

  return (
    <div className="chat--container">
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
