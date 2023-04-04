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
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uid } from "uid";
import EmojiPicker from "emoji-picker-react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // File upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Emoji use
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

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

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      cookies.set("auth-token", "");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat--container">
      <div className="chat--header">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <span className="chat--username">{message.user}: </span>
            {message.text}
            {message.imageUrl && (
              <>
                <br />
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: 300 }}
                  onLoad={() => window.scrollTo(0, document.body.scrollHeight)}
                />
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setPickerVisible(!pickerVisible)}>😊</button>
      {pickerVisible && (
        <EmojiPicker
          onEmojiClick={(emojiObject, event) => {
            setNewMessage(newMessage + emojiObject.emoji);
            setSelectedEmoji(emojiObject.emoji);
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="new--message">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          className="new--message--input"
          placeholder="Type your message here..."
          value={newMessage}
        />
        <input
          className="file--input"
          type="file"
          onChange={handleFileInputChange}
        />
        <button type="submit" className="send--button">
          Send
        </button>
      </form>

      <button onClick={logout}>Logout</button>
    </div>
  );
};
