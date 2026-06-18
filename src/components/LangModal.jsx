import { motion, AnimatePresence } from 'framer-motion';

export default function LangModal({ isOpen, onClose, currentLang, onChangeLang }) {
  const languages = [
    { code: "en", name: "English (Global)" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "ja", name: "日本語" },
    { code: "zh-CN", name: "中文" }
  ];

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
            className="modal-content lang-modal-content"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={onClose} aria-label="Close language selector">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="modal-title" style={{ fontSize: '22px', marginBottom: '20px' }}>Select Region & Language</h3>
            
            <div className="lang-grid">
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  className={`lang-btn ${currentLang === lang.name ? 'active' : ''}`}
                  onClick={() => {
                    onChangeLang(lang.name, lang.code);
                    onClose();
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
