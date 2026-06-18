import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  
  const suggestions = [
    "Dissolution Testing Systems",
    "FDA Validation Audits",
    "Bioreactor Calibration",
    "Gas Chromatography Columns",
    "Clean Room Compliance",
    "Spectrophotometer Accessories"
  ];

  const handleSuggestionClick = (tag) => {
    setQuery(tag);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content search-modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={onClose} aria-label="Close search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="search-input-wrapper">
              <svg className="search-icon-big" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="search-input"
                placeholder="Search products, services, compliance papers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="search-suggestions">
              <h4 className="suggestions-title">Trending Researches</h4>
              <div className="suggestion-tags">
                {suggestions.map((tag, idx) => (
                  <button 
                    key={idx} 
                    className="suggestion-tag"
                    onClick={() => handleSuggestionClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
