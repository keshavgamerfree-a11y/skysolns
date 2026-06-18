import { motion } from 'framer-motion';

export default function WhatWeDo({ content, onOpenContact }) {
  const pageTitle = content?.whatWeDo?.pageTitle || content?.sales?.title || 'Delivering Intelligent Manufacturing Solutions';
  const tagline = content?.whatWeDo?.tagline || content?.sales?.tagline || 'Enabling the Next Generation of Smart Continuous Manufacturing';
  const introText = content?.whatWeDo?.introText || content?.sales?.subtitle || 'We provide end-to-end technology solutions from research and development through pilot plants and commercial manufacturing, helping organizations accelerate innovation, improve efficiency, and adopt next-generation manufacturing technologies.';

  // Support both new whatWeDo section structure and legacy sales solutions list
  const sections = content?.whatWeDo?.sections || content?.sales?.solutions || [
    {
      title: "Continuous Manufacturing",
      description: "Replacing traditional batch processes with continuous systems to increase safety, reliability, and scale-up velocity.",
      icon: "activity"
    },
    {
      title: "Flow Chemistry Solutions",
      description: "Patented channel structures enabling high mass transfer, rapid temperature regulation, and highly automated chemistry.",
      icon: "flask"
    },
    {
      title: "Advanced Separation Technologies",
      description: "Membrane-based continuous separation solutions to handle demanding liquid extraction and emulsion breaks.",
      icon: "separation"
    },
    {
      title: "Continuous Crystallization",
      description: "Multi-stage systems providing exceptional crystal purity, consistent growth kinetics, and stable scales.",
      icon: "chromatography"
    },
    {
      title: "AI & Digital Manufacturing",
      description: "Integrating predictive models and online sensors for real-time process monitoring, run automation, and analytics.",
      icon: "cpu"
    },
    {
      title: "Sustainability & Green Chemistry",
      description: "Low-footprint designs aimed at minimizing raw material usage, waste generation, and solvent consumption.",
      icon: "globe"
    },
    {
      title: "Engineering & Consulting",
      description: "Comprehensive engineering support from basic feasibility and process optimization up to plant commissioning.",
      icon: "engineering"
    }
  ];

  const getSectionIcon = (key) => {
    const k = (key || '').toLowerCase();
    if (k.includes('separation')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 2v20"></path>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      );
    }
    if (k.includes('extraction')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
      );
    }
    if (k.includes('flask') || k.includes('chemistry')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12"></path>
          <path d="M12 3v7"></path>
          <path d="M9 3v13.5A3.5 3.5 0 1 0 16 16.5V3"></path>
        </svg>
      );
    }
    if (k.includes('crystallization') || k.includes('chromatography')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
        </svg>
      );
    }
    if (k.includes('cpu') || k.includes('digital') || k.includes('ai')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="15" x2="23" y2="15"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="15" x2="4" y2="15"></line>
        </svg>
      );
    }
    if (k.includes('globe') || k.includes('sustainability') || k.includes('green')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      );
    }
    if (k.includes('engineering') || k.includes('tool') || k.includes('wrench')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    );
  };

  const getWhyUsIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('expertise')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="3" x2="18" y2="3"></line>
          <line x1="12" y1="3" x2="12" y2="18"></line>
          <path d="M12 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
        </svg>
      );
    }
    if (t.includes('partnerships') || t.includes('global')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      );
    }
    if (t.includes('sustainable') || t.includes('green')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M7 12.5l3 3 7-7"></path>
        </svg>
      );
    }
    if (t.includes('support') || t.includes('technical')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      );
    }
    if (t.includes('scale-up') || t.includes('faster') || t.includes('development')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      );
    }
    if (t.includes('training') || t.includes('knowledge')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    }
    if (t.includes('commitment') || t.includes('excellence')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    );
  };

  const whyUsList = content?.whatWeDo?.whyUs || content?.sales?.whyUs || [
    { title: "Expertise in Continuous Manufacturing Technologies" },
    { title: "Global Technology Partnerships" },
    { title: "Sustainable Manufacturing Solutions" },
    { title: "End-to-End Technical Support" },
    { title: "Faster Process Development & Scale-Up" },
    { title: "Industry Training & Knowledge Transfer" },
    { title: "Commitment to Innovation and Excellence" }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Intro Banner */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: 'var(--whitespace-xl) 0 80px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-meta" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>CAPABILITIES & EXPERTISE</span>
          <h1 
            className="section-title" 
            style={{ fontSize: '48px', fontWeight: '300', marginBottom: 'var(--whitespace-md)', maxWidth: '900px', lineHeight: '1.15' }}
          >
            {pageTitle}
          </h1>
          <p className="section-subtitle" style={{ margin: 0, maxWidth: '850px', fontSize: '18px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {introText}
          </p>
        </div>
      </section>

      {/* Dynamic Scrollable Solution Areas (Full content blocks) */}
      <div className="what-we-do-solutions">
        {sections.map((sec, idx) => {
          const isLeftMedia = idx % 2 !== 0;
          const isAltBg = idx % 2 === 0;
          
          const hasMedia = sec.image || sec.video;
          const isVideo = sec.video || (sec.image && (sec.image.endsWith('.mp4') || sec.image.includes('youtube.com') || sec.image.includes('youtu.be') || sec.image.includes('vimeo')));
          
          const sectionId = `sec-${idx}`;
          
          const bgStyle = {};
          if (sec.backgroundImage) {
            bgStyle.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)), url(${sec.backgroundImage})`;
            bgStyle.backgroundSize = 'cover';
            bgStyle.backgroundPosition = 'center';
            bgStyle.backgroundAttachment = 'scroll';
          } else {
            bgStyle.backgroundColor = isAltBg ? 'var(--bg-primary)' : 'var(--bg-white)';
          }

          const textCol = (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-blue-light)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getSectionIcon(sec.icon || sec.title)}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-blue)' }}>
                  Solution Focus
                </span>
              </div>
              
              <h3 style={{ fontSize: '28px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, lineHeight: '1.25' }}>
                {sec.title}
              </h3>
              
              <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                {sec.description || (sec.points ? sec.points.join(' ') : '')}
              </p>
              
              {sec.ctaButtonText && sec.ctaButtonLink && (
                <button 
                  className="btn btn-primary" 
                  style={{ alignSelf: 'flex-start', marginTop: '10px', backgroundColor: 'var(--accent-blue)', color: '#FFF' }}
                  onClick={() => {
                    if (sec.ctaButtonLink.startsWith('#')) {
                      const el = document.getElementById(sec.ctaButtonLink.substring(1));
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else if (sec.ctaButtonLink === '#contact') {
                        onOpenContact();
                      }
                    } else {
                      window.location.href = sec.ctaButtonLink;
                    }
                  }}
                >
                  {sec.ctaButtonText}
                </button>
              )}
            </motion.div>
          );

          const mediaCol = hasMedia ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                width: '100%',
                backgroundColor: '#FFF',
                padding: isVideo ? '0' : '15px',
                aspectRatio: isVideo ? '16/9' : 'auto',
                maxHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isVideo ? (
                  (sec.video && (sec.video.includes('youtube') || sec.video.includes('youtu.be') || sec.video.includes('vimeo'))) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={sec.video.includes('watch?v=') ? sec.video.replace('watch?v=', 'embed/') : sec.video}
                      title={sec.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <video 
                      src={sec.video || sec.image} 
                      controls 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )
                ) : (
                  <img 
                    src={sec.image || sec.video} 
                    alt={sec.title} 
                    style={{ maxWidth: '100%', maxHeight: '370px', objectFit: 'contain' }} 
                  />
                )}
              </div>
            </motion.div>
          ) : null;

          return (
            <section 
              key={sec.id || idx} 
              id={sectionId} 
              style={{ 
                padding: '100px 0', 
                borderBottom: '1px solid var(--border-color)', 
                position: 'relative', 
                overflow: 'hidden', 
                ...bgStyle 
              }}
            >
              <div className="container">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: hasMedia ? '1.1fr 0.9fr' : '1fr',
                  gap: '60px',
                  alignItems: 'center'
                }}>
                  {isLeftMedia && hasMedia ? (
                    <>
                      {mediaCol}
                      {textCol}
                    </>
                  ) : (
                    <>
                      {textCol}
                      {mediaCol}
                    </>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Why Sky Lifesciences Solutions - Horizontal grid */}
      <section className="section alt-bg" style={{ padding: 'var(--whitespace-xl) 0', borderBottom: 'none' }}>
        <div className="container">
          <div className="section-header-centered" style={{ marginBottom: 'var(--whitespace-lg)' }}>
            <span className="section-meta">PARTNERSHIP VALUE</span>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '400', margin: 0 }}>Why Sky Lifesciences Solutions</h2>
          </div>

          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {whyUsList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                style={{
                  backgroundColor: 'var(--bg-white)',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  fontSize: '20px',
                  backgroundColor: 'var(--accent-blue-light)',
                  color: 'var(--accent-blue)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getWhyUsIcon(item.title)}
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  {item.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Tagline Banner */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #0B0F19 0%, #136B36 100%)',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '80px 0',
        borderBottom: 'none'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '300', marginBottom: '30px', lineHeight: '1.3', color: '#FFF' }}>
              {tagline}
            </h2>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent-blue)', color: '#FFF' }} onClick={onOpenContact}>
              Request Technical Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
