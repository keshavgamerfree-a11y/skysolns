import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ content, onOpenContact }) {
  const title = content?.title || '<span style="color: #136B36">SKY LIFE SCIENCES</span> <span style="color: var(--accent-blue)">SOLUTIONS</span>';
  const desc = content?.desc || 'We provide exceptional analytical solutions to solve the toughest Research and Development challenges in Pharmaceutical, Biotech and Life sciences companies with a wide range of high quality, sustainability as well as innovative next-generation Laboratory products.';
  const btn1Text = content?.btn1Text || 'Explore Products';
  const btn1Link = content?.btn1Link || '#products';
  const btn2Text = content?.btn2Text || 'Contact Us';
  const btn2Link = content?.btn2Link || '#contact';
  const bgUrl = content?.bgUrl || '/hero-bg.png';
  const mediaType = content?.mediaType || 'video'; // 'video' | 'image' | 'slideshow'
  const mediaUrl = content?.mediaUrl || 'https://www.youtube.com/embed/r5ywq0hrWf0?si=whowPvpJ4gfUhv68';
  const slideshowImages = content?.slideshowImages || [];

  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (mediaType !== 'slideshow' || slideshowImages.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [mediaType, slideshowImages]);

  return (
    <section className="hero-sec">
      <div className="hero-bg-container">
        <img
          src={bgUrl}
          alt="Advanced Life Sciences Laboratory Background"
          className="hero-bg-img"
        />
        <div className="hero-bg-overlay"></div>
      </div>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--whitespace-xl)', position: 'relative', zIndex: '2' }}>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '1 1 500px', maxWidth: '620px' }}
        >
          <h1 
            className="hero-title" 
            style={{ fontSize: '46px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '20px' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="hero-desc" style={{ fontSize: '17px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {desc}
          </p>
          <div className="hero-actions" style={{ flexWrap: 'wrap', gap: '12px' }}>
            {btn1Link.startsWith('http') ? (
              <a href={btn1Link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                {btn1Text}
              </a>
            ) : (
              <a href={btn1Link} className="btn btn-primary">
                {btn1Text}
              </a>
            )}

            {btn2Link === '#contact' || btn2Link === '' ? (
              <button className="btn btn-secondary" onClick={onOpenContact}>
                {btn2Text}
              </button>
            ) : btn2Link.startsWith('http') ? (
              <a href={btn2Link} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                {btn2Text}
              </a>
            ) : (
              <a href={btn2Link} className="btn btn-secondary">
                {btn2Text}
              </a>
            )}

            {content?.catalogPdf && (
              <a
                href={content.catalogPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-catalog"
                style={{
                  backgroundColor: 'var(--accent-blue)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  gap: '8px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                VIEW COMPLETE PRODUCT CATALOG
              </a>
            )}
          </div>
        </motion.div>

        <motion.div
          className="hero-video"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '1 1 400px', maxWidth: '560px', width: '100%', aspectRatio: '16/9', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', position: 'relative' }}
        >
          {mediaType === 'image' && mediaUrl && (
            <img src={mediaUrl} alt="Hero Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}

          {mediaType === 'slideshow' && slideshowImages.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={slideIdx}
                src={slideshowImages[slideIdx]}
                alt={`Slideshow ${slideIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
              />
            </AnimatePresence>
          )}

          {mediaType === 'video' && mediaUrl && (
            (() => {
              const isYouTube = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be');
              const isVimeo = mediaUrl.includes('vimeo.com');
              if (isYouTube) {
                let embedUrl = mediaUrl;
                if (mediaUrl.includes('watch?v=')) {
                  embedUrl = mediaUrl.replace('watch?v=', 'embed/');
                } else if (mediaUrl.includes('youtu.be/')) {
                  const parts = mediaUrl.split('/');
                  const id = parts[parts.length - 1];
                  embedUrl = `https://www.youtube.com/embed/${id}`;
                }
                return (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ border: 'none', display: 'block' }}
                  ></iframe>
                );
              } else if (isVimeo) {
                return (
                  <iframe
                    src={mediaUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none', display: 'block' }}
                  ></iframe>
                );
              } else {
                return (
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                );
              }
            })()
          )}
        </motion.div>
      </div>
    </section>
  );
}
