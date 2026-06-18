import { motion } from 'framer-motion';

export default function Sales({ salesContent, onOpenContact }) {
  const title = salesContent?.title || 'Solution <strong>Areas</strong>';
  const subtitle = salesContent?.subtitle || 'Discover our tailored technology platforms designed to streamline synthesis, extraction, crystallization, and precision flow regulation under demanding R&D and manufacturing protocols.';

  const defaultSolutions = [
    {
      title: "Phase Separation & Extraction",
      points: [
        "Single & Multistage Continuous Operation",
        "Density Independent Separation",
        "Emulsion Separation",
        "Easy Scale Up from Lab to Plant"
      ]
    },
    {
      title: "Heterogeneous Catalysis / Hydrogenation",
      points: [
        "Modular Design",
        "Configuration Customization",
        "Enhanced Control & Performance",
        "Easy Scale Up from Lab to Plant"
      ]
    },
    {
      title: "Crystallization",
      points: [
        "Superior Crystal Quality",
        "Continuous Operation",
        "Easy Scale Up from Lab to Plant"
      ]
    },
    {
      title: "Partition Chromatography",
      points: [
        "No Solid Stationary Phase",
        "Low CAPEX",
        "Turn-Key Solution",
        "Easy Scale Up from Lab to Plant"
      ]
    },
    {
      title: "Pressure Regulation",
      points: [
        "Excellent Chemical Resistance",
        "User Selected Set Point up to 2 MPa",
        "Accurate & Precise Flow Control"
      ]
    }
  ];

  const solutions = salesContent?.solutions || defaultSolutions;

  const getSolutionIcon = (solTitle, index) => {
    const t = solTitle?.toLowerCase() || '';
    if (t.includes('separation') || t.includes('extraction')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      );
    }
    if (t.includes('catalysis') || t.includes('hydrogenation')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
          <path d="M12 8v8"></path>
        </svg>
      );
    }
    if (t.includes('crystallization')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          <line x1="12" y1="22" x2="12" y2="15.5"></line>
          <line x1="22" y1="8.5" x2="12" y2="12"></line>
          <line x1="2" y1="8.5" x2="12" y2="12"></line>
          <line x1="12" y1="12" x2="12" y2="2"></line>
        </svg>
      );
    }
    if (t.includes('chromatography')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      );
    }
    if (t.includes('regulation') || t.includes('pressure') || t.includes('metering') || t.includes('pump')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
      );
    }
    const icons = [
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>,
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>,
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon></svg>,
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg>,
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="20" y1="21" x2="20" y2="16"></line></svg>
    ];
    return icons[index % icons.length];
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingTop: 'var(--whitespace-xl)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Intro Banner */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: 'var(--whitespace-xl) 0' }}>
        <div className="container">
          <span className="section-meta" style={{ color: 'var(--accent-blue)' }}>Solutions & Sales</span>
          <h1 
            className="section-title" 
            style={{ fontSize: '48px', fontWeight: '300', marginBottom: 'var(--whitespace-md)' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="section-subtitle" style={{ margin: 0, maxWidth: '800px' }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Solutions Cards Grid */}
      <section className="section alt-bg" style={{ padding: 'var(--whitespace-xl) 0 0 0', borderBottom: 'none' }}>
        <div className="container">
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--whitespace-lg)' }}>
            {solutions.map((sol, idx) => (
              <motion.div 
                className="product-card" 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                style={{ padding: 'var(--whitespace-lg)' }}
              >
                <div className="card-icon-container" style={{ width: '48px', height: '48px', color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-light)' }}>
                  {getSolutionIcon(sol.title, idx)}
                </div>
                <h3 className="card-title" style={{ fontSize: '20px', marginBottom: 'var(--whitespace-md)' }}>{sol.title}</h3>
                
                <ul style={{ marginBottom: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sol.points?.map((pt, pIdx) => (
                    <li key={pIdx} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-blue)', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></span>
                      <span style={{ lineHeight: '1.4' }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--whitespace-xxl)', paddingBottom: 'var(--whitespace-xl)' }}>
            <button className="btn btn-primary" onClick={onOpenContact}>
              Request Technical Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
