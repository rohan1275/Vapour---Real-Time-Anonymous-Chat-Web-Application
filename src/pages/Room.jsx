import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username] = useState(
    "User-" + Math.floor(Math.random() * 1000)
  );
  const [typingUser, setTypingUser] = useState(null);
  const [vaporize, setVaporize] = useState(false);

  /* ---------------- CHECK ROOM ---------------- */

  useEffect(() => {
    const checkRoom = async () => {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Room not found");
        navigate("/");
      }
    };

    checkRoom();

    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- TYPING LISTENER ---------------- */

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.typing && data.typing !== username) {
          setTypingUser(data.typing);
        } else {
          setTypingUser(null);
        }
      }
    });

    return () => unsub();
  }, [roomId, username]);

  /* ---------------- HANDLE TYPING ---------------- */

  const handleTyping = async () => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      typing: username,
    });

    setTimeout(async () => {
      await updateDoc(roomRef, {
        typing: null,
      });
    }, 1500);
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: message,
      username,
      createdAt: serverTimestamp(),
    });

    setMessage("");

    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      typing: null,
    });
  };

  /* ---------------- END CHAT ---------------- */

  const endChat = async () => {
    setVaporize(true);

    setTimeout(async () => {
      const messagesRef = collection(db, "rooms", roomId, "messages");
      const snapshot = await getDocs(messagesRef);

      for (const msg of snapshot.docs) {
        await deleteDoc(msg.ref);
      }

      await deleteDoc(doc(db, "rooms", roomId));

      navigate("/");
    }, 1200);
  };

  /* ---------------- FORMAT TIME ---------------- */

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className={`room-container ${vaporize ? "vaporize" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* HEADER */}
      <div className="room-header">
        <div className="room-title">Vapour Room</div>

        <div>
          <button className="secondary-btn">
            {username}
          </button>

          <button
            className="end-btn"
            onClick={endChat}
            style={{ marginLeft: 10 }}
          >
            End Chat
          </button>
        </div>
      </div>

      {/* CHAT BOX */}
      <div className="chat-box">
        {messages.map((msg) => {
          const isSelf = msg.username === username;

          return (
            <div
              key={msg.id}
              className={`message-row ${isSelf ? "self" : ""}`}
            >
              <div
                className={`message-bubble ${
                  isSelf ? "self" : "other"
                }`}
              >
                {!isSelf && (
                  <div className="username-label">
                    {msg.username}
                  </div>
                )}

                {msg.text}

                <div className="message-time">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}

        {typingUser && (
          <div className="typing-indicator">
            {typingUser} is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-input-container">
        <input
          className="chat-input"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
        />

        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </motion.div>
  );
}