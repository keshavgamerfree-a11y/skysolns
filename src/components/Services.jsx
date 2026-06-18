import { motion } from 'framer-motion';

export default function Services({ services: propServices, navigateTo, onOpenContact }) {
  const defaultServices = [
    {
      id: 'svc-def-1',
      title: "Optimization of Liquid-Liquid Separation",
      desc: "Enhancing separator throughput, design, and purity levels for challenging liquid matrices.",
      iconKey: "separation",
      img: "",
      learnMore: ""
    },
    {
      id: 'svc-def-2',
      title: "Optimization of Liquid-Liquid Extraction",
      desc: "Configuring multistage systems to maximize mass transfer and solute partition coefficients.",
      iconKey: "extraction",
      img: "",
      learnMore: ""
    },
    {
      id: 'svc-def-3',
      title: "Optimization of Partition Chromatography",
      desc: "Maximizing yield and solute resolution without using solid stationary phases.",
      iconKey: "chromatography",
      img: "",
      learnMore: ""
    }
  ];

  const services = (propServices && propServices.length > 0) ? propServices : defaultServices;

  const getIcon = (key) => {
    const k = (key || '').toLowerCase();
    if (k === 'separation') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    }
    if (k === 'extraction') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }
    if (k === 'chromatography') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      );
    }
    if (k === 'cpu' || k === 'digital') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    }
    if (k === 'globe' || k === 'green') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    }
    if (k === 'engineering' || k === 'tool') {
      return (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    }
    // Default: flask / activity
    return (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  };

  const handleLearnMore = (svc) => {
    if (!svc.learnMore || svc.learnMore === '' || svc.learnMore === '#contact') {
      if (onOpenContact) onOpenContact();
    } else if (svc.learnMore.startsWith('#')) {
      const el = document.getElementById(svc.learnMore.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (svc.learnMore.startsWith('http')) {
      window.open(svc.learnMore, '_blank', 'noopener');
    } else {
      if (navigateTo) navigateTo(svc.learnMore);
    }
  };

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-meta">Technical Capacities</span>
          <h2 className="section-title">Specialized Services</h2>
          <p className="section-subtitle">
            Beyond precision equipment, we offer consulting services designed to optimize phase separation, chemical extraction, and chromatography lifecycles.
          </p>
        </div>

        <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {services.map((svc, idx) => (
            <motion.div
              className="product-card"
              key={svc.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '0', overflow: 'hidden' }}
            >
              {/* Service Image (if provided) */}
              {svc.img && (
                <div style={{
                  height: '180px',
                  width: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}>
                  <img
                    src={svc.img}
                    alt={svc.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: 'var(--whitespace-md)', display: 'flex', flexDirection: 'column', gap: 'var(--whitespace-md)', flexGrow: 1 }}>
                <div className="card-icon-container" style={{ width: '44px', height: '44px', color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-light)', margin: '0' }}>
                  {getIcon(svc.iconKey)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '19px', fontWeight: '600', marginBottom: '10px' }}>{svc.title}</h3>
                  <p className="card-desc" style={{ fontSize: '14.5px', marginBottom: '20px', lineHeight: '1.5', flexGrow: 1 }}>{svc.desc}</p>
                  <button
                    className="btn-text"
                    style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '14px' }}
                    onClick={() => handleLearnMore(svc)}
                  >
                    Learn More
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
