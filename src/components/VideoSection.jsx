import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="section alt-bg" id="corporate-video" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="container">
        <div className="section-header-centered">
          <span className="section-meta">Enterprise Presentation</span>
          <h2 className="section-title">Enabling Next-Generation Advancements</h2>
          <p className="section-subtitle">
            Take a brief look inside our global laboratories, advanced analytical platforms, and scientific processes.
          </p>
        </div>

        <motion.div 
          className="video-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => setIsPlaying(true)}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/video-thumb.png" 
            alt="Corporate Video Thumbnail" 
            className="video-thumb-img"
          />
          <div className="video-overlay">
            <button className="play-btn" aria-label="Play Corporate Video">
              <svg width="24" height="28" viewBox="0 0 24 28" fill="currentColor">
                <path d="M4 2.697v22.606c0 1.555 1.688 2.527 3.035 1.75l19.78-11.303c1.347-.77 1.347-2.73 0-3.5L7.035.947C5.688.17 4 1.142 4 2.697z"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPlaying(false)}
          >
            <motion.div 
              className="modal-content video-modal-content"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close-btn" 
                onClick={() => setIsPlaying(false)}
                aria-label="Close video"
                style={{ color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <video 
                className="video-player-iframe" 
                controls 
                autoPlay 
                src="https://assets.mixkit.co/videos/preview/mixkit-dolly-shot-of-laboratory-equipment-and-test-tubes-40019-large.mp4"
                poster="/video-thumb.png"
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
