import { useState, useEffect } from 'react';

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

export default function ProductDetailView({ product, category, onOpenContact, onBackToCategory, onBackToCategories }) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  const [isBrochureLightboxOpen, setIsBrochureLightboxOpen] = useState(false);
  const [brochureLightboxIndex, setBrochureLightboxIndex] = useState(0);
  const [brochureLightboxZoom, setBrochureLightboxZoom] = useState(1);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      if (isLightboxOpen) {
        setLightboxIndex(prev => (prev + 1) % galleryMedia.length);
        setLightboxZoom(1);
      } else if (isBrochureLightboxOpen) {
        setBrochureLightboxIndex(prev => (prev + 1) % brochureImages.length);
        setBrochureLightboxZoom(1);
      }
    } else if (diff < -50) {
      if (isLightboxOpen) {
        setLightboxIndex(prev => (prev - 1 + galleryMedia.length) % galleryMedia.length);
        setLightboxZoom(1);
      } else if (isBrochureLightboxOpen) {
        setBrochureLightboxIndex(prev => (prev - 1 + brochureImages.length) % brochureImages.length);
        setBrochureLightboxZoom(1);
      }
    }
  };

  // Compile unified media list for showcase and slideshow Lightbox (product media only)
  const galleryMedia = [];
  
  if (product) {
    // 1. Add product images
    const productImages = product.images || (product.img ? [product.img] : []);
    productImages.forEach(url => {
      if (url) galleryMedia.push({ type: 'image', url, label: 'Product View' });
    });

    // 2. Add product videos
    const videos = product.videos || [];
    videos.forEach(url => {
      if (url) galleryMedia.push({ type: 'video', url, label: 'Video Demo' });
    });
  }

  const brochureImages = product?.brochureImages || [];

  // Keyboard navigation listener for the slideshow Lightbox and Brochure Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setLightboxIndex(prev => (prev - 1 + galleryMedia.length) % galleryMedia.length);
          setLightboxZoom(1);
        } else if (e.key === 'ArrowRight') {
          setLightboxIndex(prev => (prev + 1) % galleryMedia.length);
          setLightboxZoom(1);
        } else if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        }
      } else if (isBrochureLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setBrochureLightboxIndex(prev => (prev - 1 + brochureImages.length) % brochureImages.length);
          setBrochureLightboxZoom(1);
        } else if (e.key === 'ArrowRight') {
          setBrochureLightboxIndex(prev => (prev + 1) % brochureImages.length);
          setBrochureLightboxZoom(1);
        } else if (e.key === 'Escape') {
          setIsBrochureLightboxOpen(false);
        }
      }
    };

    if (isLightboxOpen || isBrochureLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isBrochureLightboxOpen, galleryMedia.length, brochureImages.length]);

  if (!product) return null;

  const currentMedia = galleryMedia[activeMediaIndex] || null;
  const specs = product.specifications || {};
  const hasSpecs = Object.keys(specs).length > 0;
  const features = product.features || [];
  const applications = product.applications || [];

  // Contact Us handler (opens email app directly)
  const handleContactClick = () => {
    const recipient = "shylender@skylifesciencessolutions.com";
    const subject = `Product Enquiry - ${product.name}`;
    const body = `Hello Sky Life Sciences Solutions,

I would like more information regarding:

${product.name}

Company:

Name:

Phone Number:

Email:

Message:

Thank you.`;

    window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Navigation breadcrumbs */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: 'var(--whitespace-sm) 0', marginBottom: '24px' }}>
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

      {/* Primary Top Panel Showcase Grid */}
      <section style={{ backgroundColor: 'var(--bg-white)', padding: '30px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="product-grid-container">
            {/* Left Column: Image Showcase & Gallery Gallery */}
            <div className="product-gallery-showcase">
              {currentMedia ? (
                <div 
                  className="product-gallery-main"
                  onClick={() => {
                    if (currentMedia.type === 'image') {
                      setLightboxIndex(activeMediaIndex);
                      setIsLightboxOpen(true);
                      setLightboxZoom(1);
                    }
                  }}
                >
                  {currentMedia.type === 'image' ? (
                    <img src={currentMedia.url} alt={product.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
                      {currentMedia.url.includes('youtube.com') || currentMedia.url.includes('youtu.be') ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={currentMedia.url.replace('watch?v=', 'embed/')}
                          title="Video Demo"
                          frameBorder="0"
                          allowFullScreen
                        />
                      ) : (
                        <video src={currentMedia.url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                  )}
                  {currentMedia.type === 'image' && (
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', color: '#FFF', fontSize: '11px', padding: '4px 8px', borderRadius: '2px', pointerEvents: 'none' }}>
                      🔍 Click to zoom
                    </div>
                  )}
                </div>
              ) : (
                <div className="product-gallery-main" style={{ cursor: 'default' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>No media available</span>
                </div>
              )}

              {/* Thumbnails row below */}
              {galleryMedia.length > 1 && (
                <div className="product-gallery-thumbnails">
                  {galleryMedia.map((media, idx) => (
                    <div
                      key={idx}
                      className={`product-gallery-thumb ${idx === activeMediaIndex ? 'active' : ''}`}
                      onClick={() => setActiveMediaIndex(idx)}
                    >
                      {media.type === 'image' ? (
                        <img src={media.url} alt={`Thumb ${idx + 1}`} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      )}
                      <span className="product-gallery-thumb-badge">{media.type === 'video' ? 'Video' : media.label.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Identity, Description, and Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                {category && (
                  <span 
                    className="admin-badge admin-badge-info"
                    style={{ 
                      backgroundColor: 'var(--accent-blue-light)', 
                      color: 'var(--accent-blue)',
                      fontSize: '11px',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      display: 'inline-block'
                    }}
                  >
                    {category.title}
                  </span>
                )}
                <h1 style={{ fontSize: '38px', fontWeight: '600', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '8px', marginBottom: '8px', lineHeight: '1.2' }}>
                  {product.name}
                </h1>
              </div>

              {/* Primary call-to-actions */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleContactClick}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Request Information / Quote
                </button>

                {(product.pdf || brochureImages.length > 0) && (
                  <button 
                    onClick={() => {
                      if (product.pdf) {
                        setShowPdfModal(true);
                      } else {
                        setBrochureLightboxIndex(0);
                        setIsBrochureLightboxOpen(true);
                        setBrochureLightboxZoom(1);
                      }
                    }} 
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--accent-blue)', color: '#FFF', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Brochure
                  </button>
                )}

                {product.pdf && (
                  <a 
                    href={product.pdf} 
                    download
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '4px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download PDF
                  </a>
                )}
              </div>

              {/* Overview snippet description */}
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: '600' }}>Product Overview</h3>
                <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                  {product.desc ? (product.desc.split('\n')[0] || '') : ''}
                </p>
              </div>

              {/* Direct support information block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#F8F9FA', padding: '16px 20px', borderRadius: '4px', border: '1px dashed var(--border-color)', marginTop: 'auto' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>For technical or sales assistance:</span>
                <a 
                  href="mailto:shylender@skylifesciencessolutions.com" 
                  style={{ fontSize: '14.5px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  shylender@skylifesciencessolutions.com
                </a>
              </div>
            </div>
          </div>

          {/* Compact Technical Tabs Switcher */}
          <div className="product-tabs-container">
            <div className="product-tabs-nav">
              <button 
                type="button"
                className={`product-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Detailed Description
              </button>
              {features.length > 0 && (
                <button 
                  type="button"
                  className={`product-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                  onClick={() => setActiveTab('features')}
                >
                  Key Features
                </button>
              )}
              {applications.length > 0 && (
                <button 
                  type="button"
                  className={`product-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  Typical Applications
                </button>
              )}
              {hasSpecs && (
                <button 
                  type="button"
                  className={`product-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  Specifications Table
                </button>
              )}
            </div>

            <div className="product-tab-content">
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Overview & Details</h3>
                  {renderFormattedText(product.desc)}
                  {product.technicalOverview && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '12px' }}>Technical Overview</h4>
                      {renderFormattedText(product.technicalOverview)}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'features' && features.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Key Features</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '15px', color: 'var(--text-secondary)', display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: '1.5' }}>
                        <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '18px', lineHeight: '1', marginTop: '-2px' }}>•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'applications' && applications.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Typical Applications</h3>
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
                        <span style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {app}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && hasSpecs && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)' }}>Technical Specifications</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(specs).map(([key, val], sIdx) => (
                        <tr key={sIdx} style={{ borderBottom: '1px solid #ECECEC' }}>
                          <td style={{ padding: '14px 0', fontSize: '14.5px', fontWeight: '600', color: 'var(--text-primary)', width: '35%' }}>{key}</td>
                          <td style={{ padding: '14px 0', fontSize: '14.5px', color: 'var(--text-secondary)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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
            borderRadius: '4px',
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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
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

      {/* Premium Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          className="premium-lightbox" 
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header toolbar */}
          <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
            <h4 className="lightbox-title">
              {product.name} - {galleryMedia[lightboxIndex]?.label || ''}
            </h4>
            <div className="lightbox-controls">
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setLightboxZoom(prev => Math.max(prev - 0.25, 0.75))}
              >
                ➖ Zoom Out
              </button>
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setLightboxZoom(1)}
              >
                1:1 Reset
              </button>
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setLightboxZoom(prev => Math.min(prev + 0.25, 2.5))}
              >
                ➕ Zoom In
              </button>
              <button 
                type="button"
                className="lightbox-btn lightbox-close"
                onClick={() => setIsLightboxOpen(false)}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Lightbox center body */}
          <div 
            className="lightbox-body" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left navigation arrow */}
            {galleryMedia.length > 1 && (
              <button 
                type="button"
                className="lightbox-arrow lightbox-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev - 1 + galleryMedia.length) % galleryMedia.length);
                  setLightboxZoom(1);
                }}
              >
                ‹
              </button>
            )}

            {/* Main media inside Lightbox */}
            {galleryMedia[lightboxIndex] && (
              galleryMedia[lightboxIndex].type === 'image' ? (
                <img
                  src={galleryMedia[lightboxIndex].url}
                  alt="Enlarged document"
                  className="lightbox-main-img"
                  style={{
                    transform: `scale(${lightboxZoom})`,
                    cursor: lightboxZoom > 1 ? 'grab' : 'zoom-in'
                  }}
                  onClick={() => setLightboxZoom(prev => prev > 1 ? 1 : 1.5)}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {galleryMedia[lightboxIndex].url.includes('youtube.com') || galleryMedia[lightboxIndex].url.includes('youtu.be') ? (
                    <iframe
                      width="560"
                      height="315"
                      src={galleryMedia[lightboxIndex].url.replace('watch?v=', 'embed/')}
                      title="Video demo"
                      frameBorder="0"
                      allowFullScreen
                      style={{ maxWidth: '80vw', maxHeight: '80vh', aspectRatio: '16/9' }}
                    />
                  ) : (
                    <video
                      src={galleryMedia[lightboxIndex].url}
                      controls
                      style={{ maxHeight: '80vh', maxWidth: '80vw', objectFit: 'contain' }}
                    />
                  )}
                </div>
              )
            )}

            {/* Right navigation arrow */}
            {galleryMedia.length > 1 && (
              <button 
                type="button"
                className="lightbox-arrow lightbox-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev + 1) % galleryMedia.length);
                  setLightboxZoom(1);
                }}
              >
                ›
              </button>
            )}
          </div>

          {/* Footer info strip */}
          <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
            <p className="lightbox-info">
              Image {lightboxIndex + 1} of {galleryMedia.length} — Use Left/Right arrow keys to navigate
            </p>
          </div>
        </div>
      )}

      {/* Brochure Lightbox Overlay */}
      {isBrochureLightboxOpen && (
        <div 
          className="premium-lightbox" 
          onClick={() => setIsBrochureLightboxOpen(false)}
        >
          {/* Header toolbar */}
          <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
            <h4 className="lightbox-title">
              {product.name} - Brochure Page {brochureLightboxIndex + 1}
            </h4>
            <div className="lightbox-controls">
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setBrochureLightboxZoom(prev => Math.max(prev - 0.25, 0.75))}
              >
                ➖ Zoom Out
              </button>
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setBrochureLightboxZoom(1)}
              >
                1:1 Reset
              </button>
              <button 
                type="button"
                className="lightbox-btn"
                onClick={() => setBrochureLightboxZoom(prev => Math.min(prev + 0.25, 2.5))}
              >
                ➕ Zoom In
              </button>
              <button 
                type="button"
                className="lightbox-btn lightbox-close"
                onClick={() => setIsBrochureLightboxOpen(false)}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Lightbox center body */}
          <div 
            className="lightbox-body" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              setTouchStartX(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEndX(e.targetTouches[0].clientX);
            }}
            onTouchEnd={() => {
              const diff = touchStartX - touchEndX;
              if (diff > 50) {
                setBrochureLightboxIndex(prev => (prev + 1) % brochureImages.length);
                setBrochureLightboxZoom(1);
              } else if (diff < -50) {
                setBrochureLightboxIndex(prev => (prev - 1 + brochureImages.length) % brochureImages.length);
                setBrochureLightboxZoom(1);
              }
            }}
          >
            {/* Left navigation arrow */}
            {brochureImages.length > 1 && (
              <button 
                type="button"
                className="lightbox-arrow lightbox-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrochureLightboxIndex(prev => (prev - 1 + brochureImages.length) % brochureImages.length);
                  setBrochureLightboxZoom(1);
                }}
              >
                ‹
              </button>
            )}

            {/* Main image inside Lightbox */}
            {brochureImages[brochureLightboxIndex] && (
              <img
                src={brochureImages[brochureLightboxIndex]}
                alt="Enlarged brochure sheet"
                className="lightbox-main-img"
                style={{
                  transform: `scale(${brochureLightboxZoom})`,
                  cursor: brochureLightboxZoom > 1 ? 'grab' : 'zoom-in'
                }}
                onClick={() => setBrochureLightboxZoom(prev => prev > 1 ? 1 : 1.5)}
              />
            )}

            {/* Right navigation arrow */}
            {brochureImages.length > 1 && (
              <button 
                type="button"
                className="lightbox-arrow lightbox-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrochureLightboxIndex(prev => (prev + 1) % brochureImages.length);
                  setBrochureLightboxZoom(1);
                }}
              >
                ›
              </button>
            )}
          </div>

          {/* Footer info strip */}
          <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
            <p className="lightbox-info">
              Image {brochureLightboxIndex + 1} of {brochureImages.length} — Use Left/Right arrow keys or swipe to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
