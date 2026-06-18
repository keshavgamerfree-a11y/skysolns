import { useState } from 'react';
import { motion } from 'framer-motion';

// Helper to render text with clickable links
function renderTextWithLinks(text) {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, idx) => {
    if (part.match(urlRegex)) {
      return (
        <a key={idx} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>
          {part}
        </a>
      );
    }
    return part;
  });
}

// Smart Description Formatting Parser & Renderer
function renderFormattedText(text) {
  if (!text) return null;

  // Split into individual lines
  const rawLines = text.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let currentList = null; // { type: 'bullet' | 'number', items: [] }
  let textBlock = []; // Buffer for consecutive normal paragraph lines

  const flushList = (key) => {
    if (!currentList) return;
    if (currentList.type === 'bullet') {
      elements.push(
        <ul key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
          {currentList.items.map((item, lIdx) => (
            <li key={lIdx} style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {renderTextWithLinks(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0', paddingLeft: '20px', listStyleType: 'decimal' }}>
          {currentList.items.map((item, lIdx) => (
            <li key={lIdx} style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {renderTextWithLinks(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const flushTextBlock = (key) => {
    if (textBlock.length === 0) return;
    elements.push(
      <p key={key} style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: '0 0 16px 0', whiteSpace: 'pre-wrap' }}>
        {renderTextWithLinks(textBlock.join('\n'))}
      </p>
    );
    textBlock = [];
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushList(`list-${i}`);
      flushTextBlock(`p-${i}`);
      // Render a spacer for empty lines to preserve spacing
      elements.push(<div key={`space-${i}`} style={{ height: '8px' }} />);
      continue;
    }

    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('▪');
    const isNumbered = /^\d+[.)]/.test(trimmed);

    if (isBullet) {
      flushTextBlock(`p-${i}`);
      if (currentList && currentList.type !== 'bullet') {
        flushList(`list-${i}-switch`);
      }
      if (!currentList) {
        currentList = { type: 'bullet', items: [] };
      }
      const content = line.replace(/^[ \t]*[•\-*▪][ \t]*/, ''); // Preserve inner spacing but strip bullet prefix
      currentList.items.push(content);
    } else if (isNumbered) {
      flushTextBlock(`p-${i}`);
      if (currentList && currentList.type !== 'number') {
        flushList(`list-${i}-switch`);
      }
      if (!currentList) {
        currentList = { type: 'number', items: [] };
      }
      const content = line.replace(/^[ \t]*\d+[.)][ \t]*/, ''); // Preserve inner spacing but strip number prefix
      currentList.items.push(content);
    } else {
      const isHeading = trimmed.startsWith('#') || 
                        (trimmed.length < 60 && !trimmed.includes('.') && !trimmed.includes(',') &&
                         (trimmed === trimmed.toUpperCase() || trimmed.endsWith(':') || 
                          trimmed === 'Applications' || trimmed === 'Features' || 
                          trimmed === 'Technical Specs' || trimmed === 'Specifications' ||
                          trimmed === 'Key Features' || trimmed === 'Typical Applications'));

      if (isHeading) {
        flushList(`list-${i}`);
        flushTextBlock(`p-${i}`);
        const headingContent = trimmed.replace(/^#+\s*/, '');
        elements.push(
          <h4 key={`heading-${i}`} style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '24px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {headingContent}
          </h4>
        );
      } else {
        flushList(`list-${i}`);
        textBlock.push(line);
      }
    }
  }

  // Flush remaining buffers
  flushList('list-end');
  flushTextBlock('p-end');

  return elements;
}

// Helper to render media element dynamically
function renderMediaPlaceholder(media, name) {
  if (!media) return null;
  if (media.type === 'image') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          backgroundColor: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          height: '350px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          padding: '16px'
        }}
      >
        <img src={media.url} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </motion.div>
    );
  } else if (media.type === 'video') {
    const isYoutube = media.url.includes('youtube.com') || media.url.includes('youtu.be');
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflow: 'hidden',
          aspectRatio: '16/9',
          backgroundColor: '#000',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        {isYoutube ? (
          <iframe
            width="100%"
            height="100%"
            src={media.url.replace('watch?v=', 'embed/')}
            title={`Video demonstration`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            src={media.url} 
            controls 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </motion.div>
    );
  }
  return null;
}

// Render a section with alternating columns
function AlternatingSection({ title, children, media, name, isLeftMedia, isAltBg }) {
  const contentCol = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <div>{children}</div>
    </motion.div>
  );

  const mediaCol = media ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      {renderMediaPlaceholder(media, `${name} ${title}`)}
    </div>
  ) : null;

  return (
    <section className="section" style={{ backgroundColor: isAltBg ? 'var(--bg-primary)' : 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: '60px 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: media ? '1.1fr 0.9fr' : '1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {isLeftMedia && media ? (
            <>
              {mediaCol}
              {contentCol}
            </>
          ) : (
            <>
              {contentCol}
              {mediaCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailView({ product, category, onBackToCategory, onBackToCategories }) {
  const [showPdfModal, setShowPdfModal] = useState(false);

  if (!product) return null;

  // Compile media lists
  const images = product.images || (product.img ? [product.img] : []);
  const videos = product.videos || [];
  const specs = product.specifications || {};
  const hasSpecs = Object.keys(specs).length > 0;
  const features = product.features || [];
  const applications = product.applications || [];

  // Contact Us email handler
  const handleContactClick = () => {
    const to = "shylender@skylifesciencessolutions.com";
    const subject = encodeURIComponent(`Inquiry - ${product.name}`);
    const body = encodeURIComponent(`Hello,\n\nI would like to know more about ${product.name}.\n\nRegards`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  // Compile media pool
  let heroMedia = null;
  const mediaPool = [];

  if (images.length > 0) {
    heroMedia = { type: 'image', url: images[0] };
    for (let i = 1; i < images.length; i++) {
      mediaPool.push({ type: 'image', url: images[i] });
    }
    for (let i = 0; i < videos.length; i++) {
      mediaPool.push({ type: 'video', url: videos[i] });
    }
  } else if (videos.length > 0) {
    heroMedia = { type: 'video', url: videos[0] };
    for (let i = 1; i < videos.length; i++) {
      mediaPool.push({ type: 'video', url: videos[i] });
    }
  }

  // Helper to extract next media from pool
  const getNextMedia = (preferredType) => {
    if (mediaPool.length === 0) return null;
    if (preferredType) {
      const idx = mediaPool.findIndex(m => m.type === preferredType);
      if (idx !== -1) {
        return mediaPool.splice(idx, 1)[0];
      }
    }
    return mediaPool.shift();
  };

  // Pull media items for each potential section
  const featuresMedia = getNextMedia('image');
  const overviewMedia = getNextMedia('image');
  const appsMedia = getNextMedia('image');
  const specsMedia = getNextMedia('image');

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingTop: 'var(--whitespace-xl)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Navigation breadcrumbs */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: 'var(--whitespace-sm) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <button onClick={onBackToCategories} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Categories</button>
            <span>/</span>
            {category && (
              <>
                <button onClick={onBackToCategory} style={{ color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{category.title}</button>
                <span>/</span>
              </>
            )}
            <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>{product.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Showcase Section: Cover Image + Desc & Actions */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '60px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: heroMedia ? '1.1fr 0.9fr' : '1fr', 
            gap: '60px', 
            alignItems: 'center' 
          }}>
            {/* Left Column: text fields & lists */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div>
                {category && (
                  <span 
                    className="admin-badge admin-badge-info"
                    style={{ 
                      backgroundColor: 'var(--accent-blue-light)', 
                      color: 'var(--accent-blue)',
                      fontSize: '11px',
                      padding: '6px 12px',
                      borderRadius: '0px',
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {category.title}
                  </span>
                )}
                <h1 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '12px', marginBottom: '16px', lineHeight: '1.2' }}>
                  {product.name}
                </h1>
                
                {/* Product Long Description (Pasted Text formatted) */}
                <div style={{ marginTop: '12px' }}>
                  {renderFormattedText(product.desc)}
                </div>
              </div>

              {/* Action row with Contact Mail and brochure buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleContactClick}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Contact Us
                </button>

                {product.pdf && (
                  <>
                    <button 
                      onClick={() => setShowPdfModal(true)} 
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--accent-purple)', color: '#FFF', cursor: 'pointer', border: 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Brochure
                    </button>
                    <a 
                      href={product.pdf} 
                      download
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Brochure
                    </a>
                  </>
                )}
              </div>

              {/* Assistance info helper row (always visible) */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Need assistance?</span>
                <a 
                  href="mailto:shylender@skylifesciencessolutions.com" 
                  style={{ fontSize: '14.5px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  shylender@skylifesciencessolutions.com
                </a>
              </div>
            </motion.div>

            {/* Right Column: Hero Cover Media */}
            {heroMedia && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%' }}
              >
                {renderMediaPlaceholder(heroMedia, product.name)}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Alternating content sections */}
      {features.length > 0 && (
        <AlternatingSection 
          title="Key Features"
          media={featuresMedia}
          name={product.name}
          isLeftMedia={false}
          isAltBg={true}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.map((feat, idx) => (
              <li key={idx} style={{ fontSize: '14.5px', color: 'var(--text-secondary)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '16px', lineHeight: '1', marginTop: '-1px' }}>•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </AlternatingSection>
      )}

      {product.technicalOverview && (
        <AlternatingSection
          title="Technical Overview"
          media={overviewMedia}
          name={product.name}
          isLeftMedia={true}
          isAltBg={false}
        >
          <div>
            {renderFormattedText(product.technicalOverview)}
          </div>
        </AlternatingSection>
      )}

      {applications.length > 0 && (
        <AlternatingSection
          title="Typical Applications"
          media={appsMedia}
          name={product.name}
          isLeftMedia={false}
          isAltBg={true}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map((app, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-purple-light)', 
                    color: 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {app}
                </span>
              </li>
            ))}
          </ul>
        </AlternatingSection>
      )}

      {hasSpecs && (
        <AlternatingSection
          title="Technical Specifications"
          media={specsMedia}
          name={product.name}
          isLeftMedia={true}
          isAltBg={false}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(specs).map(([key, val], sIdx) => (
                <tr key={sIdx} style={{ borderBottom: '1px solid #ECECEC' }}>
                  <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', width: '40%' }}>{key}</td>
                  <td style={{ padding: '12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AlternatingSection>
      )}

      {/* Extra pool media rendered as inline visual break banners (never as a bottom grid gallery) */}
      {mediaPool.map((med, rIdx) => (
        <section key={`extra-${rIdx}`} className="section" style={{ backgroundColor: rIdx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: '60px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
              {renderMediaPlaceholder(med, `${product.name} demo ${rIdx}`)}
            </div>
          </div>
        </section>
      ))}

      {/* Embedded PDF Viewer Modal */}
      {showPdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-white)',
            border: '1px solid var(--border-color)',
            width: '100%',
            maxWidth: '1000px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: 'var(--text-primary)' }}>
                Brochure Viewer: {product.name}
              </h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <a 
                  href={product.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '13px', color: 'var(--accent-blue)', textDecoration: 'underline' }}
                >
                  Open in New Tab ↗
                </a>
                <button 
                  onClick={() => setShowPdfModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontWeight: 'bold',
                    padding: '4px 8px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Modal Body: Embedded iframe */}
            <div style={{ flexGrow: 1, backgroundColor: '#525659' }}>
              <iframe 
                src={product.pdf} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="Brochure PDF document"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
