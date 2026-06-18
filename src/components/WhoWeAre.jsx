import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HighlightCard({ item, gradClass, onClick }) {
  const [mediaIdx, setMediaIdx] = useState(0);
  const touchStartX = useRef(0);
  const mediaItems = item.media && item.media.length > 0 ? item.media : [{ type: 'image', url: item.img }];

  useEffect(() => {
    if (mediaItems.length <= 1) return;
    const interval = setInterval(() => {
      setMediaIdx(prev => (prev + 1) % mediaItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setMediaIdx(prev => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setMediaIdx(prev => (prev + 1) % mediaItems.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setMediaIdx(prev => (prev + 1) % mediaItems.length);
      } else {
        setMediaIdx(prev => (prev - 1 + mediaItems.length) % mediaItems.length);
      }
    }
  };

  const activeMedia = mediaItems[mediaIdx];

  const getCardStyle = () => {
    if (item.gradientType === 'custom' && item.customGradient) {
      return { background: item.customGradient };
    }
    return {};
  };

  const getPresetClass = () => {
    if (item.gradientType === 'custom') return '';
    if (item.gradientType === 'preset-1') return 'card-grad-navy';
    if (item.gradientType === 'preset-2') return 'card-grad-green';
    if (item.gradientType === 'preset-3') return 'card-grad-slate';
    return gradClass; // fallback to random preset
  };

  return (
    <div
      className={`highlight-card ${getPresetClass()}`}
      style={getCardStyle()}
      onClick={onClick}
    >
      <div 
        className="highlight-card-img-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative' }}
      >
        {activeMedia.url ? (
          activeMedia.type === 'video' ? (
            <video
              src={activeMedia.url}
              muted
              loop
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={activeMedia.url}
              alt={item.title}
              className="highlight-card-img"
              draggable="false"
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}

        {mediaItems.length > 1 && (
          <>
            <button className="card-slideshow-arrow arrow-left" onClick={handlePrev}>‹</button>
            <button className="card-slideshow-arrow arrow-right" onClick={handleNext}>›</button>
            <div className="card-slideshow-dots">
              {mediaItems.map((_, dIdx) => (
                <span 
                  key={dIdx} 
                  className={`card-slideshow-dot ${dIdx === mediaIdx ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="highlight-card-content">
        {item.date && <span className="highlight-card-date">{item.date}</span>}
        <h4 className="highlight-card-title">{item.title}</h4>
        <p className="highlight-card-desc">{item.desc}</p>
      </div>
    </div>
  );
}

export default function WhoWeAre({ highlights: propHighlights, description, mode, profileImage }) {
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const animationFrameId = useRef(null);
  const isManualScrollingRef = useRef(false);
  const manualScrollTimeout = useRef(null);
  const CARD_WIDTH = 440; // px – matches card width + gap

  const pauseAutoScrollBriefly = () => {
    isManualScrollingRef.current = true;
    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 650);
  };

  const scrollPrev = () => {
    if (trackRef.current) {
      pauseAutoScrollBriefly();
      trackRef.current.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (trackRef.current) {
      pauseAutoScrollBriefly();
      trackRef.current.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
    }
  };

  const localHighlights = [
    {
      img: "/highlight-award.png",
      title: "India Pharma Leaders Award",
      desc: "Honored for contributions to pharmaceutical innovation and continuous manufacturing.",
      date: "March 2026"
    },
    {
      img: "/highlight-summit.png",
      title: "Agrochemicals R&D Summit 2026",
      desc: "Gold Partner participation alongside Zaiput Flow Technologies.",
      date: "April 2026"
    },
    {
      img: "/highlight-chemexpo.jpg",
      title: "ChemExpo India",
      desc: "Hosted an exclusive industry seminar on flow chemistry and continuous manufacturing.",
      date: "April 2026"
    },
    {
      img: "/highlight-exhibition.jpg",
      title: "CPEIS 2026 Exhibition",
      desc: "Sponsor and exhibitor showcasing advanced process technologies.",
      date: "May 2026"
    },
    {
      img: "/highlight-bioasia.jpg",
      title: "BioAsia 2026",
      desc: "Participated in one of India's leading life sciences events.",
      date: "February 2026"
    },
    {
      img: "/highlight-conclave.jpg",
      title: "I-NOST Conclave",
      desc: "Industry participation focused on innovation, sustainability and life sciences advancement.",
      date: "January 2026"
    },
    {
      img: "/bw.jpg",
      title: "BW Pharma Leadership Award",
      desc: "Recognized for Collaborative Innovation & Partnerships at the BW Pharma Leadership Awards."
    },
    {
      img: "/industry.jpg",
      title: "Hyderabad Industry Meetings",
      desc: "Business discussions and collaboration meetings with pharmaceutical and life sciences stakeholders."
    },
    {
      img: "/imapac.jpg",
      title: "IMAPAC Vaccines World Summit 2026",
      desc: "Participation in the global vaccines summit focusing on manufacturing advancements."
    },
    {
      img: "/purify.jpg",
      title: "Purify 25 Conclave",
      desc: "Showcasing advanced chromatography purification technologies."
    },
    {
      img: "/icgw.jpg",
      title: "IGCW",
      desc: "International Genomics Conference and Workshop."
    },
    {
      img: "/fci25.jpg",
      title: "FCI25",
      desc: "Fantastic two days of learning, connecting, sharing and showcasing @FCI25."
    },
    {
      img: "/DrM.jpg",
      title: "DrM Business Meetings",
      desc: "Discussing scalable vaccine production and bioprocess advancements."
    }
  ];

  const highlights = propHighlights && propHighlights.length > 0 ? propHighlights : localHighlights;
  const doubledHighlights = [...highlights, ...highlights, ...highlights];

  // Drag scrolling animation logic for custom slider
  const handleScrollEvent = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const scrollWidth = track.scrollWidth;
    const clientWidth = track.clientWidth;
    const singleSetWidth = scrollWidth / 3;

    if (track.scrollLeft < 10) {
      track.scrollLeft += singleSetWidth;
    } else if (track.scrollLeft >= singleSetWidth * 2 - 10) {
      track.scrollLeft -= singleSetWidth;
    }
  };

  useEffect(() => {
    if (trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      trackRef.current.scrollLeft = singleSetWidth;
    }
  }, [highlights]);

  // Autoplay functionality
  useEffect(() => {
    if (isHovered || isDraggingRef.current || isManualScrollingRef.current) return;
    const scrollInterval = setInterval(() => {
      if (trackRef.current) {
        trackRef.current.scrollBy({ left: 1.5, behavior: 'auto' });
      }
    }, 25);
    return () => clearInterval(scrollInterval);
  }, [isHovered]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only allow left-clicks
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    pauseAutoScrollBriefly();
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    dragDistanceRef.current += Math.abs(deltaX);

    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(() => {
      if (trackRef.current) {
        trackRef.current.scrollLeft -= deltaX;
      }
    });
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsHovered(false);
  };

  // Mobile touch event handlers
  const handleTouchStart = () => {
    isDraggingRef.current = true;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (item) => {
    // Prevent opening lightbox modal if user was drag-scrolling
    if (dragDistanceRef.current > 8) return;
    setActiveHighlight(item);
  };

  // Render mode: Recent Highlights Showcase ONLY
  if (mode === 'highlights') {
    return (
      <section className="section" id="highlights" style={{ paddingBottom: '0' }}>
        <div className="container">
          <motion.div
            className="recent-highlights-showcase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="highlights-header-row">
              <div className="highlights-header-text">
                <h2 className="section-title" style={{ fontSize: '34px', marginBottom: '6px' }}>Recent Highlights & Achievements</h2>
                <p className="section-subtitle" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                  Showcasing our recent achievements, industry participation, partnerships
                </p>
              </div>
              <div className="highlights-nav-btns">
                <button className="highlights-nav-btn" onClick={scrollPrev} aria-label="Previous">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="highlights-nav-btn" onClick={scrollNext} aria-label="Next">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className="highlights-carousel-container"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseUpOrLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="highlights-carousel-track"
                ref={trackRef}
                onScroll={handleScrollEvent}
              >
                {doubledHighlights.map((item, idx) => {
                  const grads = ['card-grad-navy', 'card-grad-green', 'card-grad-slate'];
                  const gradClass = grads[idx % grads.length];
                  return (
                    <HighlightCard 
                      key={idx}
                      item={item}
                      gradClass={gradClass}
                      onClick={() => handleCardClick(item)}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Expanded Highlight Detail Modal (Lightbox) */}
        <AnimatePresence>
          {activeHighlight && (
            <motion.div
              className="overlay"
              onClick={() => setActiveHighlight(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: '1000' }}
            >
              <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                style={{ maxWidth: '650px', padding: '0px', overflow: 'hidden' }}
              >
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveHighlight(null)}
                  style={{
                    zIndex: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: '6px',
                    top: '15px',
                    right: '15px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {(() => {
                  const modalUrl = activeHighlight.img ||
                    (activeHighlight.media && activeHighlight.media.find(m => m.url)?.url) || '';
                  const isVideo = modalUrl && (modalUrl.endsWith('.mp4') || modalUrl.endsWith('.webm') ||
                    modalUrl.includes('youtube.com') || modalUrl.includes('youtu.be') || modalUrl.includes('vimeo.com'));
                  return modalUrl ? (
                    <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {isVideo ? (
                        <video src={modalUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img
                          src={modalUrl}
                          alt={activeHighlight.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  ) : null;
                })()}

                <div style={{ padding: '24px' }}>
                  {activeHighlight.date && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                      display: 'block'
                    }}>
                      {activeHighlight.date}
                    </span>
                  )}
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    {activeHighlight.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                    {activeHighlight.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  // Render mode: Corporate Profile ONLY
  if (mode === 'profile') {
    return (
      <section className="section" id="who-we-are" style={{ paddingTop: '0' }}>
        <div className="container">
          <motion.div
            className="who-we-are-grid who-compact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ gridTemplateColumns: '1.4fr 0.6fr', gap: '40px', alignItems: 'center', marginTop: 'var(--whitespace-md)' }}
          >
            {/* Text side */}
            <div className="who-content">
              <span className="section-meta" style={{ fontSize: '11px' }}>Who We Are</span>
              <h3 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', marginTop: '8px', letterSpacing: '-0.02em' }}>
                Corporate Profile
              </h3>
              <p style={{
                fontSize: '19px',
                fontWeight: '300',
                lineHeight: '1.75',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
                borderLeft: '3px solid var(--accent-purple)',
                paddingLeft: '16px',
              }}>
                {description || "At Sky Lifesciences Solutions, we deliver advanced flow chemistry and continuous processing technologies for the pharmaceutical, chemical, and life sciences industries. Our portfolio features Corning’s high‑performance flow reactors—Glass and Silicon Carbide (SiC) plate reactors designed for exceptional heat and mass transfer—and Zaiput Flow Technologies’ membrane separators for efficient liquid‑liquid and gas‑liquid separation. We also provide precision pumps, back pressure regulators (BPRs), and premium tubing and fittings to ensure stable, reliable operations. By combining cutting‑edge equipment with deep process expertise, we help customers transition smoothly from batch to scalable continuous manufacturing, improving safety, product quality, and cost efficiency from lab to production."}
              </p>
              <a href="#products" className="btn btn-secondary" style={{ fontSize: '13px', padding: '10px 22px' }}>
                Know More About Us
              </a>
            </div>

            {/* Small image side */}
            <div className="who-image-container" style={{ maxWidth: '320px', justifySelf: 'end' }}>
              <img
                src={profileImage || "/logo.jpg"}
                alt="Skylife Solutions Life Sciences Scientist"
                className="who-img"
                style={{ filter: 'grayscale(10%)', width: '100%', height: '290px', objectFit: 'cover', borderRadius: '14px' }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Standard/legacy fallback rendering of both
  return (
    <section className="section" id="who-we-are">
      <div className="container">
        {/* Recent Highlights Showcase — TOP */}
        <motion.div
          className="recent-highlights-showcase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="highlights-header-row">
            <div className="highlights-header-text">
              <h2 className="section-title" style={{ fontSize: '34px', marginBottom: '6px' }}>Recent Highlights & Achievements</h2>
              <p className="section-subtitle" style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                Showcasing our recent achievements, industry participation, partnerships
              </p>
            </div>
            <div className="highlights-nav-btns">
              <button className="highlights-nav-btn" onClick={scrollPrev} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="highlights-nav-btn" onClick={scrollNext} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="highlights-carousel-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="highlights-carousel-track"
              ref={trackRef}
              onScroll={handleScrollEvent}
            >
              {doubledHighlights.map((item, idx) => {
                const grads = ['card-grad-navy', 'card-grad-green', 'card-grad-slate'];
                const gradClass = grads[idx % grads.length];
                return (
                  <HighlightCard 
                    key={idx}
                    item={item}
                    gradClass={gradClass}
                    onClick={() => handleCardClick(item)}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Corporate Profile — compact, below highlights */}
        <motion.div
          className="who-we-are-grid who-compact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ gridTemplateColumns: '1.4fr 0.6fr', gap: '40px', alignItems: 'center', marginTop: 'var(--whitespace-xl)' }}
        >
          {/* Text side */}
          <div className="who-content">
            <span className="section-meta" style={{ fontSize: '11px' }}>Who We Are</span>
            <h3 style={{ fontSize: '30px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', marginTop: '8px', letterSpacing: '-0.02em' }}>
              Corporate Profile
            </h3>
            <p style={{
              fontSize: '19px',
              fontWeight: '300',
              lineHeight: '1.75',
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              borderLeft: '3px solid var(--accent-purple)',
              paddingLeft: '16px',
            }}>
              {description || "At Sky Lifesciences Solutions, we deliver advanced flow chemistry and continuous processing technologies for the pharmaceutical, chemical, and life sciences industries. Our portfolio features Corning’s high‑performance flow reactors—Glass and Silicon Carbide (SiC) plate reactors designed for exceptional heat and mass transfer—and Zaiput Flow Technologies’ membrane separators for efficient liquid‑liquid and gas‑liquid separation. We also provide precision pumps, back pressure regulators (BPRs), and premium tubing and fittings to ensure stable, reliable operations. By combining cutting‑edge equipment with deep process expertise, we help customers transition smoothly from batch to scalable continuous manufacturing, improving safety, product quality, and cost efficiency from lab to production."}
            </p>
            <a href="#products" className="btn btn-secondary" style={{ fontSize: '13px', padding: '10px 22px' }}>
              Know More About Us
            </a>
          </div>

          {/* Small image side */}
          <div className="who-image-container" style={{ maxWidth: '320px', justifySelf: 'end' }}>
            <img
              src={profileImage || "/logo.jpg"}
              alt="Skylife Solutions Life Sciences Scientist"
              className="who-img"
              style={{ filter: 'grayscale(10%)', width: '100%', height: '290px', objectFit: 'cover', borderRadius: '14px' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Expanded Highlight Detail Modal (Lightbox) */}
      <AnimatePresence>
        {activeHighlight && (
          <motion.div
            className="overlay"
            onClick={() => setActiveHighlight(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: '1000' }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={{ maxWidth: '650px', padding: '0px', overflow: 'hidden' }}
            >
              <button
                className="modal-close-btn"
                onClick={() => setActiveHighlight(null)}
                style={{
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  padding: '6px',
                  top: '15px',
                  right: '15px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {(() => {
                const modalUrl = activeHighlight.img ||
                  (activeHighlight.media && activeHighlight.media.find(m => m.url)?.url) || '';
                const isVideo = modalUrl && (modalUrl.endsWith('.mp4') || modalUrl.endsWith('.webm') ||
                  modalUrl.includes('youtube.com') || modalUrl.includes('youtu.be') || modalUrl.includes('vimeo.com'));
                return modalUrl ? (
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    {isVideo ? (
                      <video src={modalUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img
                        src={modalUrl}
                        alt={activeHighlight.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ) : null;
              })()}

              <div style={{ padding: '24px' }}>
                {activeHighlight.date && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    display: 'block'
                  }}>
                    {activeHighlight.date}
                  </span>
                )}
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {activeHighlight.title}
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  {activeHighlight.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
