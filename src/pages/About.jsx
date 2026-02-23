import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">Vapour</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="about-hero">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Conversations.
          <br />
          <span className="gradient-text">
            That Disappear.
          </span>
        </motion.h1>

        <p>
          Vapour is a privacy-first anonymous chat platform
          where conversations exist temporarily — and vanish
          when the chat ends.
        </p>
      </section>

      {/* Features */}
      <section className="features-section">
        <FeatureCard
          title="Private Rooms"
          text="Each chat room is accessible only through a unique invite link or code."
        />
        <FeatureCard
          title="Ephemeral Messages"
          text="When the chat ends, the room and messages dissolve completely."
        />
        <FeatureCard
          title="Anonymous Identity"
          text="Users are assigned temporary usernames. No signup required."
        />
        <FeatureCard
          title="Real-Time Experience"
          text="Instant messaging, typing indicators, and smooth interactions."
        />
      </section>

      {/* Closing */}
      <section className="about-footer">
        <h2>
          Privacy isn’t a feature.
          <br />
          <span className="gradient-text">
            It’s the foundation.
          </span>
        </h2>
      </section>
    </motion.div>
  );
}

/* Feature Card Component */

function FeatureCard({ title, text }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}