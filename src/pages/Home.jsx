import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    const roomId = uuidv4().slice(0, 6);
    await setDoc(doc(db, "rooms", roomId), {
      createdAt: serverTimestamp(),
    });
    navigate(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="home-wrapper">
      
      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand-container" onClick={() => navigate("/")}>
          <img src="/logo.svg" alt="Vapour Logo" className="brand-logo" />
        </div>

        <nav>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>
            Anonymous Conversations.
            <br />
            <span className="gradient-text">No Trace.</span>
          </h1>

          <p>
            Private rooms that dissolve into vapour the moment the conversation ends.
          </p>

          <div className="cta-area">
            <button onClick={createRoom} className="cta-primary">
              Create Private Room
            </button>

            <div className="join-area">
              <input
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button onClick={joinRoom}>Join</button>
            </div>
          </div>
        </motion.div>

        <div className="hero-orb"></div>
      </section>

      {/* FOOTER */}
      <footer className="vapour-footer">
        <div className="footer-inner">

          <div className="footer-left">
            <h3 className="footer-brand">Vapour</h3>
            <p className="footer-copy">
              © {new Date().getFullYear()} Vapour. All rights reserved.
            </p>
          </div>

          <div className="footer-right">
            <a
              href="https://github.com/rohan1275"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <i className="fab fa-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/rohanmishra12"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <i className="fab fa-linkedin"></i>
            </a>

            <a
              href="mailto:misharohan1275@gmail.com"
              className="footer-icon"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}