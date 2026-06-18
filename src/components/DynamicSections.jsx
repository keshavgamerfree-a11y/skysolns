import { motion } from 'framer-motion';

export default function DynamicSections({ sections = [], onOpenContact }) {
  if (!sections || sections.length === 0) return null;

  const renderVideo = (url, title) => {
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    return (
      <div className="video-wrapper" style={{ maxWidth: '900px', width: '100%', borderRadius: '8px' }}>
        {isYoutube ? (
          <iframe
            width="100%"
            height="100%"
            src={url.replace('watch?v=', 'embed/')}
            title={title || "Video demonstration"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video
            src={url}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {sections.map((section, idx) => {
        const isAltBg = idx % 2 === 0;
        
        return (
          <section
            key={section.id || idx}
            className={`section ${isAltBg ? 'alt-bg' : ''}`}
            style={{ padding: 'var(--whitespace-xl) 0', borderBottom: '1px solid var(--border-color)' }}
          >
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                {/* 1. TEXT BLOCK */}
                {section.type === 'text' && (
                  <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    {section.subtitle && (
                      <span className="section-meta" style={{ color: 'var(--accent-purple)' }}>
                        {section.subtitle}
                      </span>
                    )}
                    {section.title && (
                      <h2 className="section-title" style={{ fontSize: '36px', marginBottom: '24px' }}>
                        {section.title}
                      </h2>
                    )}
                    {section.text && (
                      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {section.text}
                      </p>
                    )}
                  </div>
                )}

                {/* 2. IMAGE + TEXT BLOCK */}
                {section.type === 'image-text' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: section.img ? '1.1fr 0.9fr' : '1fr',
                    gap: '50px',
                    alignItems: 'center'
                  }}>
                    {/* Left text, Right image behavior, swap if align is 'right' (meaning image on right, which is default, or left) */}
                    {section.align === 'left' && section.img && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={section.img}
                          alt={section.title || "Section Image"}
                          style={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxHeight: '350px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {section.subtitle && (
                        <span className="section-meta" style={{ color: 'var(--accent-purple)' }}>
                          {section.subtitle}
                        </span>
                      )}
                      {section.title && (
                        <h2 className="section-title" style={{ fontSize: '32px', marginBottom: '20px' }}>
                          {section.title}
                        </h2>
                      )}
                      {section.text && (
                        <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                          {section.text}
                        </p>
                      )}
                    </div>

                    {section.align !== 'left' && section.img && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={section.img}
                          alt={section.title || "Section Image"}
                          style={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxHeight: '350px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 3. VIDEO BLOCK */}
                {section.type === 'video' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {section.subtitle && (
                      <span className="section-meta" style={{ color: 'var(--accent-purple)' }}>
                        {section.subtitle}
                      </span>
                    )}
                    {section.title && (
                      <h2 className="section-title" style={{ fontSize: '34px', marginBottom: '24px' }}>
                        {section.title}
                      </h2>
                    )}
                    {section.videoUrl && renderVideo(section.videoUrl, section.title)}
                  </div>
                )}

                {/* 4. STATISTICS BLOCK */}
                {section.type === 'statistics' && (
                  <div style={{ textAlign: 'center' }}>
                    {section.subtitle && (
                      <span className="section-meta" style={{ color: 'var(--accent-purple)' }}>
                        {section.subtitle}
                      </span>
                    )}
                    {section.title && (
                      <h2 className="section-title" style={{ fontSize: '34px', marginBottom: '40px' }}>
                        {section.title}
                      </h2>
                    )}
                    {section.stats && section.stats.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(section.stats.length, 4)}, 1fr)`,
                        gap: '30px',
                        marginTop: '20px'
                      }}>
                        {section.stats.map((stat, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              padding: '24px',
                              backgroundColor: 'var(--bg-white)',
                              border: '1px solid var(--border-color)',
                              boxShadow: 'var(--shadow-sm)',
                              borderRadius: '4px'
                            }}
                          >
                            <span style={{
                              fontSize: '40px',
                              fontWeight: '700',
                              color: 'var(--accent-blue)',
                              display: 'block',
                              marginBottom: '8px',
                              lineHeight: '1'
                            }}>
                              {stat.target}{stat.suffix}
                            </span>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              color: 'var(--text-secondary)',
                              letterSpacing: '0.05em',
                              display: 'block'
                            }}>
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. CALL TO ACTION BLOCK */}
                {section.type === 'cta' && (
                  <div style={{
                    background: section.background || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '60px 40px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#FFF',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    {section.subtitle && (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--accent-blue)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'block',
                        marginBottom: '12px'
                      }}>
                        {section.subtitle}
                      </span>
                    )}
                    {section.title && (
                      <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px', color: '#FFF' }}>
                        {section.title}
                      </h2>
                    )}
                    {section.text && (
                      <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
                        {section.text}
                      </p>
                    )}
                    <button
                      className="btn btn-primary"
                      style={{
                        backgroundColor: '#FFF',
                        color: '#1A2F6B',
                        fontWeight: '600',
                        padding: '12px 30px',
                        fontSize: '14.5px'
                      }}
                      onClick={() => {
                        if (section.buttonLink === 'contact') {
                          onOpenContact();
                        } else if (section.buttonLink && section.buttonLink.startsWith('http')) {
                          window.open(section.buttonLink, '_blank');
                        } else if (section.buttonLink) {
                          window.location.href = section.buttonLink;
                        } else {
                          onOpenContact();
                        }
                      }}
                    >
                      {section.buttonText || "Get In Touch"}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        );
      })}
    </>
  );
}
