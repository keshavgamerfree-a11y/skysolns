import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutDirector({ content }) {
  const [activeImg, setActiveImg] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  if (!content) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoomScale(1);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Page Header */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <a href="/">Home</a> / About Us / <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>About The Director</span>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '60px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '60px', alignItems: 'flex-start' }}>
            
            {/* Left Column: Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="who-image-container"
              style={{ padding: '12px', justifySelf: 'stretch' }}
            >
              <img
                src={content.image || '/logo.jpg'}
                alt={content.name}
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '4px', filter: 'grayscale(5%)' }}
              />
              
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.linkedin && (
                  <a
                    href={content.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '13px', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                )}
                {content.contact && (
                  <a
                    href={`mailto:${content.contact}`}
                    className="btn btn-primary"
                    style={{ fontSize: '13px', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Contact Director
                  </a>
                )}
              </div>
            </motion.div>

            {/* Right Column: Information */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div>
                <span className="section-meta" style={{ fontSize: '11px' }}>Leadership Profile</span>
                <h1 style={{ fontSize: '38px', fontWeight: '600', color: 'var(--text-primary)', margin: '8px 0 4px 0', letterSpacing: '-0.02em' }}>
                  {content.name}
                </h1>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--accent-blue)', margin: 0 }}>
                  {content.designation}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>Biography</h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.75', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {content.biography}
                </p>
              </div>

              {content.achievements && content.achievements.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>Key Achievements & Recognitions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    {content.achievements.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-purple-light)',
                          color: 'var(--accent-purple)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          ✓
                        </span>
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {content.gallery && content.gallery.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--bg-primary)', padding: '60px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="section-meta" style={{ fontSize: '11px' }}>Gallery Showcase</span>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>Director's Album & Events</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {content.gallery.map((imgUrl, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: 'var(--bg-white)',
                    border: '1px solid var(--border-color)',
                    padding: '10px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'zoom-in',
                    borderRadius: '4px'
                  }}
                  onClick={() => {
                    setActiveImg(imgUrl);
                    setZoomScale(1);
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Event Portrait ${index + 1}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '2px' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Zoomable Image Lightbox */}
      <AnimatePresence>
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImg(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(11, 15, 25, 0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            {/* Toolbar */}
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                gap: '12px',
                zIndex: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={handleZoomOut} 
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Zoom Out"
              >
                ➖
              </button>
              <button 
                onClick={handleResetZoom} 
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Actual Size"
              >
                1:1
              </button>
              <button 
                onClick={handleZoomIn} 
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Zoom In"
              >
                ➕
              </button>
              <button 
                onClick={() => setActiveImg(null)} 
                style={{ backgroundColor: 'var(--accent-purple)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Photo viewport */}
            <div style={{ overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <motion.img
                src={activeImg}
                alt="Director portrait zoom"
                style={{
                  maxHeight: '85vh',
                  maxWidth: '85vw',
                  objectFit: 'contain',
                  transform: `scale(${zoomScale})`,
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
