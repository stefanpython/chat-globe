import { useState } from "react";

export const Chat = () => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat--container">
      <form onSubmit={handleSubmit} className="new--message">
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          className="new--message--input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send--button">
          Send
        </button>
      </form>
    </div>
  );
};
